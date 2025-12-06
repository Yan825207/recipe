import React, { useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { Recipe } from '../types';
import { ChevronLeft, Clock, Users, PlayCircle, BookOpen, ExternalLink, Flame } from 'lucide-react';

const RecipeDetail: React.FC = () => {
  const location = useLocation();
  const recipe = location.state?.recipe as Recipe;
  const [activeTab, setActiveTab] = useState<'guide' | 'video'>('guide');

  if (!recipe) {
    return <Navigate to="/" />;
  }

  const videoSearchUrl = `https://www.bilibili.com/search?keyword=${encodeURIComponent(recipe.name + ' 做法')}`;

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen md:min-h-0 md:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden pb-10">
      {/* Header Image */}
      <div className="relative h-72 md:h-96 w-full group">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
          <Link 
            to={-1 as any} 
            className="flex items-center gap-2 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-md px-4 py-2 rounded-full transition-all"
          >
            <ChevronLeft size={20} /> <span className="text-sm font-medium">返回</span>
          </Link>
        </div>

        {/* Title Block */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-shadow-lg">{recipe.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <Clock size={16} /> {recipe.cookingTime}
            </span>
            <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <Users size={16} /> {recipe.difficulty}
            </span>
            {recipe.calories && (
                <span className="flex items-center gap-2 bg-orange-500/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-orange-400/30 text-white">
                    <Flame size={16} fill="currentColor" /> {recipe.calories} 千卡
                </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-5 text-center font-bold flex items-center justify-center gap-2 transition-all relative text-lg
            ${activeTab === 'guide' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <BookOpen size={20} className={activeTab === 'guide' ? 'text-orange-500' : ''} /> 
          图文教程
          {activeTab === 'guide' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-orange-500 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-5 text-center font-bold flex items-center justify-center gap-2 transition-all relative text-lg
            ${activeTab === 'video' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <PlayCircle size={20} className={activeTab === 'video' ? 'text-pink-500' : ''} /> 
          视频教程
          {activeTab === 'video' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-pink-500 rounded-t-full"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-10 min-h-[400px]">
        {activeTab === 'guide' ? (
          <div className="animate-fade-in max-w-3xl mx-auto">
            
            <div className="bg-orange-50/50 rounded-2xl p-6 md:p-8 mb-10 border border-orange-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-orange-500 w-1.5 h-6 rounded-full"></span>
                所需食材
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                    <span className="text-gray-700 font-medium">{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="bg-gray-900 w-1.5 h-6 rounded-full"></span>
                烹饪步骤
              </h3>
              <div className="space-y-10 relative pl-4 md:pl-0">
                {/* Vertical Line */}
                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-100 hidden md:block"></div>

                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="hidden md:flex flex-shrink-0 w-16 h-16 rounded-2xl bg-white border-2 border-orange-100 text-orange-500 items-center justify-center font-bold text-2xl shadow-sm group-hover:border-orange-500 group-hover:scale-110 transition-all z-10 relative">
                      {i + 1}
                    </div>
                    {/* Mobile Step Number */}
                     <div className="md:hidden flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm mt-1">
                      {i + 1}
                    </div>
                    
                    <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-gray-700 leading-8 text-lg">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
            <div className="relative group cursor-pointer mb-8">
                <div className="absolute inset-0 bg-pink-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="bg-white p-6 rounded-full shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <PlayCircle size={64} className="text-[#FB7299]" />
                </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">观看「{recipe.name}」制作视频</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
              文字太枯燥？我们为您在 Bilibili 准备了高清视频教程，从备菜到出锅，手把手教您做。
            </p>
            
            <a 
              href={videoSearchUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#FB7299] hover:bg-[#E4668A] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-[#FB7299]/30 hover:shadow-xl hover:-translate-y-1"
            >
              <ExternalLink size={20} />
              前往 Bilibili 观看
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;