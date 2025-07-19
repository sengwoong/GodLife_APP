import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VocaNavigations } from '../../../constants/navigations';
import VocaScreen from '../../../screens/voca/VocaScreen';
import VocaContentScreen from '../../../screens/voca/VocaContentScreen';
import VocaEditScreen from '../../../screens/voca/VocaEditScreen';
import WordEditScreen from '../../../screens/voca/WordEditScreen';
import VocaGameScreen from '../../../screens/voca/VocaGameScreen';
import VocaAIGenerateScreen from '../../../screens/voca/VocaAIGenerateScreen';

export type VocaStackParamList = {
  [VocaNavigations.VOCA]: undefined;
  [VocaNavigations.VOCACONTENT]: { vocaId: number };
  [VocaNavigations.VOCACONTENTEDIT]: { vocaId: number };
  [VocaNavigations.VOCAEDIT]: { vocaId: number };
  [VocaNavigations.WORDEDIT]: { vocaId: number; wordId?: number };
  [VocaNavigations.VOCAGAME]: { vocaId: number };
  [VocaNavigations.VOCAAIGENERATE]: undefined;
};

const Stack = createNativeStackNavigator<VocaStackParamList>();

const VocaStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={VocaNavigations.VOCA}
        component={VocaScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={VocaNavigations.VOCACONTENT}
        component={VocaContentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={VocaNavigations.VOCACONTENTEDIT}
        component={VocaEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={VocaNavigations.VOCAEDIT}
        component={VocaEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={VocaNavigations.WORDEDIT}
        component={WordEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={VocaNavigations.VOCAGAME}
        component={VocaGameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={VocaNavigations.VOCAAIGENERATE}
        component={VocaAIGenerateScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default VocaStackNavigator;
