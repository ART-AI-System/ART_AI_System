import { useState, useRef, useEffect } from 'react';
import { Search, Edit, Phone, Video, MoreVertical, CheckCheck, Paperclip, Smile, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useConversations } from '../../hooks/useConversations';
import { useMessages } from '../../hooks/useMessages';
import { chatService } from '../../services/chat.service';
import { chatSocketService } from '../../services/chat.socket';

const StudentMessagesPage = () => {
  const { user } = useAuth();
  const { conversations, setConversations, contacts, loading: loadingConversations } = useConversations();
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<any[]>([]);
  
  const { messages, loading: loadingMessages, hasMore, loadMore, sendMessage, page } = useMessages(activeRoomId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom conditionally
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      if (container.scrollHeight - container.scrollTop <= container.clientHeight + 150) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

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
          // Create real room
          const newRoom = await chatService.createRoom([contactId], 'direct');
          setConversations(prev => [newRoom, ...prev]);
          setActiveRoomId(newRoom._id);
          
          // Join room immediately before sending message so we receive the broadcast
          chatSocketService.getSocket()?.emit('chat:join_room', { roomId: newRoom._id });

          // Send message
          await sendMessage(content, newRoom._id);
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

  const activeConversation = conversations.find(c => c._id === activeRoomId);
  
  // Find other member details
  let otherMember = null;
  if (activeRoomId?.startsWith('temp_')) {
    const contactId = activeRoomId.replace('temp_', '');
    otherMember = contacts.find(c => c._id === contactId) || globalSearchResults.find(c => c._id === contactId);
  } else if (activeConversation && activeConversation.type === 'direct') {
    const otherMemberId = activeConversation.memberIds.find(id => id !== user?.id);
    otherMember = contacts.find(c => c._id === otherMemberId);
  }

  const filteredConversations = conversations.filter(conv => {
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
  });

  const searchResultContacts = searchQuery.trim() ? contacts.filter(contact => {
    const hasExistingConv = conversations.some(conv => conv.type === 'direct' && conv.memberIds.includes(contact._id));
    if (hasExistingConv) return false;

    const query = searchQuery.toLowerCase();
    const nameMatch = contact.fullName?.toLowerCase().includes(query) || false;
    const codeMatch = contact.studentCode?.toLowerCase().includes(query) || false;
    const userMatch = contact.username?.toLowerCase().includes(query) || false;
    
    return nameMatch || codeMatch || userMatch;
  }) : [];

  const combinedNewContacts = Array.from(new Map([...searchResultContacts, ...globalSearchResults].map(c => [c._id, c])).values()).filter(contact => {
    return !conversations.some(conv => conv.type === 'direct' && conv.memberIds.includes(contact._id));
  });

  return (
    <div className="flex-1 overflow-hidden p-6 h-[calc(100vh-6rem)]">
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex h-full overflow-hidden">
        
        {/* Chat List (Left) */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-[#1B2559]">Messages</h2>
            <button className="w-8 h-8 rounded-full bg-blue-50 text-[#4318FF] flex items-center justify-center hover:bg-[#4318FF] hover:text-white transition-colors">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..." 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#4318FF] focus:bg-white transition-colors" 
              />
            </div>
          </div>

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
                      avatarUrl = contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.fullName)}&background=EBF4FF&color=0072BC`;
                    } else {
                      avatarUrl = `https://ui-avatars.com/api/?name=Unknown&background=EBF4FF&color=0072BC`;
                    }
                  }

                  const unreadCount = 0; 
                  const timeString = conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';

                  return (
                    <div 
                      key={conv._id} 
                      onClick={() => setActiveRoomId(conv._id)}
                      className={`flex items-center p-4 cursor-pointer transition-colors ${isActive ? 'bg-blue-50/50 border-l-4 border-[#4318FF]' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                    >
                      <div className="relative">
                        {isGroup ? (
                          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-lg">GC</div>
                        ) : (
                          <img src={avatarUrl} className="w-12 h-12 rounded-full" alt="Avatar" />
                        )}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      </div>
                      <div className="ml-4 flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className={`text-sm font-bold truncate ${isActive ? 'text-[#1B2559]' : 'text-gray-600'}`}>{contactName}</h4>
                          <span className={`text-[10px] font-bold ${isActive ? 'text-[#4318FF]' : 'text-gray-400'}`}>{timeString}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={`text-xs font-medium truncate w-40 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>{conv.lastMessage || 'No messages yet'}</p>
                          {unreadCount > 0 && <span className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{unreadCount}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {combinedNewContacts.length > 0 && (
                  <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    New Contacts
                  </div>
                )}
                {combinedNewContacts.map(contact => {
                  const isActive = activeRoomId === `temp_${contact._id}`;
                  const avatarUrl = contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.fullName)}&background=EBF4FF&color=0072BC`;
                  return (
                    <div 
                      key={`temp_${contact._id}`} 
                      onClick={() => setActiveRoomId(`temp_${contact._id}`)}
                      className={`flex items-center p-4 cursor-pointer transition-colors ${isActive ? 'bg-blue-50/50 border-l-4 border-[#4318FF]' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                    >
                      <div className="relative">
                        <img src={avatarUrl} className="w-12 h-12 rounded-full" alt="Avatar" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-300 border-2 border-white rounded-full"></span>
                      </div>
                      <div className="ml-4 flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className={`text-sm font-bold truncate ${isActive ? 'text-[#1B2559]' : 'text-gray-600'}`}>{contact.fullName}</h4>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className={`text-xs font-medium truncate w-40 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>Start a new conversation...</p>
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

        {/* Chat Window (Right) */}
        <div className="flex-1 flex flex-col bg-white relative">
          {activeRoomId ? (
            <>
              {/* Chat Header */}
              <div className="h-20 border-b border-gray-100 flex justify-between items-center px-6">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={otherMember?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherMember?.fullName || 'Group')}&background=EBF4FF&color=0072BC`} 
                      className="w-10 h-10 rounded-full shadow-sm" 
                      alt="Avatar" 
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-[#1B2559]">{otherMember?.fullName || (activeConversation?.type === 'group' ? 'Group Chat' : 'Unknown')}</h3>
                    <p className="text-xs font-medium text-green-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-gray-50/30"
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
                        <button onClick={() => loadMore()} className="text-xs font-bold text-gray-400 hover:text-blue-500 bg-gray-100 px-3 py-1 rounded-full">
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
                          <div key={msg._id} className="flex items-end justify-end">
                            <div className="mr-3 max-w-[70%]">
                              <div className="bg-[#4318FF] p-4 rounded-2xl rounded-br-none shadow-sm text-white">
                                <p className="text-sm font-medium">{msg.content}</p>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 mr-1 mt-1 block text-right">
                                {time} {isRead ? <CheckCheck className="w-3 h-3 inline text-blue-500" /> : <CheckCheck className="w-3 h-3 inline text-gray-400" />}
                              </span>
                            </div>
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=F26F21&color=fff`} className="w-8 h-8 rounded-full mb-1" alt="Avatar" />
                          </div>
                        );
                      } else {
                        return (
                          <div key={msg._id} className="flex items-end">
                            <img src={otherMember?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherMember?.fullName || 'User')}&background=EBF4FF&color=0072BC`} className="w-8 h-8 rounded-full mb-1" alt="Avatar" />
                            <div className="ml-3 max-w-[70%]">
                              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-sm">
                                <p className="text-sm font-medium text-gray-700">{msg.content}</p>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 ml-1 mt-1 block">{time}</span>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="h-20 border-t border-gray-100 flex items-center px-4 bg-white">
                <button className="p-2 text-gray-400 hover:text-[#4318FF] transition-colors"><Paperclip className="w-5 h-5" /></button>
                <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors mr-2"><Smile className="w-5 h-5" /></button>
                
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type your message..." 
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4318FF] focus:bg-white transition-colors font-medium" 
                />
                
                <button 
                  onClick={handleSendMessage}
                  className="ml-4 w-10 h-10 rounded-xl bg-[#4318FF] text-white flex items-center justify-center shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-blue-200" />
              </div>
              <p className="font-medium text-gray-500">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMessagesPage;
