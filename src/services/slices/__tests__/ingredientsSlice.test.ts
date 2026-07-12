import { describe, expect, test } from '@jest/globals';
import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png'
};

describe('ingredientsSlice', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает getIngredients.pending', () => {
    const previousState = {
      ingredients: [mockIngredient],
      isLoading: false,
      error: 'Предыдущая ошибка'
    };

    const state = ingredientsReducer(
      previousState,
      getIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      ingredients: [mockIngredient],
      isLoading: true,
      error: null
    });
  });

  test('обрабатывает getIngredients.fulfilled', () => {
    const ingredients = [mockIngredient];

    const state = ingredientsReducer(
      undefined,
      getIngredients.fulfilled(ingredients, 'request-id', undefined)
    );

    expect(state).toEqual({
      ingredients,
      isLoading: false,
      error: null
    });
  });

  test('обрабатывает getIngredients.rejected', () => {
    const error = new Error('Не удалось загрузить ингредиенты');

    const state = ingredientsReducer(
      undefined,
      getIngredients.rejected(error, 'request-id', undefined)
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Не удалось загрузить ингредиенты'
    });
  });
});
