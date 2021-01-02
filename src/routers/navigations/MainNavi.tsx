import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MainScreen from '../screens/MainScreen';
import DrawerScreen from '../screens/DrawerScreen';
import EditDrawerScreen from '../screens/EditDrawerScreen';
import EditAccountScreen from '../screens/EditAccountScreen';

const Drawer = createDrawerNavigator();
const MainNavi = () => {
  return (
    <>
      <Drawer.Navigator
        initialRouteName="MainScreen"
        drawerContent={(props) => <DrawerScreen {...props} />}>
        <Drawer.Screen name="MainScreen" component={MainScreen} />
        <Drawer.Screen name="EditDrawerScreen" component={EditDrawerScreen} />
        <Drawer.Screen name="EditAccountScreen" component={EditAccountScreen} />
      </Drawer.Navigator>
    </>
  );
};

export default MainNavi;
