import actionTypes from '../actions';
const initState = {
  theme: null,
  currentUser: null, // {}
};
// login zalo end firebase
const authProviderReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.THEME_APP:
      return {
        ...state,
        theme: {
          backgroundApp: action.payload.background,
          primaryColor: action.payload.color,
          backgroundMusicBar: action.payload.backgroundMusicBar,
        },
      };
    case actionTypes.DATA_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};
export default authProviderReducer;
