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
  const { theme, currentUser } = useSelector((state) => state.auth);
  const { currentPlayList } = useSelector((state) => state.app);
  const [themeApp, setThemeApp] = useState(null);
  const [appCallBack, setAppCallBack] = useState(false);
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [isOpenLyricSong, setIsOpenLyricSong] = useState(false);
  const [openModal, setOpenModal] = useState({
    isOpenModal: false,
    currentModal: false,
    titleModal: '',
  });
  const { isOpenModal, titleModal, currentModal } = openModal;
  // chart
  const [selectedChart, setSelectedChart] = useState(null);
  const [user, setUser] = useState(undefined);
  const userCollection = collection(db, 'user');
  const dispatch = useDispatch();
  //LyricSong
  const handleToggleLyricSong = () => {
    setIsOpenLyricSong((prev) => !prev);
  };
  // modal
  const handleOpen = (title, currentModal) => setOpenModal((prev) => ({ ...prev, isOpenModal: true, titleModal: title, currentModal: currentModal }));
  const handleClose = () => setOpenModal((prev) => ({ ...prev, isOpenModal: false }));
  // portal
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    thumbnailM: '',
    title: '',
    isShowPortal: false,
    isDelete: false,
    targetSong: false, // false => danh sach phat / true => history
  });
  const handleActiveSong = (e, song, isDelete, targetSong) => {
    // => isDelete nếu có tham số thứ 3 ẩn nut delete
    if (e) {
      e.stopPropagation();
      if (coords.isShowPortal) {
        setCoords((prev) => ({ ...prev, isShowPortal: false }));
        return;
      }
      const clientReact = e.target.getBoundingClientRect();
      // console.log(clientReact);
      setCoords({
        x: clientReact.left,
        y: clientReact.top,
        width: clientReact.width,
        height: clientReact.height,
        thumbnailM: song.thumbnailM,
        encodeId: song.encodeId,
        title: song.title,
        isShowPortal: true,
        isDelete: isDelete,
        targetSong: targetSong, // false => danh sach phat / true => history
      });
    } else {
      setCoords((prev) => ({ ...prev, isShowPortal: false }));
    }
  };

  useEffect(() => {
    setUser(cookies.get('user'));
  }, [isAuth]);
  useEffect(() => {
    if (theme) localStorage.setItem('theme', JSON.stringify(theme));
    const getTheme = JSON.parse(localStorage.getItem('theme'));
    setThemeApp(getTheme);
  }, [theme]);
  useEffect(() => {
    try {
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
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [appCallBack, user]);
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
          followArtist: [],
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
      dispatch(getCurrentPlayList({ listItem: listItem, title: title }));
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
  // remove historySong
  const handleRemoveHistorySong = useCallback(
    async (e, idSong) => {
      e.stopPropagation();
      if (!coords.targetSong) {
        const refreshPlayList = currentPlayList.listItem.filter((song) => song.encodeId !== idSong);
        dispatch(getCurrentPlayList({ listItem: refreshPlayList, title: currentPlayList.title }));
        dispatch(addSuccess({ type: true, content: 'đã xóa bài hát trong danh sách phát' }));
        handleActiveSong(null, null);
        return;
      }
      const userDoc = doc(db, 'user', user?.uid);
      const newDataStory = currentUser?.historySong.filter(({ encodeId }) => encodeId !== idSong);
      await updateDoc(userDoc, {
        historySong: newDataStory,
      }).then(() => {
        handleActiveSong(null, null);
        dispatch(dataUser({ ...currentUser, historySong: newDataStory }));
        dispatch(addSuccess({ type: true, content: 'đã xóa bài hát khỏi lịch sử nghe nhạc' }));
      });
    },
    // eslint-disable-next-line
    [user, currentUser, coords.targetSong]
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
          mvlink: songItem.mvlink || null,
        }),
      }).then(() => {
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
        dispatch(dataUser({ ...currentUser, loveMusic: newDataStory }));
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
        dispatch(dataUser({ ...currentUser, followPlayList: newDataStory }));
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
        dispatch(dataUser({ ...currentUser, followAlbum: newDataStory }));
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
  // followArtist *
  const handleAddArtist = useCallback(
    async (e, artist) => {
      e.stopPropagation();
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const userDoc = doc(db, 'user', user?.uid);
      const { thumbnailM, id, name, link } = artist;
      await updateDoc(userDoc, {
        followArtist: arrayUnion({
          thumbnailM,
          id,
          name,
          link,
        }),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followArtist: [...currentUser?.followArtist, { thumbnailM, id, name, link }] }));
        // dispatch(addSuccess({ type: true, content: 'đã thêm album vào thư viện' }));
      });
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  const handleRemoveArtist = useCallback(
    async (e, idArtist) => {
      e.stopPropagation();
      const userDoc = doc(db, 'user', user?.uid);
      const newDataStory = currentUser?.followArtist.filter(({ id }) => id !== idArtist);
      await updateDoc(userDoc, {
        followArtist: newDataStory,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followArtist: newDataStory }));
        // dispatch(addSuccess({ type: true, content: 'đã xóa mv khỏi thư viện' }));
      });
    },
    // eslint-disable-next-line
    [user, currentUser]
  );
  //followMv *
  const handleAddMv = useCallback(
    async (video) => {
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const userDoc = doc(db, 'user', user?.uid);
      const { thumbnailM, link, title, artists, duration, encodeId } = video;
      await updateDoc(userDoc, {
        followMv: arrayUnion({
          thumbnailM,
          title,
          encodeId,
          link,
          artists,
          duration,
        }),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followMv: [...currentUser?.followMv, { thumbnailM, title, link, artists, encodeId, duration }] }));
        dispatch(addSuccess({ type: true, content: 'đã thêm mv vào thư viện' }));
      }); // re-renderApp
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  const handleRemoveMv = useCallback(
    async (idVideo) => {
      const newDataStory = currentUser?.followMv.filter(({ encodeId }) => encodeId !== idVideo);
      const userDoc = doc(db, 'user', user?.uid);
      await updateDoc(userDoc, {
        followMv: newDataStory,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followMv: newDataStory }));
        dispatch(addSuccess({ type: true, content: 'đã xóa mv khỏi thư viện' }));
      });
    },
    // eslint-disable-next-line
    [user, currentUser]
  );
  const values = {
    themeApp,
    handle: {
      //modal
      onOpenModal: handleOpen,
      onCloseModal: handleClose,
      //app
      onLoginApp: handleLoginApp,
      onSignOutApp: handleSignOutApp,
      // historySong
      onPlaySong: handlePlaySong,
      onRemoveHistorySong: handleRemoveHistorySong,
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
      // mv
      onAddMv: handleAddMv,
      onRemoveMv: handleRemoveMv,
      // artist
      onAddArtist: handleAddArtist,
      onRemoveArtist: handleRemoveArtist,
      //portal
      onActiveSong: handleActiveSong,
      //LyricSong
      onToggleLyricSong: handleToggleLyricSong,
    },
    isAuth,
    user,
    selectedChart,
    // modal
    isOpenModal: isOpenModal,
    titleModal: titleModal,
    currentModal: currentModal,
    //portal
    coords: coords,
    isShowPortal: coords.isShowPortal,
    //LyricSong
    isOpenLyricSong: isOpenLyricSong,
  };
  return <AuthProvider.Provider value={values}>{children}</AuthProvider.Provider>;
};
export { AppProvider, AuthProvider };
