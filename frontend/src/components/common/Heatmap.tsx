import { useState } from 'react';

export const Heatmap = () => {
  const [weeks] = useState(40);
  const [days] = useState(7);
  const [heatData] = useState<number[][]>(() => {
    const data: number[][] = [];
    for (let i = 0; i < weeks; i++) {
      const col: number[] = [];
      for (let j = 0; j < days; j++) {
        let heatLevel = 0;
        const rand = Math.random();
        if (rand > 0.6) heatLevel = 1;
        if (rand > 0.8) heatLevel = 2;
        if (rand > 0.9) heatLevel = 3;
        if (rand > 0.95) heatLevel = 4;
        col.push(heatLevel);
      }
      data.push(col);
    }
    return data;
  });

  const heatColor = (level: number) => {
    switch(level) {
      case 0: return 'bg-[#f1f5f9]';
      case 1: return 'bg-[#fed7aa]';
      case 2: return 'bg-[#fb923c]';
      case 3: return 'bg-[#ea580c]';
      case 4: return 'bg-[#9a3412]';
      default: return 'bg-[#f1f5f9]';
    }
  };

  return (
    <div className="overflow-x-auto hide-scrollbar mt-2">
      <div className="flex items-end">
        {/* Y Axis (Days) */}
        <div className="flex flex-col justify-between h-[108px] text-[10px] text-gray-400 font-medium pr-2 pb-1">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        
        <div className="flex flex-col flex-1">
          {/* X Axis (Months) */}
          <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-2 pl-1 w-full min-w-[500px]">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
          </div>
          {/* Squares Grid */}
          <div className="flex gap-1 min-w-[500px]">
            {heatData.map((col, i) => (
              <div key={i} className="flex flex-col gap-1">
                {col.map((level, j) => {
                  const date = new Date(2026, 0, 1 + (i * 7) + j);
                  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <div 
                      key={j} 
                      className={`w-3 h-3 rounded-[2px] ${heatColor(level)} hover:ring-2 hover:ring-gray-400 cursor-pointer transition-all relative group`}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                        {level} activities on {dateStr}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
