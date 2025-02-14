import {createDrawerNavigator} from '@react-navigation/drawer';
// import { NavigatorScreenParams } from '@react-navigation/native';
import { drawerNavigations } from '../../constants';
import CustomDrawerContent from './CustomDrawerContent';
import MainStackNavigator from '../stack/beforeLogin/MainStackNavigator';
import PlayListStackNavigator from '../stack/beforeLogin/PlayListStackNavigator';
import VocaStackNavigator from '../stack/beforeLogin/VocaStackNavigator';
import CalendarStackNavigator from '../stack/beforeLogin/CalendarStackNavigator';
import FeedStackNavigator from '../stack/beforeLogin/FeedStackNavigator';
import SettingStackNavigator from '../stack/beforeLogin/SettingStackNavigator';
const Drawer = createDrawerNavigator();

export type MainDrawerParamList = {
  [drawerNavigations.PLAYLIST]: undefined;
  [drawerNavigations.CALENDAR]: undefined;
  // [drawerNavigations.SETTING]: undefined;
  [drawerNavigations.MAIN]: undefined;
  [drawerNavigations.VOCA]: undefined;
  [drawerNavigations.FEED]: undefined;
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
      <Drawer.Screen name={drawerNavigations.FEED} component={FeedStackNavigator} />
      <Drawer.Screen name={drawerNavigations.SETTING} component={SettingStackNavigator} />
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator;
