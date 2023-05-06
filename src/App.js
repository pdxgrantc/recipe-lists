import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './Home/Home';
import MyRecipes from './MyRecipes/MyRecipes';
import Recipe from './Recipe/Recipe';
import ShoppingList from './ShoppingList/ShoppingList';
import FourOFour from './404/404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/My-Recipes" element={<MyRecipes />} />
        <Route path='/My-Recipes/:recipeName' element={<Recipe />} />
        <Route path="/Shopping-List" element={<ShoppingList />} />
        <Route path="*" element={<FourOFour />} />
        <Route path='/404' element={<FourOFour />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
