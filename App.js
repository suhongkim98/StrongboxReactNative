import 'react-native-gesture-handler';
import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './src/modules';
import {NavigationContainer} from '@react-navigation/native';
import InitNavi from './src/routers/navigations/InitNavi';
import {RootSiblingParent} from 'react-native-root-siblings';

const store = createStore(rootReducer);
const App = () => {
  return (
    <>
      <Provider store={store}>
        <RootSiblingParent>
          <NavigationContainer>
            <InitNavi />
          </NavigationContainer>
        </RootSiblingParent>
      </Provider>
    </>
  );
};

export default App;
