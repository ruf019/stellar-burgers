import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { Preloader } from '@ui';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/slices/ingredientsSlice';

const App = () => {
  // /** TODO: взять переменные из стора */
  // const isIngredientsLoading = false;
  // const ingredients = [];
  // const error = null;

  // return (
  //   <div className={styles.app}>
  //     <AppHeader />
  //     {isIngredientsLoading ? (
  //       <Preloader />
  //     ) : error ? (
  //       <div className={`${styles.error} text text_type_main-medium pt-4`}>
  //         {error}
  //       </div>
  //     ) : ingredients.length > 0 ? (
  //       <ConstructorPage />
  //     ) : (
  //       <div className={`${styles.title} text text_type_main-medium pt-4`}>
  //         Нет игредиентов
  //       </div>
  //     )}
  //   </div>
  // );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/orders' element={<ProfileOrders />} />
        <Route path='/profile/orders/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
