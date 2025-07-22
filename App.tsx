import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RootNavigator from './navigations/root/RootNavigator';
import { QueryProvider } from './server/query/QueryProvider';


const Drawer = createDrawerNavigator();


function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };


  return (
    <NavigationContainer theme={navTheme}>
      <QueryProvider>
        <Drawer.Navigator>
          <Drawer.Screen 
            name="Root" 
            component={RootNavigator}
            options={{
              headerShown: false
            }}
          />
        </Drawer.Navigator>
      </QueryProvider>
    </NavigationContainer>
  );
}

export default App;
