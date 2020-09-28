import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

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
  const { isLoading, data, error, sendRequest, reqExtra, reqIdentifer } = useHttp();

  const filteredIngredientsHandler = useCallback( filterIngredients => {
    dispatch({type: 'SET', ingredients: filterIngredients})
  }, [])

  useEffect(() => {
    if(!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT'){
      dispatch({type: 'DELETE', id: reqExtra})
    } else if(!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...reqExtra }
        })
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  useEffect(() => {

  }, [userIngredients])

  const addIngredientsHandler = useCallback( Ingredient => {
    sendRequest('https://react-hooks-9ae76.firebaseio.com/ingredients.json', 'POST', 
      JSON.stringify(Ingredient),
      Ingredient,
      'ADD_INGREDIENT'
    )
  }, [sendRequest]); 

  const removeIngredientsHandler = useCallback(IngredientId => {
    sendRequest(`https://react-hooks-9ae76.firebaseio.com/ingredients/${IngredientId}.json`, 'DELETE', null, IngredientId, 'REMOVE_INGREDIENT')
  }, [sendRequest]);


  const ingredientList = useMemo(() => {
    return( <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientsHandler} />)
  }, [userIngredients, removeIngredientsHandler])

  const clearError = useCallback(() => {
    //dispatch({type: 'CLEAR'});
  }, [])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm  onAddIngredient={addIngredientsHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
