import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderInfoState = {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  orderData: null,
  isLoading: false,
  error: null
};

export const getOrderInfo = createAsyncThunk(
  'orderInfo/getOrderInfo',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    return response.orders[0];
  }
);

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.orderData = null;
      state.error = null;
    }
  },
  selectors: {
    selectOrderInfoData: (state) => state.orderData,
    selectOrderInfoLoading: (state) => state.isLoading,
    selectOrderInfoError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.orderData = null;
      })
      .addCase(getOrderInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(getOrderInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderInfo } = orderInfoSlice.actions;

export const {
  selectOrderInfoData,
  selectOrderInfoLoading,
  selectOrderInfoError
} = orderInfoSlice.selectors;
