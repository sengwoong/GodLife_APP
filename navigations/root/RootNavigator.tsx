import React from 'react';
import AuthStackNavigator from '../stack/afterLogin/AuthStackNavigator';
import MainDrawerNavigator from '../drawer/MainDrawerNavigator';
import useAuthStore from '../../store/useAuthStore';

function RootNavigator() {  
  // token이 있으면 로그인된 것으로 간주
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = !!token;

  return (
    <>
      {isLoggedIn ? <MainDrawerNavigator /> : <AuthStackNavigator />}
    </>
  );
}

export default RootNavigator;
