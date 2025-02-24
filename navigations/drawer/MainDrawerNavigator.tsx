import {createDrawerNavigator} from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import { drawerNavigations } from '../../constants';
import CustomDrawerContent from './CustomDrawerContent';
import MainStackNavigator from '../stack/beforeLogin/MainStackNavigator';
import PlayListStackNavigator from '../stack/beforeLogin/PlayListStackNavigator';
import VocaStackNavigator from '../stack/beforeLogin/VocaStackNavigator';
import CalendarStackNavigator from '../stack/beforeLogin/CalendarStackNavigator';
import SettingStackNavigator from '../stack/beforeLogin/SettingStackNavigator';
import PostStackNavigator from '../stack/beforeLogin/PostStackNavigator';
import { PostStackParamList } from '../stack/beforeLogin/PostStackNavigator';
const Drawer = createDrawerNavigator();

export type MainDrawerParamList = {
  PlayList: undefined;
  Calendar: undefined;
  Setting: undefined;
  Post: NavigatorScreenParams<PostStackParamList>;
  [drawerNavigations.MAIN]: undefined;
  [drawerNavigations.VOCA]: undefined;
};

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false, 
        drawerType: 'front',
      }}>
      <Drawer.Screen name={drawerNavigations.MAIN} component={MainStackNavigator} />  
      <Drawer.Screen name={drawerNavigations.VOCA} component={VocaStackNavigator} />
      <Drawer.Screen name={drawerNavigations.PLAYLIST} component={PlayListStackNavigator} />
      <Drawer.Screen name={drawerNavigations.CALENDAR} component={CalendarStackNavigator} />  
      <Drawer.Screen name={drawerNavigations.POST} component={PostStackNavigator} />
      <Drawer.Screen name={drawerNavigations.SETTING} component={SettingStackNavigator} />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator;
