import { createContext, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSong, playSong, dataUser, getCurrentPlayList } from '~/store/actions/dispatch';
import Cookies from 'universal-cookie';
import { signInWithPopup, signOut } from 'firebase/auth';
import { doc, collection, getDocs, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { auth, googleProvider, db } from '~/fireBase-config';
import { toast } from 'react-toastify';
import { apiDetailsPlayList } from '~/api';

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
  const [currentDataPlaylist, setCurrentDataPlaylist] = useState({
    id: null,
    data: [],
  });
  const [openModal, setOpenModal] = useState({
    isOpenModal: false,
    currentModal: false,
    dataModal: {
      name: null,
      type: false,
      editType: false,
      isDeleteShow: false,
      id: null,
      thumbnailM: null,
      desc: null,
    },
  });
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
  const { isOpenModal, dataModal, currentModal } = openModal;
  // chart
  const [selectedChart, setSelectedChart] = useState(null);
  const [user, setUser] = useState(undefined);
  const userCollection = collection(db, 'user');
  const dispatch = useDispatch();
  console.log(currentUser);
  useEffect(() => {
    setUser(cookies.get('user'));
  }, [isAuth]);
  useEffect(() => {
    if (theme) localStorage.setItem('theme', JSON.stringify(theme));
    const getTheme = JSON.parse(localStorage.getItem('theme'));
    setThemeApp(getTheme);
  }, [theme]);
  useEffect(() => {
    const getUser = async () => {
      try {
        if (isAuth) {
          if (user?.uid) {
            const docRef = doc(db, 'user', user?.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            dispatch(dataUser(data)); // user
          }
        }
      } catch (error) {
        console.error(error);
        console.log('loi');
      }
    };
    getUser();
    // eslint-disable-next-line
  }, [appCallBack, user]);
  //LyricSong
  const handleToggleLyricSong = () => {
    setIsOpenLyricSong((prev) => !prev);
  };
  // modal
  const handleOpen = (data, currentModal) =>
    setOpenModal((prev) => ({
      ...prev,
      isOpenModal: true,
      dataModal: {
        name: data?.name,
        type: data?.type,
        editType: data?.editType ? data?.editType : false,
        isDeleteShow: data?.isDeleteShow,
        id: data?.id || null,
        thumbnailM: data?.thumbnailM,
        desc: data?.desc,
      },
      currentModal: currentModal,
    }));
  const handleClose = () => setOpenModal((prev) => ({ ...prev, isOpenModal: false }));
  //toastify
  const notify = (desc) => (desc.includes('xóa') ? toast.error(desc) : toast.success(desc));
  //chart
  const handleChartHoverTooltip = (data) => {
    setSelectedChart(data);
  };
  // playlist and play song
  const handlePlayMusicInPlaylist = async (e, props) => {
    e.stopPropagation();
    if (currentDataPlaylist.id === props.id) {
      dispatch(getSong(currentDataPlaylist.data[Math.floor(Math.random() * currentDataPlaylist.data.length)]));
      dispatch(getCurrentPlayList({ listItem: currentDataPlaylist.data, title: props?.title }));
      dispatch(playSong(true));
      return;
    }
    try {
      const response = await toast.promise(apiDetailsPlayList(props?.id), {
        pending: 'Đang tải bài hát trong playlist',
        success: 'Tải bài hát thành công',
        error: 'Tải bài hát thất bại',
      });
      if (response?.data?.err === 0) {
        const data = response.data.data.song.items;
        const item = data[Math.floor(Math.random() * data.length)];
        dispatch(getSong(item));
        dispatch(getCurrentPlayList({ listItem: data, title: props?.title }));
        dispatch(playSong(true));
        setCurrentDataPlaylist({ id: props.id, data: data });
      }
    } catch (error) {
      console.error(error);
    }
  };
  // portal
  const handleActiveSong = (e, song, isDelete, targetSong) => {
    // => isDelete nếu có tham số thứ 3 ẩn nut delete
    if (e) {
      e.stopPropagation();
      if (coords.isShowPortal) {
        setCoords((prev) => ({ ...prev, isShowPortal: false }));
        return;
      }
      const screenHeight = window.innerHeight;
      const clientReact = e.target.getBoundingClientRect();
      const bottomSpace = screenHeight - clientReact.bottom;
      // console.log(clientReact);
      setCoords({
        x: clientReact.left,
        y: clientReact.top,
        width: clientReact.width,
        height: clientReact.height,
        thumbnailM: song.thumbnailM || null,
        encodeId: song.encodeId || null,
        title: song.title || null,
        isShowPortal: true,
        isDelete: isDelete,
        targetSong: targetSong, // false => danh sach phat / true => history
      });
      if (bottomSpace < 200) setCoords((prev) => ({ ...prev, y: clientReact.top - 200 }));
    } else {
      setCoords((prev) => ({ ...prev, isShowPortal: false }));
    }
  };
  const handleCreatePlaylistAndEditName = useCallback(
    async (namePlaylist) => {
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      if (dataModal.editType) {
        // => edit
        const userDoc = doc(db, 'user', user?.uid);
        const newDataStory = (currentUser?.createPlaylist || []).map((item) =>
          item.encodeId === dataModal.id ? { ...item, title: namePlaylist } : item
        );
        await updateDoc(userDoc, {
          createPlaylist: newDataStory,
        }).then(() => {
          dispatch(dataUser({ ...currentUser, createPlaylist: newDataStory }));
          notify('đã sửa tên playlist');
        });
      } else {
        // => create
        const userDoc = doc(db, 'user', user?.uid);
        const encodeId = uuid();
        const data = {
          items: [], // => chứa các item song add playlist
          artist: user?.displayName || '',
          thumbnailM: user?.photoURL || '',
          encodeId: encodeId || '',
          title: namePlaylist || '',
          link: `/playlist/${user?.displayName}/${encodeId || ''}`,
          sortDescription: '',
        };
        await updateDoc(userDoc, {
          createPlaylist: arrayUnion({ ...data }),
        }).then(() => {
          dispatch(dataUser({ ...currentUser, createPlaylist: [...currentUser?.createPlaylist, { ...data }] }));
          notify('đã tạo playlist');
        }); // re-renderApp
      }
      handleClose();
    },
    // eslint-disable-next-line
    [dataModal, isAuth, user, currentUser]
  );
  const handleDeletePlaylist = useCallback(
    // xoa playlist do user tạo ra
    async () => {
      const newDataStory = currentUser?.createPlaylist.filter(({ encodeId }) => encodeId !== dataModal.id);
      const userDoc = doc(db, 'user', user?.uid);
      await updateDoc(userDoc, {
        createPlaylist: newDataStory,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, createPlaylist: newDataStory }));
        notify('đã xóa playlist khỏi thư viện');

        handleClose();
      });
    },
    // eslint-disable-next-line
    [user, currentUser, dataModal.id]
  );

  // copy path link
  const handleCopyUrlClipBoard = async () => {
    await navigator.clipboard.writeText(window.location.href);
    notify('Link đã được sao chép vào clipboard');
  };

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
          followArtist: [], // theo doi nghe si
          historyMv: [], // lich su xem mv
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
          const userDoc = doc(db, 'user', user?.uid);
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
        const refreshPlayList = currentPlayList?.listItem.filter((song) => song.encodeId !== idSong);
        dispatch(getCurrentPlayList({ listItem: refreshPlayList, title: currentPlayList?.title }));
        // dispatch(addSuccess({ type: true, content: '' }));
        notify('đã xóa bài hát trong danh sách phát');
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
        notify('đã xóa bài hát khỏi lịch sử nghe nhạc');
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
        notify('đã thêm bài hát vào thư viện');
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
        notify('đã xóa bài hát khỏi thư viện');
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
      const playListData = {
        thumbnailM: playList.thumbnailM || '',
        encodeId: playList.encodeId || '',
        link: playList.link || '',
        title: playList.title || '',
        sortDescription: playList.sortDescription || '',
      };
      await updateDoc(userDoc, {
        followPlayList: arrayUnion(playListData),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followPlayList: [...currentUser?.followPlayList, playListData] }));
        notify('đã thêm playlist vào thư viện');
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
        notify('đã xóa playlist vào thư viện');
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
      const albumData = {
        thumbnailM: album.thumbnailM || '',
        encodeId: album.encodeId || '',
        link: album.link || '',
        title: album.title || '',
      };
      await updateDoc(userDoc, {
        followAlbum: arrayUnion(albumData),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followAlbum: [...currentUser?.followAlbum, albumData] }));
        notify('đã thêm album vào thư viện');
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
        notify('đã xóa album vào thư viện');
      });
    },
    // eslint-disable-next-line
    [user, currentUser]
  );
  // followArtist *
  const handleAddArtist = useCallback(
    async (e, artist) => {
      e.stopPropagation();
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const userDoc = doc(db, 'user', user?.uid);
      const videoData = {
        thumbnailM: artist.thumbnailM || '',
        id: artist.id || '',
        link: artist.link || '',
        name: artist.name || '',
      };
      await updateDoc(userDoc, {
        followArtist: arrayUnion(videoData),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followArtist: [...currentUser?.followArtist, videoData] }));
        notify('đã thêm ca sĩ vào thư viện');
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
        notify('đã xóa ca sĩ khỏi thư viện');
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
      const videoData = {
        thumbnailM: video.thumbnailM || '',
        title: video.title || '',
        encodeId: video.encodeId || '',
        link: video.link || '',
        artists: video.artists || '',
        duration: video.duration || '',
        name: video.artist.name || '',
        artist: video.artist || '',
      };
      await updateDoc(userDoc, {
        followMv: arrayUnion(videoData),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, followMv: [...currentUser?.followMv, videoData] }));
        notify('đã thêm mv vào thư viện');
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
        notify('đã xóa mv khỏi thư viện');
      });
    },
    // eslint-disable-next-line
    [user, currentUser]
  );
  // historyMv
  const handleAddHistoryMv = useCallback(
    async (video) => {
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const isExit = currentUser?.historyMv.some(({ encodeId }) => encodeId === video?.encodeId);
      if (isExit) return;
      const userDoc = doc(db, 'user', user?.uid);
      const videoData = {
        thumbnailM: video.thumbnailM,
        title: video.title,
        encodeId: video.encodeId,
        link: video.link,
        artists: video.artists,
        duration: video.duration,
      };
      await updateDoc(userDoc, {
        historyMv: arrayUnion(videoData),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, historyMv: [...currentUser?.historyMv, videoData] }));
      }); // re-renderApp
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  const handleRemoveHistoryMv = useCallback(
    async (idVideo) => {
      const newDataStory = currentUser?.historyMv.filter(({ encodeId }) => encodeId !== idVideo);
      const userDoc = doc(db, 'user', user?.uid);
      await updateDoc(userDoc, {
        historyMv: newDataStory,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, historyMv: newDataStory }));
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
      // historyMv
      onAddHistoryMv: handleAddHistoryMv,
      // artist
      onAddArtist: handleAddArtist,
      onRemoveArtist: handleRemoveArtist,
      //portal
      onActiveSong: handleActiveSong,
      //LyricSong
      onToggleLyricSong: handleToggleLyricSong,
      // create and edit playlist
      onCreatePlaylistAndEditName: handleCreatePlaylistAndEditName,
      onDeletePlaylist: handleDeletePlaylist,
      // CopyUrlClipBoard
      onCopyUrlClipBoard: handleCopyUrlClipBoard,
      // PlayMusicInPlaylist => phát nhạc trong playlist
      onPlayMusicInPlaylist: handlePlayMusicInPlaylist,
    },
    isAuth,
    user,
    selectedChart,
    // modal
    isOpenModal: isOpenModal,
    titleModal: dataModal.name,
    thumbnailM: dataModal.thumbnailM,
    desc: dataModal.desc,
    currentModal: currentModal,
    //portal
    coords: coords,
    isShowPortal: coords.isShowPortal,
    //LyricSong
    isOpenLyricSong: isOpenLyricSong,
    // create and edit playlist
    isModalPlaylist: dataModal.type,
    isModalDeleteShow: dataModal.isDeleteShow,
    // currentPlayMusicInPlaylist
    activeIdAlbum: currentDataPlaylist.id,
  };
  return <AuthProvider.Provider value={values}>{children}</AuthProvider.Provider>;
};
export { AppProvider, AuthProvider };
