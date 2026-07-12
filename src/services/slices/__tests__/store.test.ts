import { describe, expect, test } from '@jest/globals';
import { rootReducer } from '../../store';

describe('rootReducer', () => {
  test('возвращает начальное состояние хранилища для неизвестного экшена', () => {
    const state = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: true,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      order: {
        order: null,
        orderRequest: false,
        error: null
      },
      feed: {
        feed: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        isLoading: false,
        error: null
      },
      orderInfo: {
        orderData: null,
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      }
    });
  });
});
