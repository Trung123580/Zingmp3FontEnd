import { combineReducers } from 'redux';
import musicReducer from './musicReducer';
import authProviderReducer from './authProvider';
const rootReducer = combineReducers({
  app: musicReducer,
  auth: authProviderReducer,
});
export default rootReducer;
