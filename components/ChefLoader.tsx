import React, { useState, useEffect } from 'react';
import { ChefHat, Loader2, Utensils, Soup } from 'lucide-react';

const LOADING_TEXTS = [
  "正在挑选最新鲜的食材...",
  "AI 大厨正在构思绝妙搭配...",
  "正在调整火候...",
  "正在尝试摆盘...",
  "撒上一把灵魂葱花...",
  "正在查询米其林食谱...",
  "香气马上就要溢出来了..."
];

const ChefLoader: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
        <div className="bg-white p-6 rounded-full shadow-xl border-4 border-orange-50 relative z-10">
           <div className="relative">
              <ChefHat size={48} className="text-orange-500 animate-bounce" />
              <div className="absolute -right-2 -bottom-2 bg-yellow-400 rounded-full p-1.5 animate-spin-slow">
                <Utensils size={14} className="text-white" />
              </div>
           </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-2 transition-all duration-500 min-h-[28px]">
        {LOADING_TEXTS[textIndex]}
      </h3>
      <p className="text-gray-400 text-sm flex items-center gap-2">
        <Loader2 size={14} className="animate-spin" />
        生成过程通常需要 5-10 秒，请耐心等待
      </p>
    </div>
  );
};

export default ChefLoader;