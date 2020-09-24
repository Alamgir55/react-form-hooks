import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ userIngredients, setUserIngredients ] = useState([]);

  const addIngredientsHandler = Ingredient => {
    fetch('https://react-hooks-9ae76.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(Ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [...prevIngredients, {id: responseData.name, ...Ingredient}])
    })
  } 
  const removeIngredientsHandler = IngredientId => {
    setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== IngredientId) );
  }

  return (
    <div className="App">
      <IngredientForm  onAddIngredient={addIngredientsHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientsHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
