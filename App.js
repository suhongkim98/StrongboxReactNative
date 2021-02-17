import 'react-native-gesture-handler';
import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import rootReducer from './src/modules';
import {NavigationContainer} from '@react-navigation/native';
import InitNavi from './src/routers/navigations/InitNavi';
import {RootSiblingParent} from 'react-native-root-siblings';
import {composeWithDevTools} from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

//폰트 로드
AntIcon.loadFont();
MaterialIcon.loadFont();

const store = createStore(
  rootReducer,
  // logger 를 사용하는 경우, logger가 가장 마지막에 와야합니다.
  composeWithDevTools(applyMiddleware(ReduxThunk)),
); // 여러개의 미들웨어를 적용 할 수 있습니다.
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
