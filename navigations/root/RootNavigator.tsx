import React from 'react';
import AuthStackNavigator from '../stack/afterLogin/AuthStackNavigator';
import MainDrawerNavigator from '../drawer/MainDrawerNavigator';
import useAuthStore from '../../store/useAuthStore';
import { MainDrawerParamList } from '../drawer/MainDrawerNavigator';
function RootNavigator() {  

  const token = useAuthStore((state) => state.token);
  const isLoggedIn = true;  

  return (
    <>
      {isLoggedIn ? <MainDrawerNavigator /> : <AuthStackNavigator />}
    </>
  );
}
MainDrawerParamList
export default RootNavigator;
