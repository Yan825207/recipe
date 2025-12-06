import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, Flame, MapPin, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 animate-pulse">
            <ChefHat size={32} />
          </div>
        )}
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name} 
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isImageLoaded ? 'opacity-100 scale-100 group-hover:scale-110' : 'opacity-0 scale-105'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        {recipe.city && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
            <MapPin size={12} className="text-orange-500" />
            {recipe.city}
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
             <div className="bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border border-white/10">
                <Clock size={12} />
                {recipe.cookingTime}
             </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-3">
            <h3 className="font-bold text-xl text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                {recipe.name}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {recipe.description}
            </p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
            <div className="bg-orange-50 p-1 rounded-full text-orange-500">
                <Flame size={14} fill="currentColor" />
            </div>
            <span>{recipe.calories || '---'} 千卡</span>
          </div>
          
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold border
            ${recipe.difficulty === '简单' ? 'bg-green-50 text-green-600 border-green-100' : 
              recipe.difficulty === '中等' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
              'bg-red-50 text-red-600 border-red-100'}`}>
            {recipe.difficulty}
          </div>
        </div>

        <Link 
          to={`/recipe/${recipe.id}`}
          state={{ recipe }}
          className="mt-4 block w-full text-center bg-gray-900 hover:bg-orange-500 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-orange-200"
        >
          查看教程
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;