import React from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {VocaNavigations} from '../../../constants';
import VocaScreen from '../../../screens/voca/VocaScreen';
import HomeHeaderLeft from '../HomeHeaderLeft';
import WordContentScreen from '../../../screens/voca/VocaContentScreen';
import VocaEditScreen from '../../../screens/voca/VocaEditScreen';
import WordEditScreen from '../../../screens/voca/WordEditScreen';

export type VocaStackParamList = {
  [VocaNavigations.VOCAMAIN]: undefined;
  [VocaNavigations.VOCACONTENT]: { vocaId: number };
  [VocaNavigations.WORDCONTENTEDIT]: { vocaId: number, wordId?: number };
  [VocaNavigations.VOCACONTENTEDIT]: { vocaId: number };
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
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default VocaStackNavigator;
