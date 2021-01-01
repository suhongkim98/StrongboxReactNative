import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MainScreen from '../screens/MainScreen';
import DrawerScreen from '../screens/DrawerScreen';
import EditScreen from '../screens/EditScreen';

const Drawer = createDrawerNavigator();
const MainNavi = () => {
  return (
    <>
      <Drawer.Navigator
        initialRouteName="MainScreen"
        drawerContent={(props) => <DrawerScreen {...props} />}>
        <Drawer.Screen name="MainScreen" component={MainScreen} />
        <Drawer.Screen name="EditScreen" component={EditScreen} />
      </Drawer.Navigator>
    </>
  );
};

export default MainNavi;
