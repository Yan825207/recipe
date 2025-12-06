export interface Ingredient {
  id: string;
  name: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: '简单' | '中等' | '困难';
  calories?: number;
  ingredients: string[];
  steps: string[];
  imageUrl?: string;
  city?: string;
}

export interface SpinnerOption {
  id: string;
  label: string;
  color: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}