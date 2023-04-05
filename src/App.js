import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './Home/Home';
import MyRecipes from './MyRecipes/MyRecipes';
import Recipe from './Recipe/Recipe';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/My-Recipes" element={<MyRecipes />} />
        <Route path='/My-Recipes/:recipeName' element={<Recipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
