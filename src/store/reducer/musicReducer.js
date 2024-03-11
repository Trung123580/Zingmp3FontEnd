import actionTypes from '../actions';
const initState = {
  banner: null, // {}
  newRelease: null, // {}
  allAlbum: [],
  currentSong: JSON.parse(localStorage.getItem('song')) || null,
  currentPlayList: JSON.parse(localStorage.getItem('playList')) || null,
  isPlay: false,
  isOpenPlayList: JSON.parse(localStorage.getItem('isOpenPlayList')) || null,
  newReleaseChart: null, //{}
  chartData: null, // {}
  weekChart: null, // {}
  isRandomSong: false,
  // artist_info
  artistInfo: null, // {}
  artistTopSection: null, // {}
  singleEP: [],
  artistVideo: null, // {}
  artistPlaylist: [], //
  artistsRelated: null, // {}
  // OpenVideo
  deFautDataVideo: null, // {}
  currentPage: false, // false != video , true == video => page event Space Play
};
const musicReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.GET_HOME:
      return {
        ...state,
        banner: action.payload?.find(({ sectionType }) => sectionType === 'banner'),
        newRelease: action.payload?.find(({ sectionType }) => sectionType === 'new-release'),
        allAlbum: action.payload?.filter(({ itemType }) => itemType === 'description'),
        newReleaseChart: action.payload?.find(({ sectionType }) => sectionType === 'newReleaseChart'),
        chartData: action.payload?.find(({ sectionType }) => sectionType === 'RTChart'),
        weekChart: action.payload?.find(({ sectionType }) => sectionType === 'weekChart'),
        remainingAlbum: action.payload?.filter(({ sectionId }) => sectionId === 'h100' || sectionId === 'hAlbum'),
      };
    case actionTypes.GET_SONG:
      localStorage.setItem('song', JSON.stringify(action.payload));
      return {
        ...state,
        currentSong: action.payload,
      };
    case actionTypes.CURRENT_PLAYLIST:
      localStorage.setItem('playList', JSON.stringify(action.payload));
      return {
        ...state,
        currentPlayList: action.payload,
      };
    case actionTypes.IS_PLAY:
      return {
        ...state,
        isPlay: action.payload,
      };
    // phien bai hat dang phat
    case actionTypes.IS_OPEN_PLAYLIST_MUSIC:
      localStorage.setItem('isOpenPlayList', JSON.stringify(action.payload));
      return {
        ...state,
        isOpenPlayList: action.payload,
      };
    // randomSong
    case actionTypes.RANDOM_SONG:
      return {
        ...state,
        isRandomSong: action.payload,
      };
    // artist_info
    case actionTypes.GET_ARTIST_INFO:
      return {
        ...state,
        artistInfo: action.payload,
        artistTopSection: action.payload?.sections?.find(({ sectionId }) => sectionId === 'aSongs'),
        singleEP: action.payload?.sections?.filter(({ sectionId }) => sectionId === 'aSingle' || sectionId === 'aAlbum'),
        artistVideo: action.payload?.sections?.find(({ sectionId }) => sectionId === 'aMV'),
        artistPlaylist: action.payload?.sections?.filter(({ sectionId }) => sectionId === 'aPlaylist'),
        listArtist: action.payload?.sections?.find(({ sectionId }) => sectionId === 'aReArtist'),
      };
    // chart-home
    case actionTypes.CHART_HOME:
      return {
        ...state,
        chartData: { ...action.payload.RTChart, weekChart: action.payload.weekChart },
      };
    // isOpenVideo
    case actionTypes.IS_OPEN_VIDEO:
      return {
        ...state,
        deFautDataVideo: action.payload,
      };
    // currentPage
    case actionTypes.CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
};
export default musicReducer;
