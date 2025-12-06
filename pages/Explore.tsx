import React, { useState } from 'react';
import { Search, Compass, AlertCircle } from 'lucide-react';
import { getCitySpecialties } from '../services/geminiService';
import { Recipe, LoadingState } from '../types';
import RecipeCard from '../components/RecipeCard';
import ChefLoader from '../components/ChefLoader';

const POPULAR_CITIES = ['成都', '广州', '北京', '上海', '西安', '重庆', '长沙', '武汉', '杭州', '南京', '兰州', '哈尔滨'];

const Explore: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const fetchRecipes = async (city: string) => {
    setSelectedCity(city);
    setStatus(LoadingState.LOADING);
    setRecipes([]);
    try {
      const result = await getCitySpecialties(city);
      setRecipes(result);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      fetchRecipes(customCity.trim());
      setSelectedCity(customCity.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">美食地图</h2>
        <p className="text-gray-500 text-lg">足不出户，探索中国各地的地道风味与特色菜肴。</p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 sticky top-0 md:relative z-20">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 pt-2 px-2 no-scrollbar scroll-smooth">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => fetchRecipes(city)}
              className={`px-6 py-3 rounded-xl whitespace-nowrap font-bold text-sm transition-all duration-300
                ${selectedCity === city 
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105' 
                  : 'bg-gray-50 text-gray-500 hover:bg-white hover:text-orange-500 hover:shadow-md'}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-12 relative max-w-xl mx-auto md:mx-0">
        <input
          type="text"
          value={customCity}
          onChange={(e) => setCustomCity(e.target.value)}
          placeholder="搜索其他城市（如：苏州、天津）..."
          className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
        />
        <Search className="absolute left-4 top-4.5 text-gray-400" size={22} />
        <button type="submit" className="absolute right-2 top-2 bottom-2 bg-orange-500 text-white px-6 rounded-xl font-medium hover:bg-orange-600 transition-colors">
            探索
        </button>
      </form>

      {status === LoadingState.IDLE && (
         <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
                <Compass size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">准备好出发了吗？</h3>
            <p className="text-gray-500">点击上方城市标签，或输入你想去的城市，开启美食之旅。</p>
         </div>
      )}

      {status === LoadingState.LOADING && <ChefLoader />}

      {status === LoadingState.SUCCESS && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in pb-12">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {status === LoadingState.ERROR && (
         <div className="text-center py-12 bg-red-50 rounded-2xl text-red-600 border border-red-100 flex flex-col items-center">
           <AlertCircle size={40} className="mb-3 opacity-50" />
           <p>获取数据失败，请检查网络或 Key 后稍后重试。</p>
         </div>
      )}
    </div>
  );
};

export default Explore;