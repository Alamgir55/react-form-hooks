import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredient, action) => {
    switch(action.type){
      case 'SET':
          return action.ingredients;
      case 'ADD':
          return [...currentIngredient, action.ingredient]
      case 'DELETE':
          return currentIngredient.filter(ing => ing.id !== action.id);
      default: 
        throw new Error('Should not get there');    
    }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();


  const filteredIngredientsHandler = useCallback( filterIngredients => {
    dispatch({type: 'SET', ingredients: filterIngredients})
  }, [])

  useEffect(() => {
    console.log('REDNDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const addIngredientsHandler = Ingredient => {
    setLoading(true);
    fetch('https://react-hooks-9ae76.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(Ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setLoading(false);
      return response.json();
    }).then(responseData => {
      dispatch({
        type: 'ADD',
        ingredient: {id: responseData.name, ...Ingredient}
      })
    })
  } 
  const removeIngredientsHandler = IngredientId => {
    setLoading(true);
    fetch(`https://react-hooks-9ae76.firebaseio.com/ingredients/${IngredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setLoading(false);
      dispatch({
        type: 'DELETE',
        id: IngredientId
      })
    }).catch(error => {
      setError('Something went wrong!');
      setLoading(false);
    })
  }

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm  onAddIngredient={addIngredientsHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientsHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
