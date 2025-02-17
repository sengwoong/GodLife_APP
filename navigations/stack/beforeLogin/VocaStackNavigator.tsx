import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {VocaNavigations} from '../../../constants';
import VocaScreen from '../../../screens/voca/VocaScreen';
import HomeHeaderLeft from '../HomeHeaderLeft';
import VocaContentScreen from '../../../screens/voca/VocaContentScreen';
import VocaEditScreen from '../../../screens/voca/VocaEditScreen';

export type VocaStackParamList = {
  [VocaNavigations.VOCAMAIN]: undefined;
  [VocaNavigations.VOCACONTENT]: {vocaIndex: number };
  [VocaNavigations.VOCACONTENTEDIT]: { vocaIndex: number , wordIndex: number |  undefined};
};

const Stack = createStackNavigator<VocaStackParamList>();

function VocaStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: 'white',
        },
        headerStyle: {
          shadowColor: 'gray',
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 15,
        },
        headerTintColor: 'black',
      }}>
      <Stack.Screen
        name={VocaNavigations.VOCAMAIN}
        component={VocaScreen}
        options={(navigation) => ({
          headerTitle: '보카',
          headerLeft: () => HomeHeaderLeft(),
        })}
      />
      <Stack.Screen
        name={VocaNavigations.VOCACONTENT}
        component={VocaContentScreen}
        options={{
          headerShown: true,
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={VocaNavigations.VOCACONTENTEDIT}
        component={VocaEditScreen}
        options={{
          headerShown: true,
          headerTitle: ' ',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default VocaStackNavigator;
