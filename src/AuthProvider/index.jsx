import { createContext, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSong, playSong, dataUser, addSuccess, getCurrentPlayList } from '~/store/actions/dispatch';
import Cookies from 'universal-cookie';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, collection, getDocs, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '~/fireBase-config';
const AuthProvider = createContext();
const cookies = new Cookies();
const expirationDate = new Date();
const AppProvider = ({ children }) => {
  const [themeApp, setThemeApp] = useState(null);
  const [appCallBack, setAppCallBack] = useState(false);
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  // chart
  const [selectedChart, setSelectedChart] = useState(null);
  const [user, setUser] = useState(undefined);
  const { theme, currentUser } = useSelector((state) => state.auth);
  const userCollection = collection(db, 'user');
  const dispatch = useDispatch();
  useEffect(() => {
    setUser(cookies.get('user'));
  }, [isAuth]);
  useEffect(() => {
    if (theme) localStorage.setItem('theme', JSON.stringify(theme));
    const getTheme = JSON.parse(localStorage.getItem('theme'));
    setThemeApp(getTheme);
  }, [theme]);
  useEffect(() => {
    if (isAuth) {
      (async () => {
        if (user?.uid) {
          const docRef = doc(db, 'user', user?.uid);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();
          dispatch(dataUser(data)); // user
        }
      })();
    }
    // eslint-disable-next-line
  }, [appCallBack, user]);
  useEffect(() => {
    let timesShowSuccess;
    timesShowSuccess = setTimeout(() => {
      dispatch(addSuccess({ type: false, content: '' }));
    }, 2000);
    return () => {
      timesShowSuccess && clearTimeout(timesShowSuccess);
    };
    // eslint-disable-next-line
  }, [currentUser]);
  const handleLoginApp = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      const currentMonth = expirationDate.getMonth();
      expirationDate.setMonth(currentMonth + 1);
      if (expirationDate.getMonth() === currentMonth) {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }
      cookies.set('auth-token', response.user.refreshToken, { expires: expirationDate });
      cookies.set('user', response.user, { expires: expirationDate });
      const data = await getDocs(userCollection);
      const userData = data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      const isUser = userData.some((user) => user.id === auth.currentUser?.uid);
      setIsAuth(true);
      if (!isUser) {
        await setDoc(doc(db, 'user', auth.currentUser?.uid), {
          userName: auth.currentUser?.displayName,
          email: auth.currentUser?.email,
          avatar: auth.currentUser?.photoURL,
          followPlayList: [], // theo doi playlist
          historySong: [], // lich su nghe nhac
          loveMusic: [], // theo doi song music
          createPlayList: [], // [ lồng arr để lưu các play list khác nhau[] ] // tu tao play list cho rieng minh
          followMv: [], // theo doi video
          followAlbum: [], // theo doi album
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(currentUser);
  const handleSignOutApp = async () => {
    setIsAuth(false);
    cookies.remove('auth-token');
    cookies.remove('user');
    dispatch(dataUser(null)); // user
    await signOut(auth);
  };
  const handlePlaySong = useCallback(
    (item, listItem, title) => {
      const song = JSON.parse(localStorage.getItem('song'));
      if (song?.encodeId === item?.encodeId) return;
      dispatch(getSong({ ...item }));
      dispatch(getCurrentPlayList({ listItem, title: title }));
      dispatch(playSong(true));
      if (isAuth) {
        (async () => {
          const userDoc = doc(db, 'user', user.uid);
          const isExit = currentUser?.historySong?.some(({ encodeId }) => encodeId === item.encodeId);
          const { encodeId, thumbnailM, artists, title, releaseDate } = item;
          if (!isExit) {
            await updateDoc(userDoc, {
              historySong: arrayUnion({
                encodeId,
                thumbnailM,
                artists,
                title,
                releaseDate,
              }),
            }).then(() => setAppCallBack((prevAppCallBack) => !prevAppCallBack)); // re-renderApp
          }
        })();
      }
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  // song
  const handleAddLikeSong = useCallback(
    async (e, songItem) => {
      e.stopPropagation();
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const userDoc = doc(db, 'user', user?.uid);
      await updateDoc(userDoc, {
        loveMusic: arrayUnion({
          ...songItem,
        }),
      }).then(() => {
        // setAppCallBack((prevAppCallBack) => !prevAppCallBack);
        dispatch(dataUser({ ...currentUser, loveMusic: [...currentUser?.loveMusic, { ...songItem }] }));
        dispatch(addSuccess({ type: true, content: 'đã thêm bài hát vào thư viện' }));
      }); // re-renderApp
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  const handleRemoveLikeSong = useCallback(
    async (e, idSong) => {
      e.stopPropagation();
      const userDoc = doc(db, 'user', user?.uid);
      const newDataStory = currentUser?.loveMusic.filter(({ encodeId }) => encodeId !== idSong);
      await updateDoc(userDoc, {
        loveMusic: newDataStory,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, loveMusic: currentUser?.loveMusic.filter(({ encodeId }) => encodeId !== idSong) }));
        dispatch(addSuccess({ type: true, content: 'đã xóa bài hát khỏi thư viện' }));
      });
    },
    // eslint-disable-next-line
    [user, currentUser]
  );
  // playList
  const handleAddAPlayList = useCallback(
    async (e, playList) => {
      e.stopPropagation();
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const userDoc = doc(db, 'user', user?.uid);
      const { thumbnailM, encodeId, title, link, sortDescription } = playList;
      await updateDoc(userDoc, {
        followPlayList: arrayUnion({
          thumbnailM,
          encodeId,
          title,
          link,
          sortDescription,
        }),
      }).then(() => {
        // setAppCallBack((prevAppCallBack) => !prevAppCallBack);
        dispatch(
          dataUser({ ...currentUser, followPlayList: [...currentUser?.followPlayList, { thumbnailM, encodeId, title, link, sortDescription }] })
        );
        dispatch(addSuccess({ type: true, content: 'đã thêm playlist vào thư viện' }));
      }); // re-renderApp
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  const handleRemovePlayList = useCallback(
    async (e, idAlbum) => {
      e.stopPropagation();
      const newDataStory = currentUser?.followPlayList.filter(({ encodeId }) => encodeId !== idAlbum);
      const userDoc = doc(db, 'user', user?.uid);
      await updateDoc(userDoc, {
        followPlayList: newDataStory,
      }).then(() => {
        // setAppCallBack((prevAppCallBack) => !prevAppCallBack);
        dispatch(dataUser({ ...currentUser, followPlayList: currentUser?.followPlayList.filter(({ encodeId }) => encodeId !== idAlbum) }));
        dispatch(addSuccess({ type: true, content: 'đã xóa playlist khỏi thư viện' }));
      }); // re-renderApp
    },
    // eslint-disable-next-line
    [user, currentUser]
  );
  // album
  const handleAddAlbum = useCallback(
    async (e, album) => {
      e.stopPropagation();
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const userDoc = doc(db, 'user', user?.uid);
      const { thumbnailM, encodeId, title, link } = album;
      await updateDoc(userDoc, {
        followAlbum: arrayUnion({
          thumbnailM,
          encodeId,
          title,
          link,
        }),
      }).then(() => {
        // setAppCallBack((prevAppCallBack) => !prevAppCallBack);
        dispatch(dataUser({ ...currentUser, followAlbum: [...currentUser?.followAlbum, { thumbnailM, encodeId, title, link }] }));
        dispatch(addSuccess({ type: true, content: 'đã thêm album vào thư viện' }));
      }); // re-renderApp
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  const handleRemoveAlbum = useCallback(
    async (e, idSong) => {
      e.stopPropagation();
      const userDoc = doc(db, 'user', user?.uid);
      const newDataStory = currentUser?.followAlbum.filter(({ encodeId }) => encodeId !== idSong);
      await updateDoc(userDoc, {
        followAlbum: newDataStory,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followAlbum: currentUser?.followAlbum.filter(({ encodeId }) => encodeId !== idSong) }));
        dispatch(addSuccess({ type: true, content: 'đã xóa album khỏi thư viện' }));
      });
    },
    // eslint-disable-next-line
    [user, currentUser]
  );
  //chart
  const handleChartHoverTooltip = (data) => {
    setSelectedChart(data);
  };
  // onPlayVideo
  const values = {
    themeApp,
    handle: {
      onLoginApp: handleLoginApp,
      onSignOutApp: handleSignOutApp,
      onPlaySong: handlePlaySong,
      // song
      onAddLikeSong: handleAddLikeSong,
      onRemoveLikeSong: handleRemoveLikeSong,
      // playlist
      onAddPlayList: handleAddAPlayList,
      onRemovePlayList: handleRemovePlayList,
      //album
      onAddAlbum: handleAddAlbum,
      onRemoveAlbum: handleRemoveAlbum,
      //chart
      onChartHoverTooltip: handleChartHoverTooltip,
    },
    isAuth,
    user,
    selectedChart,
  };
  return <AuthProvider.Provider value={values}>{children}</AuthProvider.Provider>;
};
export { AppProvider, AuthProvider };
