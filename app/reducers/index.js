import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import admin from './admin';

export default combineReducers({
  messages,
  auth,
  admin
});
