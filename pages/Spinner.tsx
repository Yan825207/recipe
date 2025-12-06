import React, { useState, useEffect } from 'react';
import { SpinnerOption } from '../types';
import { Plus, Trash2, RotateCw, Utensils, Coffee, Zap, RotateCcw } from 'lucide-react';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#F1948A'];

// Initial presets
const DEFAULT_PRESETS: Record<string, any[]> = {
  default: [
    { id: '1', label: '红烧肉', color: COLORS[0] },
    { id: '2', label: '宫保鸡丁', color: COLORS[1] },
    { id: '3', label: '清蒸鱼', color: COLORS[2] },
    { id: '4', label: '麻婆豆腐', color: COLORS[3] },
  ],
  takeout: [
    { id: 't1', label: '炸鸡汉堡', color: COLORS[0] },
    { id: 't2', label: '披萨', color: COLORS[1] },
    { id: 't3', label: '烧烤', color: COLORS[2] },
    { id: 't4', label: '麻辣烫', color: COLORS[3] },
    { id: 't5', label: '盖浇饭', color: COLORS[4] },
  ],
  healthy: [
    { id: 'h1', label: '蔬菜沙拉', color: COLORS[5] },
    { id: 'h2', label: '全麦三明治', color: COLORS[6] },
    { id: 'h3', label: '荞麦面', color: COLORS[7] },
    { id: 'h4', label: '水煮鸡胸', color: COLORS[0] },
  ]
};

const Spinner: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<string>('default');
  const [options, setOptions] = useState<SpinnerOption[]>([]);
  const [newOption, setNewOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<SpinnerOption | null>(null);

  // Load options from localStorage when mode changes
  useEffect(() => {
    const loadOptions = () => {
      const savedKey = `spinner_options_${currentMode}`;
      const savedData = localStorage.getItem(savedKey);
      
      if (savedData) {
        try {
          setOptions(JSON.parse(savedData));
        } catch (e) {
          console.error("Failed to parse saved spinner options", e);
          setOptions(DEFAULT_PRESETS[currentMode]);
        }
      } else {
        setOptions(DEFAULT_PRESETS[currentMode]);
      }
    };
    
    setWinner(null);
    setRotation(0);
    loadOptions();
  }, [currentMode]);

  // Save options to localStorage whenever they change
  useEffect(() => {
    if (options.length > 0) {
      localStorage.setItem(`spinner_options_${currentMode}`, JSON.stringify(options));
    }
  }, [options, currentMode]);

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([
        ...options,
        {
          id: Date.now().toString(),
          label: newOption.trim(),
          color: COLORS[options.length % COLORS.length]
        }
      ]);
      setNewOption('');
    }
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const resetToDefault = () => {
    if (window.confirm('确定要恢复该场景的默认选项吗？您的自定义修改将丢失。')) {
       const defaults = DEFAULT_PRESETS[currentMode];
       setOptions(defaults);
       localStorage.setItem(`spinner_options_${currentMode}`, JSON.stringify(defaults));
       setWinner(null);
    }
  };

  const spin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    // Random rotations (at least 5 full spins + random segment)
    const extraSpins = 8;
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (360 * extraSpins) + randomDegree;
    
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = totalRotation % 360;
      const sectorSize = 360 / options.length;
      
      // Calculate which index is at the top pointer (considering rotation moves the wheel)
      // Since the wheel rotates clockwise, we need to map the final angle to the segment.
      // 0 degrees is top.
      const winningIndex = Math.floor(((360 - normalizedRotation) % 360) / sectorSize);
      setWinner(options[winningIndex]);
    }, 3500); // Animation duration
  };

  const getWheelBackground = () => {
    const sectorSize = 360 / options.length;
    const gradientParts = options.map((opt, i) => {
      const start = i * sectorSize;
      const end = (i + 1) * sectorSize;
      return `${opt.color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${gradientParts.join(', ')})`;
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      {/* Settings Panel */}
      <div className="w-full md:w-1/3 order-2 md:order-1 space-y-6">
        
        {/* Presets */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">场景选择</h3>
              {JSON.stringify(options) !== JSON.stringify(DEFAULT_PRESETS[currentMode]) && (
                <button 
                  onClick={resetToDefault} 
                  className="text-xs text-orange-500 hover:text-orange-700 flex items-center gap-1"
                  title="恢复默认设置"
                >
                  <RotateCcw size={12} /> 恢复默认
                </button>
              )}
           </div>
           
           <div className="flex gap-2">
             <button 
                onClick={() => setCurrentMode('default')} 
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 border-2
                    ${currentMode === 'default' 
                        ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' 
                        : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'}`}
             >
                <Utensils size={20} />
                <span className="text-xs font-medium">家常菜</span>
             </button>
             <button 
                onClick={() => setCurrentMode('takeout')} 
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 border-2
                    ${currentMode === 'takeout' 
                        ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                        : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'}`}
             >
                <Zap size={20} />
                <span className="text-xs font-medium">外卖</span>
             </button>
             <button 
                onClick={() => setCurrentMode('healthy')} 
                className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200 border-2
                    ${currentMode === 'healthy' 
                        ? 'bg-green-50 border-green-200 text-green-600 shadow-sm' 
                        : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'}`}
             >
                <Coffee size={20} />
                <span className="text-xs font-medium">轻食</span>
             </button>
           </div>
        </div>

        {/* Customization */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <RotateCw size={20} className="text-orange-500" /> 
            编辑选项 <span className="text-xs font-normal text-gray-400 ml-auto">已自动保存</span>
          </h2>
          
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
              placeholder="输入选项..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button onClick={addOption} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {options.map((opt) => (
              <div key={opt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: opt.color }}></div>
                  <span className="font-medium text-gray-700">{opt.label}</span>
                </div>
                <button onClick={() => removeOption(opt.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {options.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">暂无选项，请添加</p>
            )}
          </div>
        </div>
      </div>

      {/* Wheel Panel */}
      <div className="w-full md:flex-1 order-1 md:order-2 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
         <h2 className="text-2xl font-bold text-gray-800 mb-8">今天吃什么？</h2>
         
         <div className="relative mb-8">
           {/* Pointer */}
           <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 w-0 h-0 
             border-l-[15px] border-l-transparent
             border-r-[15px] border-r-transparent
             border-t-[30px] border-t-gray-800 filter drop-shadow-md">
           </div>

           {/* Wheel */}
           <div 
             className="w-72 h-72 md:w-96 md:h-96 rounded-full shadow-2xl transition-transform ease-[cubic-bezier(0.25,0.1,0.25,1)] border-4 border-white relative overflow-hidden"
             style={{ 
               background: options.length > 0 ? getWheelBackground() : '#eee',
               transform: `rotate(${rotation}deg)`,
               transitionDuration: isSpinning ? '3.5s' : '0s'
             }}
           >
             {options.map((opt, i) => {
               const sectorAngle = 360 / options.length;
               const rotate = i * sectorAngle + sectorAngle / 2;
               return (
                 <div
                   key={opt.id}
                   className="absolute top-0 left-1/2 w-12 h-[50%] pt-6 flex justify-start items-center flex-col z-10"
                   style={{
                     transform: `translateX(-50%) rotate(${rotate}deg)`,
                     transformOrigin: 'bottom center',
                   }}
                 >
                   <span 
                    className="text-white font-bold text-sm md:text-base drop-shadow-md select-none tracking-widest line-clamp-6" 
                    style={{ 
                      writingMode: 'vertical-rl', 
                      textOrientation: 'upright',
                      maxHeight: '80%'
                    }}
                   >
                     {opt.label}
                   </span>
                 </div>
               );
             })}
           </div>
           
           {/* Center Button */}
           <button 
             onClick={spin}
             disabled={isSpinning || options.length < 2}
             className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
               w-20 h-20 bg-white rounded-full shadow-lg border-4 border-orange-50 
               flex items-center justify-center font-bold text-orange-600 hover:scale-105 active:scale-95 transition-all z-20 text-lg disabled:opacity-80 disabled:cursor-not-allowed"
           >
             {isSpinning ? '...' : '开始'}
           </button>
         </div>

         {/* Winner Display */}
         <div className="h-20 flex items-center justify-center w-full">
            {winner && !isSpinning ? (
            <div className="text-center animate-bounce">
                <p className="text-gray-500 text-sm font-medium mb-1">决定就是它了！</p>
                <h3 className="text-4xl font-bold text-gray-800" style={{ color: winner.color }}>
                {winner.label}
                </h3>
            </div>
            ) : (
                isSpinning && <p className="text-gray-400 font-medium animate-pulse">命运齿轮转动中...</p>
            )}
         </div>
      </div>
    </div>
  );
};

export default Spinner;