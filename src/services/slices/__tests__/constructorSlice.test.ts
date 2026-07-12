import { describe, expect, test } from '@jest/globals';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'bun.png',
  image_mobile: 'bun-mobile.png',
  image_large: 'bun-large.png'
};

const mockFilling: TIngredient = {
  ...mockBun,
  _id: 'filling-1',
  name: 'Тестовая начинка',
  type: 'main',
  price: 50
};

const firstIngredient = {
  ...mockFilling,
  _id: 'first',
  id: 'first-id',
  name: 'Первая начинка'
};

const secondIngredient = {
  ...mockFilling,
  _id: 'second',
  id: 'second-id',
  name: 'Вторая начинка'
};

const thirdIngredient = {
  ...mockFilling,
  _id: 'third',
  id: 'third-id',
  name: 'Третья начинка'
};

const constructorState = {
  bun: null,
  ingredients: [firstIngredient, secondIngredient, thirdIngredient]
};

describe('constructorSlice', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('добавляет булку', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));

    expect(state).toEqual({
      bun: mockBun,
      ingredients: []
    });
  });

  test('добавляет начинку с уникальным id', () => {
    const state = constructorReducer(undefined, addIngredient(mockFilling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([
      {
        ...mockFilling,
        id: expect.any(String)
      }
    ]);
  });

  test('удаляет начинку по id', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [{ ...mockFilling, id: 'filling-id' }]
      },
      removeIngredient('filling-id')
    );

    expect(state.ingredients).toEqual([]);
  });

  test('очищает конструктор', () => {
    const state = constructorReducer(
      {
        bun: mockBun,
        ingredients: [{ ...mockFilling, id: 'filling-id' }]
      },
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('перемещает начинку вверх', () => {
    const state = constructorReducer(constructorState, moveIngredientUp(1));

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'second-id',
      'first-id',
      'third-id'
    ]);
  });

  test('не перемещает вверх первую начинку', () => {
    const state = constructorReducer(constructorState, moveIngredientUp(0));

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'first-id',
      'second-id',
      'third-id'
    ]);
  });

  test('перемещает начинку вниз', () => {
    const state = constructorReducer(constructorState, moveIngredientDown(1));

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'first-id',
      'third-id',
      'second-id'
    ]);
  });

  test('не перемещает вниз последнюю начинку', () => {
    const state = constructorReducer(constructorState, moveIngredientDown(2));

    expect(state.ingredients.map((item) => item.id)).toEqual([
      'first-id',
      'second-id',
      'third-id'
    ]);
  });
});
