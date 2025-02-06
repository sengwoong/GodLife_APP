import {createDrawerNavigator} from '@react-navigation/drawer';
// import { NavigatorScreenParams } from '@react-navigation/native';
import { drawerNavigations } from '../../constants';
import CustomDrawerContent from './CustomDrawerContent';
import MainStackNavigator from '../stack/beforeLogin/MainStackNavigator';
import FeedStackNavigator from '../stack/FeedStackNavigator';

const Drawer = createDrawerNavigator();

export type MainDrawerParamList = {
  // [drawerNavigations.PlayList]: undefined;
  // [drawerNavigations.CALENDAR]: undefined;
  // [drawerNavigations.SETTING]: undefined;
  [drawerNavigations.MAIN]: undefined;
  // [drawerNavigations.VOCA]: undefined;
  // [drawerNavigations.FEED]: undefined;
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
    </Drawer.Navigator>
  );
}

export default MainDrawerNavigator;
