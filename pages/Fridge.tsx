import React, { useState } from 'react';
import { Plus, X, Sparkles, Tag, Search, ChefHat, AlertCircle } from 'lucide-react';
import { generateRecipesFromIngredients } from '../services/geminiService';
import { Recipe, LoadingState } from '../types';
import RecipeCard from '../components/RecipeCard';
import ChefLoader from '../components/ChefLoader';

const COMMON_INGREDIENTS = ['鸡蛋', '西红柿', '土豆', '猪肉', '鸡肉', '豆腐', '青椒', '洋葱', '牛肉', '胡萝卜', '虾', '茄子'];

const Fridge: React.FC = () => {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const addIngredient = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient(input);
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;
    
    setStatus(LoadingState.LOADING);
    setRecipes([]); // Clear previous results immediately
    try {
      const result = await generateRecipesFromIngredients(ingredients);
      setRecipes(result);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">智能冰箱</h2>
        <p className="text-gray-500 text-lg">输入你冰箱里现有的食材，AI 大厨为您定制美味食谱。</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 mb-10 transition-all hover:shadow-2xl hover:shadow-gray-200/50">
        <div className="relative mb-8">
           <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入食材名称（如：排骨、白菜...）"
            className="w-full bg-gray-50 border-2 border-transparent hover:bg-white hover:border-orange-100 focus:bg-white focus:border-orange-500 rounded-2xl px-6 py-4 pr-32 text-lg focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-400"
          />
          <button 
            onClick={() => addIngredient(input)}
            className="absolute right-2 top-2 bottom-2 bg-gray-900 hover:bg-orange-500 text-white px-6 rounded-xl font-medium transition-colors shadow-sm"
          >
            添加
          </button>
        </div>

        {/* Quick Add Tags */}
        <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Tag size={14} /> 常见食材一键添加
            </p>
            <div className="flex flex-wrap gap-2.5">
                {COMMON_INGREDIENTS.map(item => (
                    <button 
                        key={item}
                        onClick={() => addIngredient(item)}
                        disabled={ingredients.includes(item)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${ingredients.includes(item) 
                                ? 'bg-orange-50 text-orange-400 ring-1 ring-orange-200 cursor-default' 
                                : 'bg-gray-50 text-gray-600 hover:bg-white hover:text-orange-600 hover:shadow-md hover:-translate-y-0.5 ring-1 ring-gray-100'}`}
                    >
                        {ingredients.includes(item) ? '✓ ' : '+ '}{item}
                    </button>
                ))}
            </div>
        </div>

        {/* Selected Ingredients Area */}
        <div className={`transition-all duration-500 ease-in-out ${ingredients.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'}`}>
          <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
             <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-gray-700">已选食材 ({ingredients.length})</span>
                <button onClick={() => setIngredients([])} className="text-xs text-red-400 hover:text-red-600 font-medium">清空全部</button>
             </div>
             <div className="flex flex-wrap gap-3">
                {ingredients.map((ing) => (
                <span key={ing} className="bg-gradient-to-r from-orange-500 to-orange-400 text-white pl-4 pr-2 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-500/20 animate-fade-in group">
                    {ing}
                    <button onClick={() => removeIngredient(ing)} className="bg-white/20 hover:bg-white/40 rounded-full p-0.5 transition-colors">
                      <X size={14} />
                    </button>
                </span>
                ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={status === LoadingState.LOADING}
            className="w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300
              bg-gray-900 hover:bg-orange-500 text-white shadow-xl hover:shadow-orange-500/30 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === LoadingState.LOADING ? (
              <>
                 AI 正在思考中...
              </>
            ) : (
              <>
                <Sparkles size={24} className="text-yellow-300" />
                开始生成菜谱
              </>
            )}
          </button>
        </div>
        
        {ingredients.length === 0 && (
            <div className="text-center py-8 text-gray-400 border-t border-dashed border-gray-100 pt-8">
                <div className="inline-block p-4 rounded-full bg-gray-50 mb-3">
                    <ChefHat size={32} className="text-gray-300" />
                </div>
                <p>请至少添加一种食材，开始您的烹饪之旅</p>
            </div>
        )}
      </div>

      {status === LoadingState.LOADING && <ChefLoader />}

      {status === LoadingState.SUCCESS && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in pb-12">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
      
      {status === LoadingState.ERROR && (
        <div className="text-center py-12 bg-red-50 rounded-3xl text-red-600 border border-red-100 flex flex-col items-center">
          <AlertCircle size={48} className="mb-4 text-red-400" />
          <p className="font-bold text-lg">生成失败</p>
          <p className="text-sm mt-2 opacity-80 max-w-md">可能是网络问题或 API Key 无效。请检查您的设置后重试。</p>
        </div>
      )}
    </div>
  );
};

export default Fridge;