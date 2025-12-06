import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Fridge from './pages/Fridge';
import Spinner from './pages/Spinner';
import Explore from './pages/Explore';
import RecipeDetail from './pages/RecipeDetail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Fridge />} />
          <Route path="explore" element={<Explore />} />
          <Route path="spinner" element={<Spinner />} />
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
