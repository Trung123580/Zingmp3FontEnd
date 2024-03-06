import actionTypes from '../actions';
const initState = {
  currentTimeSongLyric: 0,
  isHidden: false,
};
const lyricSong = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENT_SONG_LYRIC:
      return {
        ...state,
        currentTimeSongLyric: action.payload,
      };
    case actionTypes.HIDDEN_LYRIC:
      return {
        ...state,
        isHidden: action.payload,
      };
    default:
      return state;
  }
};
export default lyricSong;
