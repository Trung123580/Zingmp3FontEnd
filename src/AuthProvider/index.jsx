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
import { ref, deleteObject } from 'firebase/storage';
import { firebaseStorage } from '~/fireBase-config';

const AuthProvider = createContext();
const cookies = new Cookies();
const expirationDate = new Date();
const AppProvider = ({ children }) => {
  const { theme, currentUser } = useSelector((state) => state.auth);
  const { currentPlayList, isPlay } = useSelector((state) => state.app);
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
      isModalShowLyric: false,
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
    // thumbnailM: '',
    // title: '',
    song: null,
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
  }, [appCallBack, user, isAuth]);
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
        isModalShowLyric: data?.isModalShowLyric,
        id: data?.id || null,
        thumbnailM: data?.thumbnailM,
        desc: data?.desc,
      },
      currentModal: currentModal,
    }));
  const handleClose = () =>
    setOpenModal((prev) => ({
      ...prev,
      isOpenModal: false,
      dataModal: {
        ...prev.dataModal,
        isModalShowLyric: false,
        isDeleteShow: false,
      },
    }));
  //toastify
  const notify = (desc) => (desc.includes('xóa') ? toast.error(desc) : toast.success(desc));
  //chart
  const handleChartHoverTooltip = (data) => {
    setSelectedChart(data);
  };
  const handleAddHistoryPlaylist = async (props) => {
    const isExit = currentUser?.historyPlaylist.some((item) => item.encodeId === props.id);
    if (isExit) return;
    const userDoc = doc(db, 'user', user?.uid);
    const playListData = {
      thumbnailM: props.thumbnailM || '',
      encodeId: props.id || '',
      link: props.link || '',
      title: props.title || '',
      sortDescription: props.sortDescription || '',
      artists: props.artists || [],
      isUser: props.isUser || '',
    };
    await updateDoc(userDoc, {
      historyPlaylist: arrayUnion(playListData),
    }).then(() => {
      dispatch(dataUser({ ...currentUser, historyPlaylist: [...currentUser?.historyPlaylist, playListData] }));
      notify('đã thêm playlist vào lịch sử thư viện');
    });
  };
  // playlist and play song
  const handleAddSongPlaylist = useCallback(
    async (idPlaylist, songItem) => {
      if (!isAuth) {
        handleLoginApp();
        return;
      }
      const findItem = (currentUser?.createPlaylist || []).find((item) => item.encodeId === idPlaylist);
      const isExist = findItem?.items.some((it) => it?.encodeId === songItem.encodeId);
      if (isExist) {
        notify('Đã tồn tại trong play list');
        return;
      }
      const newDataPlaylist = (currentUser?.createPlaylist || [])
        .reduce((accumulator, item) => {
          const newItem = {
            ...item,
            items:
              item.encodeId === idPlaylist
                ? [...item.items, item.items.some((it) => it?.encodeId === songItem.encodeId) ? null : songItem]
                : item.items,
          };
          return [...accumulator, newItem];
        }, [])
        .filter((item) => item !== undefined);
      const userDoc = doc(db, 'user', user?.uid);
      console.log(newDataPlaylist);
      await updateDoc(userDoc, {
        createPlaylist: newDataPlaylist,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, createPlaylist: newDataPlaylist }));
        notify('đã thêm bài hát vào playlist');
      });
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  // handleAddHistorySong
  const handleAddHistorySong = useCallback(
    async (item) => {
      if (isAuth) {
        const userDoc = doc(db, 'user', user?.uid);
        const isExit = currentUser?.historySong?.some(({ encodeId }) => encodeId === item.encodeId);
        const videoData = {
          encodeId: item.encodeId || '',
          thumbnailM: item.thumbnailM || '',
          artists: item.artists || '',
          title: item.title || '',
          releaseDate: item.releaseDate || '',
          album: item.album || '',
          duration: item.duration || '',
          isUser: item.isUser || false,
          fileUploadAudio: true,
          url: item.url || '',
        };
        if (!isExit) {
          await updateDoc(userDoc, {
            historySong: arrayUnion(videoData),
          }).then(() => {
            setAppCallBack((prevAppCallBack) => !prevAppCallBack);
            notify('đã thêm lich su thư viện');
          });
        }
      }
    },
    [isAuth, currentUser, user]
  );
  const handlePlayMusicInPlaylist = async (e, props) => {
    e.stopPropagation();
    if (props?.isUser) {
      const findPlaylist = currentUser?.createPlaylist.find((item) => item.encodeId === props.id);
      const songs = findPlaylist?.items;
      if (!songs.length) {
        notify('Playlist chưa có bài hát nào');
        return;
      }
      const songItem = songs[Math.floor(Math.random() * songs.length)];
      dispatch(getSong(songItem));
      dispatch(getCurrentPlayList({ listItem: songs, title: `Từ playlist ${findPlaylist?.title}` }));
      dispatch(playSong(true));
      handleAddHistorySong(songItem);
      return;
    }
    if (currentDataPlaylist.id === props.id) {
      const songItem = currentDataPlaylist.data[Math.floor(Math.random() * currentDataPlaylist.data.length)];
      dispatch(getSong(songItem));
      dispatch(getCurrentPlayList({ listItem: currentDataPlaylist.data, title: props?.title }));
      dispatch(playSong(true));
      handleAddHistorySong(songItem);
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
        const songItem = data[Math.floor(Math.random() * data.length)];
        dispatch(getSong(songItem));
        dispatch(getCurrentPlayList({ listItem: data, title: props?.title }));
        dispatch(playSong(true));
        handleAddHistorySong(songItem);
        setCurrentDataPlaylist({ id: props.id, data: data });
        handleAddHistoryPlaylist(props);
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
      const screenWidth = window.innerWidth;
      const clientRect = e.target.getBoundingClientRect();
      const rightSpace = screenWidth - clientRect.right;
      const bottomSpace = screenHeight - clientRect.bottom;
      const leftSpace = screenWidth - clientRect.left;
      setCoords({
        x: clientRect.left,
        y: clientRect.top,
        width: clientRect.width,
        height: clientRect.height,
        // thumbnailM: song.thumbnailM || null,
        // encodeId: song.encodeId || null,
        // title: song.title || null,
        song: { ...song },
        isShowPortal: true,
        isDelete: isDelete,
        targetSong: targetSong, // false => danh sach phat / true => history
        file__upload: typeof targetSong === 'string' ? true : false,
      });
      if (bottomSpace < 200) {
        setCoords((prev) => ({ ...prev, y: clientRect.top - 200, x: clientRect.left + 200 }));
      }
      if (rightSpace < 200) {
        setCoords((prev) => ({ ...prev, x: clientRect.left }));
      }
      if (leftSpace < 200) {
        setCoords((prev) => ({ ...prev, x: clientRect.right - 20 }));
      }
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
          isUser: true,
        };
        await updateDoc(userDoc, {
          createPlaylist: arrayUnion({ ...data }),
        }).then(() => {
          dispatch(dataUser({ ...currentUser, createPlaylist: [...currentUser?.createPlaylist, { ...data }] }));
          notify('đã tạo playlist');
        });
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
          historyPlaylist: [], // lịch sử nghe bài hát trong play list đó
          uploadAudio: [], // uploadAudio
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
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
      if (song?.encodeId === item?.encodeId) {
        dispatch(playSong(!isPlay));
        return;
      }
      dispatch(getSong({ ...item, artists: item.artists || [] }));
      dispatch(getCurrentPlayList({ listItem: listItem, title: title }));
      dispatch(playSong(true));
      if (currentDataPlaylist.id && currentDataPlaylist.data) setCurrentDataPlaylist((prev) => ({ ...prev, id: null, data: null }));
      handleAddHistorySong(item);
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser, isPlay]
  );
  // remove historySong
  const handleRemoveHistorySong = useCallback(
    async (e, idSong) => {
      e.stopPropagation();
      if (typeof coords.targetSong === 'string') {
        const audioRef = ref(firebaseStorage, `audio/${coords.targetSong}`);
        try {
          await deleteObject(audioRef).then(() => {
            notify('đã xóa bài hát tải lên ');
            handleActiveSong(null, null);
          });
        } catch (error) {
          console.error('Xảy ra lỗi khi xóa tệp âm thanh:', error);
        }
        return;
      }
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
      console.log(newDataStory);
      console.log(idSong);
      console.log(newDataStory.length);
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
      });
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
      });
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
      });
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
      });
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
      });
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
        thumbnailM: video.thumbnailM || '',
        title: video.title || '',
        encodeId: video.encodeId || '',
        link: video.link || '',
        artists: video.artists || '',
        duration: video.duration || '',
        artist: video.artist || '',
      };
      await updateDoc(userDoc, {
        historyMv: arrayUnion(videoData),
      }).then(() => {
        dispatch(dataUser({ ...currentUser, historyMv: [...currentUser?.historyMv, videoData] }));
      });
    },
    // eslint-disable-next-line
    [isAuth, user, currentUser]
  );
  const handleRemoveHistoryMv = useCallback(
    async (e, idVideo) => {
      e.stopPropagation();
      const newDataStory = currentUser?.historyMv.filter(({ encodeId }) => encodeId !== idVideo);
      const userDoc = doc(db, 'user', user?.uid);
      await updateDoc(userDoc, {
        historyMv: newDataStory,
      }).then(() => {
        dispatch(dataUser({ ...currentUser, historyMv: newDataStory }));
        notify('đã xóa mv khỏi thư viện');
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
      // addHistoryPlaylist
      onAddHistoryPlaylist: handleAddHistoryPlaylist,
      onRemoveHistoryMv: handleRemoveHistoryMv,
      // handleAddSongPlaylist
      onAddSongPlaylist: handleAddSongPlaylist,
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
    // isModalShowLyric
    // isModalShowLyric: dataModal.isModalShowLyric,
    modalLyricSong: {
      isModalShowLyric: dataModal.isModalShowLyric,
      encodeId: dataModal.id,
    },
    // currentPlayMusicInPlaylist
    activeIdAlbum: currentDataPlaylist.id,
    // dataQueueSong
    // dataQueueSong: dataQueueSong,
  };
  return <AuthProvider.Provider value={values}>{children}</AuthProvider.Provider>;
};
export { AppProvider, AuthProvider };
