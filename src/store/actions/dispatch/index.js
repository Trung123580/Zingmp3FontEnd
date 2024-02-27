import actionTypes from '~/store/actions';
const changeTheme = (background, color, backgroundMusicBar) => {
  return {
    type: actionTypes.THEME_APP,
    payload: {
      background: background,
      color: color,
      backgroundMusicBar: backgroundMusicBar,
    },
  };
};
const getHome = (response) => {
  return {
    type: actionTypes.GET_HOME,
    payload: response.data.data.items,
  };
};
const getSong = (songInfo) => {
  return {
    type: actionTypes.GET_SONG,
    payload: songInfo,
  };
};
const playSong = (action) => {
  return {
    type: actionTypes.IS_PLAY,
    payload: action,
  };
};
const openPlayList = (action) => {
  return {
    type: actionTypes.IS_OPEN_PLAYLIST_MUSIC,
    payload: action,
  };
};
const dataUser = (data) => {
  return {
    type: actionTypes.DATA_USER,
    payload: data,
  };
};
const addSuccess = (isOpen) => {
  return {
    type: actionTypes.ADD_SUCCESS,
    payload: isOpen,
  };
};
const randomSong = (isRandom) => {
  return {
    type: actionTypes.RANDOM_SONG,
    payload: isRandom,
  };
};
const getCurrentPlayList = (playList) => {
  return {
    type: actionTypes.CURRENT_PLAYLIST,
    payload: playList,
  };
};
const getArtistInfo = (response) => {
  return {
    type: actionTypes.GET_ARTIST_INFO,
    payload: response.data.data,
  };
};
// zing chart home
const getChartHome = (response) => {
  return {
    type: actionTypes.CHART_HOME,
    payload: response.data.data,
  };
};
const getDeFaultDataVideo = (response) => {
  return {
    type: actionTypes.IS_OPEN_VIDEO,
    payload: response.data.data,
  };
};
const openCurrentVideo = (page) => {
  return {
    type: actionTypes.CURRENT_PAGE,
    payload: page,
  };
};
const changeCurrentTimeSongLyric = (time) => {
  return {
    type: actionTypes.CHANGE_CURRENT_SONG_LYRIC,
    payload: time,
  };
};
export {
  openCurrentVideo,
  getDeFaultDataVideo,
  getChartHome,
  getHome,
  changeTheme,
  getSong,
  playSong,
  openPlayList,
  dataUser,
  addSuccess,
  randomSong,
  getCurrentPlayList,
  getArtistInfo,
  changeCurrentTimeSongLyric,
};
