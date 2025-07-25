import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {VocaNavigations} from '../../../constants';
import VocaScreen from '../../../screens/voca/VocaScreen';
import HomeHeaderLeft from '../HomeHeaderLeft';
import WordContentScreen from '../../../screens/voca/VocaContentScreen';
import VocaEditScreen from '../../../screens/voca/VocaEditScreen';
import WordEditScreen from '../../../screens/voca/WordEditScreen';
import VocaGameScreen from '../../../screens/voca/VocaGameScreen';
export type VocaStackParamList = {
  [VocaNavigations.VOCAMAIN]: undefined;
  [VocaNavigations.VOCACONTENT]: {vocaIndex: number };
  [VocaNavigations.WORDCONTENTEDIT]: { vocaIndex: number , wordIndex: number |  undefined};
  [VocaNavigations.VOCACONTENTEDIT]: { vocaIndex: number };
  [VocaNavigations.VOCAGAME]: { vocaIndex: number };
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
        options={() => ({
          headerTitle: '보카',
          headerLeft: () => HomeHeaderLeft(),
        })}
      />
      <Stack.Screen
        name={VocaNavigations.VOCACONTENT}
        component={WordContentScreen}
        options={{
          headerShown: true,
          headerTitle: ' ',
        }}
      />
      <Stack.Screen
        name={VocaNavigations.WORDCONTENTEDIT}
        component={WordEditScreen}
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
      <Stack.Screen
        name={VocaNavigations.VOCAGAME}
        component={VocaGameScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default VocaStackNavigator;
