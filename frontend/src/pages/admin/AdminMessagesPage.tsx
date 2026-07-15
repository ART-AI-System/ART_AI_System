import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, Edit, CheckCheck, Check, Paperclip, Image as ImageIcon, Send, MoreVertical, Smile } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useConversations } from '../../hooks/useConversations';
import { useMessages } from '../../hooks/useMessages';
import { chatService } from '../../services/chat.service';
import { chatSocketService } from '../../services/chat.socket';

const AdminMessagesPage = () => {
  const { user } = useAuth();
  const { conversations, setConversations, contacts, loading: loadingConversations } = useConversations();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<any[]>([]);
  
  const handleMessageSent = useCallback((msg: any) => {
    setConversations(prev => {
      const idx = prev.findIndex(r => r._id === msg.roomId);
      if (idx > -1) {
        const updatedRoom = { ...prev[idx], lastMessage: msg.content, lastMessageAt: msg.createdAt };
        const newConversations = [...prev];
        newConversations.splice(idx, 1);
        newConversations.unshift(updatedRoom);
        return newConversations;
      }
      return prev;
    });
  }, [setConversations]);

  const { messages, loading: loadingMessages, hasMore, loadMore, sendMessage, page } = useMessages(activeRoomId, { onMessageSent: handleMessageSent });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const prevRoomId = useRef<string | null>(null);

  // Auto scroll logic
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const container = messagesContainerRef.current;
      const isNewRoom = prevRoomId.current !== activeRoomId;
      
      if (isNewRoom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        prevRoomId.current = activeRoomId;
      } else if (container.scrollHeight - container.scrollTop <= container.clientHeight + 150) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, activeRoomId]);

  // Global search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        chatService.searchGlobalUsers(searchQuery).then(results => {
          setGlobalSearchResults(results);
        }).catch(err => console.error(err));
      } else {
        setGlobalSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      if (messagesContainerRef.current.scrollTop === 0 && hasMore && !loadingMessages) {
        const oldScrollHeight = messagesContainerRef.current.scrollHeight;
        loadMore();
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight - oldScrollHeight;
          }
        }, 0);
      }
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const content = messageInput.trim();
      setMessageInput('');

      if (activeRoomId?.startsWith('temp_')) {
        const contactId = activeRoomId.replace('temp_', '');
        try {
          const newRoom = await chatService.createRoom([contactId], 'direct');
          
          // Join room immediately and send message so it saves to DB
          chatSocketService.getSocket()?.emit('chat:join_room', { roomId: newRoom._id });
          const sentMsg = await chatService.sendMessage(newRoom._id, content);
          newRoom.lastMessage = sentMsg.content;
          newRoom.lastMessageAt = sentMsg.createdAt;
          
          // Update UI state - this will trigger useMessages to fetch the newly created message
          setConversations(prev => {
            if (prev.some(c => c._id === newRoom._id)) return prev;
            return [newRoom, ...prev];
          });
          setActiveRoomId(newRoom._id);
        } catch (error: any) {
          const errMsg = error.response?.data?.message || 'Failed to create room and send message. You may not have permission to chat with this user.';
          alert(errMsg);
          console.error('Failed to create room and send message', error);
        }
      } else {
        sendMessage(content);
      }

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const activeConversation = useMemo(() => conversations.find(c => c._id === activeRoomId), [conversations, activeRoomId]);
  
  const otherMember = useMemo(() => {
    let member = null;
    if (activeRoomId?.startsWith('temp_')) {
      const contactId = activeRoomId.replace('temp_', '');
      member = contacts.find(c => c._id === contactId) || globalSearchResults.find(c => c._id === contactId);
    } else if (activeConversation && activeConversation.type === 'direct') {
      const otherMemberId = activeConversation.memberIds.find(id => id !== user?.id);
      member = contacts.find(c => c._id === otherMemberId);
    }
    return member;
  }, [activeRoomId, activeConversation, contacts, globalSearchResults, user?.id]);

  const filteredConversations = useMemo(() => conversations.filter(conv => {
    if (!searchQuery.trim()) return true;
    
    if (conv.type === 'group') {
      return 'group chat'.includes(searchQuery.toLowerCase());
    }
    
    const otherId = conv.memberIds.find(id => id !== user?.id);
    const contact = contacts.find(c => c._id === otherId);
    if (!contact) return false;
    
    const query = searchQuery.toLowerCase();
    const nameMatch = contact.fullName?.toLowerCase().includes(query) || false;
    const codeMatch = contact.studentCode?.toLowerCase().includes(query) || false;
    const userMatch = contact.username?.toLowerCase().includes(query) || false;
    
    return nameMatch || codeMatch || userMatch;
  }), [conversations, searchQuery, contacts, user?.id]);

  const searchResultContacts = useMemo(() => searchQuery.trim() ? contacts.filter(contact => {
    const hasExistingConv = conversations.some(conv => conv.type === 'direct' && conv.memberIds.includes(contact._id));
    if (hasExistingConv) return false;

    const query = searchQuery.toLowerCase();
    const nameMatch = contact.fullName?.toLowerCase().includes(query) || false;
    const codeMatch = contact.studentCode?.toLowerCase().includes(query) || false;
    const userMatch = contact.username?.toLowerCase().includes(query) || false;
    
    return nameMatch || codeMatch || userMatch;
  }) : [], [searchQuery, contacts, conversations]);

  const combinedNewContacts = useMemo(() => Array.from(new Map([...searchResultContacts, ...globalSearchResults].map(c => [c._id, c])).values()).filter(contact => {
    return !conversations.some(conv => conv.type === 'direct' && conv.memberIds.includes(contact._id));
  }), [searchResultContacts, globalSearchResults, conversations]);

  return (
    <div className="flex-1 flex overflow-hidden p-6 gap-6 h-[calc(100vh-6rem)]">
      {/* CHAT LIST (LEFT COLUMN) */}
      <div className="w-80 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
        {/* Search & New Message */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#1B2559]">Chats</h2>
            <button className="w-8 h-8 rounded-full bg-blue-50 text-[#4318FF] hover:bg-[#4318FF] hover:text-white flex items-center justify-center transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..." 
              className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#4318FF]/20 focus:outline-none placeholder-gray-400 text-[#1B2559]" 
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {loadingConversations ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading conversations...</div>
          ) : (
            <>
              {filteredConversations.map(conv => {
                const isActive = conv._id === activeRoomId;
                
                let contactName = 'Unknown';
                let avatarUrl = '';
                let isGroup = conv.type === 'group';

                if (isGroup) {
                  contactName = 'Group Chat';
                  avatarUrl = `https://ui-avatars.com/api/?name=GC&background=FFF7ED&color=F97316`;
                } else {
                  const otherId = conv.memberIds.find(id => id !== user?.id);
                  const contact = contacts.find(c => c._id === otherId);
                  if (contact) {
                    contactName = contact.fullName;
                    avatarUrl = contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.fullName)}&background=F26F21&color=fff`;
                  } else {
                    avatarUrl = `https://ui-avatars.com/api/?name=Unknown&background=F26F21&color=fff`;
                  }
                }

                const unreadCount = 0;
                const timeString = conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';

                return (
                  <div 
                    key={conv._id}
                    onClick={() => setActiveRoomId(conv._id)}
                    className={`px-6 py-4 border-b border-gray-50 cursor-pointer transition-colors flex items-center relative ${isActive ? 'bg-blue-50/50 hover:bg-blue-50/80' : 'hover:bg-gray-50'}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4318FF]"></div>}
                    <div className="relative mr-4">
                      {isGroup ? (
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">GC</div>
                      ) : (
                        <img src={avatarUrl} className="w-12 h-12 rounded-full border border-gray-200" alt="Avatar" />
                      )}
                      <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-sm font-bold truncate ${isActive ? 'text-[#1B2559]' : 'text-gray-700'}`}>{contactName}</h3>
                        <span className={`text-[10px] font-bold ${isActive ? 'text-[#4318FF]' : 'text-gray-400'}`}>{timeString}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs font-medium truncate ${isActive ? 'text-[#4318FF]' : 'text-gray-500'}`}>{conv.lastMessage || 'No messages yet'}</p>
                        {unreadCount > 0 && <span className="w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center text-[9px] font-bold ml-2">{unreadCount}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {combinedNewContacts.length > 0 && (
                <div className="px-6 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  New Contacts
                </div>
              )}
              {combinedNewContacts.map(contact => {
                const isActive = activeRoomId === `temp_${contact._id}`;
                const avatarUrl = contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.fullName)}&background=F26F21&color=fff`;
                return (
                  <div 
                    key={`temp_${contact._id}`}
                    onClick={() => setActiveRoomId(`temp_${contact._id}`)}
                    className={`px-6 py-4 border-b border-gray-50 cursor-pointer transition-colors flex items-center relative ${isActive ? 'bg-blue-50/50 hover:bg-blue-50/80' : 'hover:bg-gray-50'}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4318FF]"></div>}
                    <div className="relative mr-4">
                      <img src={avatarUrl} className="w-12 h-12 rounded-full border border-gray-200" alt="Avatar" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-sm font-bold truncate ${isActive ? 'text-[#1B2559]' : 'text-gray-700'}`}>{contact.fullName}</h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs font-medium truncate ${isActive ? 'text-[#4318FF]' : 'text-gray-500'}`}>Start a new conversation...</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredConversations.length === 0 && combinedNewContacts.length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">No results found.</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CHAT DETAIL (RIGHT COLUMN) */}
      <div className="flex-1 bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
        {activeRoomId ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <img src={otherMember?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherMember?.fullName || 'Group')}&background=F26F21&color=fff`} className="w-10 h-10 rounded-full border border-gray-200" alt="Avatar" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1B2559]">{otherMember?.fullName || (activeConversation?.type === 'group' ? 'Group Chat' : 'Unknown')}</h2>
                  <p className="text-xs font-medium text-green-500">Online</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="w-9 h-9 rounded-full hover:bg-gray-50 text-gray-400 hover:text-[#1B2559] flex items-center justify-center transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-full hover:bg-gray-50 text-gray-400 hover:text-[#1B2559] flex items-center justify-center transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30"
            >
              {activeRoomId.startsWith('temp_') ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                  <Smile className="w-12 h-12 text-blue-200" />
                  <p className="text-sm font-medium">Say hi to start a conversation!</p>
                </div>
              ) : loadingMessages && page === 1 ? (
                <div className="text-center text-sm text-gray-500">Loading messages...</div>
              ) : (
                <>
                  {hasMore && (
                    <div className="flex justify-center">
                      <button onClick={() => loadMore()} className="bg-white border border-gray-100 hover:text-[#4318FF] px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider shadow-sm">
                        {loadingMessages ? 'Loading...' : 'Load Older Messages'}
                      </button>
                    </div>
                  )}

                  {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    const time = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    const isRead = msg.readBy && msg.readBy.length > 1;

                    if (isMe) {
                      return (
                        <div key={msg._id} className="flex justify-end max-w-[70%] ml-auto">
                          <div className="flex flex-col items-end">
                            <div className="bg-[#4318FF] text-white px-5 py-3.5 rounded-[20px] rounded-br-sm shadow-md shadow-blue-500/20 text-sm leading-relaxed">
                              {msg.content}
                            </div>
                            <div className="flex items-center mt-1 mr-1">
                              <span className="text-[10px] font-bold text-gray-400 mr-1.5">{time}</span>
                              {isRead ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> : <Check className="w-3.5 h-3.5 text-gray-400" />}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={msg._id} className="flex max-w-[70%]">
                          <img src={otherMember?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherMember?.fullName || 'User')}&background=F26F21&color=fff`} className="w-8 h-8 rounded-full mr-3 self-end shadow-sm" alt="Avatar" />
                          <div>
                            <div className="bg-white border border-gray-100 text-[#1B2559] px-5 py-3.5 rounded-[20px] rounded-bl-sm shadow-sm text-sm leading-relaxed">
                              {msg.content}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 mt-1 ml-1 block">{time}</span>
                          </div>
                        </div>
                      );
                    }
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-5 border-t border-gray-100 bg-white">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full pr-2 pl-4 py-2 focus-within:ring-2 focus-within:ring-[#4318FF]/20 focus-within:border-[#4318FF] transition-all">
                <button className="p-2 text-gray-400 hover:text-[#F26F21] transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-[#F26F21] transition-colors mr-2">
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#1B2559] placeholder-gray-400" 
                />
                
                <button 
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-full bg-[#4318FF] text-white flex items-center justify-center shadow-md shadow-blue-500/30 hover:bg-[#3311CC] hover:scale-105 transition-all ml-2"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-blue-200" />
            </div>
            <p className="font-medium text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
