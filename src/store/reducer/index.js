import { combineReducers } from 'redux';
import musicReducer from './musicReducer';
import authProviderReducer from './authProvider';
import lyricSong from './LyricSong';
const rootReducer = combineReducers({
  app: musicReducer,
  auth: authProviderReducer,
  lyric: lyricSong,
});
export default rootReducer;
