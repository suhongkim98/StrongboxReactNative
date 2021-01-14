//redux

import {combineReducers} from 'redux';
import counter from './counter';
import groupList from './groupList';
import serviceList from './serviceList';
import selectedService from './selectedService';
import editDrawerRedux from './editDrawerRedux';
import accountList from './accountList';

const rootReducer = combineReducers({
  counter,
  groupList,
  serviceList,
  selectedService,
  editDrawerRedux,
  accountList,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
