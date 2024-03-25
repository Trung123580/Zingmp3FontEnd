import { useEffect, useState, useRef, useContext, useCallback, useMemo } from 'react';
import { apiGetArtist, apiVideoArtist, apiListMv } from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import { uniqBy as _uniqBy } from 'lodash';
import classNames from 'classnames/bind';
import style from './Video.module.scss';
import { getDeFaultDataVideo } from '~/store/actions/dispatch';
import { TbWindowMinimize } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { BsPlayCircle, BsPauseCircle } from 'react-icons/bs';
import Button from '~/utils/Button';
import { useTheme } from '@mui/material/styles';
import Tippy from '@tippyjs/react';
// import Tooltip from '@mui/material/Tooltip';
import path from '~/router/path';
import { AuthProvider } from '~/AuthProvider';
import VideoQueuePlayer from './VideoQueuePlayer';
import { BoxSkeleton, CardFullSkeletonBanner, CircleSkeleton, RowSkeleton, VideoSkeleton } from '~/BaseSkeleton';
import VideoPlayer from './VideoPlayer';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { PiMusicNotesSimpleBold, PiLink } from 'react-icons/pi';
import VideoControls from './VideoControls';
import TitlePath from '~/utils/TitlePath';
import ListMvArtists from './ListMvArtists';
import { listKeyVideo } from '~/utils/constant';
import MobileResponsiveHeader from './MobileResponsiveHeader';
import { SwipeableDrawer } from '@mui/material';
const cx = classNames.bind(style);
const Video = () => {
  const { themeApp, handle } = useContext(AuthProvider);
  const { deFautDataVideo } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const [dataVideo, setDataVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingListMV, setIsLoadingListMV] = useState(false);
  const [isOnMount, setIsOnMount] = useState(false);
  const [sourceVideo, setSourceVideo] = useState(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isAutoPlay, setIsAutoplay] = useState(true);
  const [listVPop, setListVPop] = useState(null);
  const [stateScreenMode, setStateScreenMode] = useState({
    isTheaterMode: false,
    isMiniPlayer: false,
  });

  const [statePlayVideo, setStatePlayVideo] = useState({
    isPlay: false,
    isShowIcon: false,
    defaultIsPlay: false,
    isMouse: true,
    isLoadingVideo: false,
    quality: localStorage.getItem('quality') || '720p', // tao localStorage
    isOpenQuality: false,
    isOpenSetting: false,
    percentSecondsLoaded: 0,
    isOpenDrawer: false,
  });
  const { onPlaySong, onAddMv, onRemoveMv, onAddHistoryMv, onCopyUrlClipBoard } = handle;
  const { isTheaterMode, isMiniPlayer } = stateScreenMode;
  const { isPlay, isShowIcon, defaultIsPlay, percentSecondsLoaded, isMouse, isLoadingVideo, quality, isOpenQuality, isOpenSetting } = statePlayVideo;
  const { videoId, titleVideo, name } = useParams();
  const timeoutRef = useRef(null);
  const videoRef = useRef(null);
  const hideMouseRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  // const listID = JSON.parse(localStorage.getItem('current-video'));
  const formatDuration = (value) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };
  const selectItem = deFautDataVideo?.recommends.find(({ encodeId }) => encodeId === videoId);
  const optionQueuePlayer = {
    isAutoPlay: isAutoPlay,
    theme: theme,
    selectItem: selectItem,
    themeApp: themeApp,
    onChangeAutoPlay: () => setIsAutoplay(!isAutoPlay),
    dataVideo: deFautDataVideo,
    theaterMode: isTheaterMode,
    onNavigate: handleNavigateArtist,
    onNavigateVideo: (url) => {
      handleNavigateVideo(url);
      setStatePlayVideo((prev) => ({ ...prev, defaultIsPlay: true, isShowIcon: false }));
    },
  };
  function handleNavigateArtist(type, url) {
    if (type === 1) return; // lam modal phat bai hat
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  }
  function handleNavigateVideo(url) {
    const indexNavigate = JSON.parse(localStorage.getItem('backTo'));
    const currentIndex = typeof indexNavigate === 'number' ? indexNavigate : 0;
    localStorage.setItem('backTo', JSON.stringify(currentIndex + 1));
    const pathLink = path.DETAILS_ARTIST.replace(':name', name) + path.OPEN_VIDEO;
    navigate(pathLink.replace('/video-clip/:titleVideo/:videoId', url.split('.')[0]));
  }

  const handleNavigate = (url) => {
    const index = url
      .split('/')
      .filter((item) => item !== 'nghe-si')
      .findLastIndex((item) => item);
    if (!(url.split('/').filter((item) => item !== 'nghe-si')[index] === name)) {
      navigate(
        url
          .split('/')
          .filter((item) => item !== 'nghe-si')
          .join('/')
      );
    }
  };
  const handleChangeQuality = useCallback(
    (qualityVideo) => {
      setStatePlayVideo((prev) => ({ ...prev, quality: qualityVideo, isOpenQuality: false, isOpenSetting: false }));
      localStorage.setItem('quality', qualityVideo);
      localStorage.setItem('stateSeconds', videoRef.current.getCurrentTime());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoRef.current]
  );
  const optionVideoControls = {
    isPlay: isPlay,
    isAutoPlay: isAutoPlay,
    secondsLoaded: percentSecondsLoaded || 0,
    currentSeconds: currentSeconds,
    volume: volume,
    themeApp: themeApp,
    theme: theme,
    menuQuality: () => {
      if (dataVideo?.streaming?.mp4) {
        const menu = Object.keys(dataVideo.streaming.mp4);
        if (menu.length === 4) {
          menu.pop();
          return menu;
        }
        return menu;
      }
      return [];
    },
    quality: quality,
    isOpenQuality: isOpenQuality,
    isOpenSetting: isOpenSetting,
    maxDuration: videoRef.current?.getDuration(),
    slots: formatDuration(currentSeconds),
    changeCurrentTime: formatDuration(Number(Math.floor(videoRef.current?.getDuration())) - Number(currentSeconds)),
    onOpenQuality: (openSetting, openQuality, hiddenQuality) => {
      if (openSetting) setStatePlayVideo((prev) => ({ ...prev, isOpenSetting: !prev.isOpenSetting, isOpenQuality: false }));
      if (openQuality) setStatePlayVideo((prev) => ({ ...prev, isOpenQuality: !prev.isOpenQuality }));
      if (hiddenQuality) setStatePlayVideo((prev) => ({ ...prev, isOpenQuality: false, isOpenSetting: true }));
    },
    onChangeCommitted: (_, value) => videoRef.current.seekTo(value),
    onTogglePlayVideo: handleTogglePlayVideo,
    onChange: (_, value) => setCurrentSeconds(value),
    onChangeVolume: (e, value) => setVolume(value),
    setChangeVolume: (number) => setVolume(number),
    onChangeAutoPlay: () => setIsAutoplay(!isAutoPlay),
    onChangeQuality: handleChangeQuality,
    // screen
    onChangeTheaterMode: async () => {
      setStateScreenMode((prev) => ({ ...prev, isTheaterMode: !prev.isTheaterMode }));
      if (document.fullscreenElement !== null) await document.exitFullscreen();
    },
    onChangeFullScreen: async () => {
      if (!videoRef.current) return;
      if (document.fullscreenElement === null) {
        await hideMouseRef.current?.requestFullscreen();
        if (isLoadingVideo || isOpenQuality) setStatePlayVideo((prev) => ({ ...prev, isOpenSetting: false, isOpenQuality: false }));
      } else {
        await document.exitFullscreen();
      }
    },
    // next
    onNextVideo: handleNextVideo,
    onPrevVideo: handlePrevVideo,
  };
  useEffect(() => {
    try {
      (async () => {
        setIsLoading(false);
        // const response = await apiVideoArtist(videoId);
        const [responseArtist, responseVPop] = await Promise.all([apiVideoArtist(videoId), apiListMv('IWZ9Z08I', 1, 8)]);
        if (responseArtist?.data?.err === 0 && responseVPop?.data?.err === 0) {
          if (!isOnMount) setIsOnMount(true);
          setCurrentSeconds(0);
          dispatch(getDeFaultDataVideo(responseArtist));
          setListVPop(responseVPop.data.data);
          setDataVideo(responseArtist.data.data);
          setStatePlayVideo((prev) => ({ ...prev, defaultIsPlay: false }));
          await handleGetVideoArtist(responseArtist);
        }
      })();
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   if (deFautDataVideo) {
  //       const getApiArtist = async () =>{

  //       }
  //   }
  // },[deFautDataVideo])
  const handleGetVideoArtist = async (response) => {
    const artistData = response.data?.data?.artists;
    setIsLoadingListMV(false);
    if (artistData.length === 1) {
      const response2 = await apiGetArtist(artistData[0].alias);
      if (response2?.data?.err === 0) {
        setIsLoadingListMV(true);
        setIsLoading(true);
        const findMenu = response2.data.data?.sections.find((item) => item.sectionType === 'video').items;
        const findListSong = response2.data.data.sections.find((item) => item.sectionType === 'song').items;
        setDataVideo((prevData) => ({
          ...prevData,
          audioSongs: findListSong,
          artists: prevData.artists.map((item) => ({
            ...item,
            filteredMvArtists: _uniqBy(
              findMenu.filter((item) => {
                // if (item.artists.length > 1) return null;
                return item.artist.id === prevData.artist.id;
              }),
              'encodeId'
            ),
          })),
        }));
      }
      return;
    }
    if (Array.isArray(artistData) && artistData.length > 1) {
      const artistPromises = artistData.map(async ({ alias }) => {
        const result = [];
        const response2 = await apiGetArtist(alias);
        return [
          ...result,
          response2.data.data?.sections.find((item) => item.sectionType === 'song'),
          response2.data.data?.sections.find((item) => item.sectionType === 'video'),
        ];
      });
      const numFruits = await Promise.all(artistPromises);
      setDataVideo((prevData) => ({
        ...prevData,
        audioSongs: numFruits
          .flat()
          .filter((media) => {
            return media.sectionType === 'song';
          })
          .map((video) => video.items)
          .flat(),
        artists: prevData.artists.map((item) => ({
          ...item,
          filteredMvArtists: _uniqBy(
            numFruits
              .flat()
              .filter((media) => {
                return media.sectionType === 'video';
              })
              .map((video) => video.items)
              .flat()
              .filter((video) => {
                return video.artist.id === item.id;
              }),
            'encodeId'
          ),
        })),
      }));
      setIsLoadingListMV(true);
      setIsLoading(true);
    }
  };
  // call nextVideo
  useEffect(() => {
    try {
      (async () => {
        if (!defaultIsPlay) return;
        setIsLoading(false);
        setIsLoadingListMV(false);
        setStatePlayVideo((prev) => ({ ...prev, isPlay: false }));
        const response = await apiVideoArtist(videoId);
        if (response.data.err === 0) {
          setCurrentSeconds(0);
          setDataVideo(response.data.data);
          setStatePlayVideo((prev) => ({ ...prev, isPlay: true }));
          await handleGetVideoArtist(response);
        }
      })();
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);
  // getSecondsLoaded;
  useEffect(() => {
    if (videoRef.current) {
      const seconds = videoRef.current.getSecondsLoaded();
      const duration = videoRef.current.getDuration();
      const ratio = Math.min(Math.floor((seconds / duration) * 100), 100);
      setStatePlayVideo((prev) => ({ ...prev, percentSecondsLoaded: ratio }));
    }
  }, [videoRef, currentSeconds]);

  useEffect(() => {
    if (dataVideo) {
      if (dataVideo?.streaming?.mp4[quality]) {
        setSourceVideo(dataVideo?.streaming?.mp4[quality]);
      } else {
        setSourceVideo(dataVideo?.streaming?.mp4['480p']);
        optionVideoControls.quality = '480p';
        localStorage.setItem('quality', '480p');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVideo, sourceVideo]);
  // ended Video
  const handleEndedVideo = () => {
    if (!isAutoPlay) {
      videoRef.current.seekTo(0, 'seconds');
      setCurrentSeconds(0);
      return;
    }
    if (!selectItem) handleNavigateVideo(deFautDataVideo?.recommends[0].link);
    if (selectItem) {
      const selectIndexItem = deFautDataVideo?.recommends.findIndex(({ encodeId }) => encodeId === videoId);
      if (deFautDataVideo?.recommends.length - 1 === selectItem) return;
      handleNavigateVideo(deFautDataVideo?.recommends[selectIndexItem + 1].link);
    }
  };
  // next video
  function handleNextVideo() {
    if (!selectItem) handleNavigateVideo(deFautDataVideo?.recommends[0].link);
    if (selectItem) {
      const selectIndexItem = deFautDataVideo?.recommends.findIndex(({ encodeId }) => encodeId === videoId);
      if (deFautDataVideo?.recommends.length - 1 === selectItem) return;
      handleNavigateVideo(deFautDataVideo?.recommends[selectIndexItem + 1].link);
    }
  }
  function handlePrevVideo() {
    if (!selectItem) {
      videoRef.current.seekTo(0, 'seconds');
      setCurrentSeconds(0);
      return;
    }
    if (selectItem) {
      const selectIndexItem = deFautDataVideo?.recommends.findIndex(({ encodeId }) => encodeId === videoId);
      if (selectIndexItem === 0) {
        videoRef.current.seekTo(0, 'seconds');
        setCurrentSeconds(0);
        return;
      }
      handleNavigateVideo(deFautDataVideo?.recommends[selectIndexItem - 1].link);
    }
  }
  const handleClickOutside = () => {
    setStatePlayVideo((prev) => ({ ...prev, isOpenSetting: false, isOpenQuality: false }));
  };
  useEffect(() => {
    const indexNavigate = JSON.parse(localStorage.getItem('backTo'));
    const currentIndex = typeof indexNavigate === 'number' ? indexNavigate : 0;
    localStorage.setItem('backTo', JSON.stringify(currentIndex ? currentIndex : 1));
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      localStorage.removeItem('backTo');
    };
  }, []);
  const currentTimeVideo = useMemo(() => {
    return videoRef.current?.getCurrentTime() || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current, quality]);
  useEffect(() => {
    setSourceVideo(dataVideo?.streaming?.mp4[quality]);
    let timeout = setTimeout(() => {
      videoRef.current?.seekTo(currentTimeVideo, 'seconds');
    }, 100);
    return () => {
      timeout && clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, videoRef, currentTimeVideo]);
  const handleMouseMove = () => {
    if (!statePlayVideo.isMouse) setStatePlayVideo((prev) => ({ ...prev, isMouse: true }));
    if (hideMouseRef.current) {
      hideMouseRef.current.style.cursor = 'default';
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (hideMouseRef.current) {
          hideMouseRef.current.style.cursor = 'none';
          if (statePlayVideo.isMouse) setStatePlayVideo((prev) => ({ ...prev, isMouse: false }));
        }
      }, 2500);
    }
  };
  useEffect(() => {
    let mouseRef = hideMouseRef.current;
    if (defaultIsPlay) {
      if (mouseRef) mouseRef.addEventListener('mousemove', handleMouseMove);
      return () => {
        if (mouseRef) mouseRef.removeEventListener('mousemove', handleMouseMove);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultIsPlay, hideMouseRef, isPlay]);
  useEffect(() => {
    if (!videoRef.current) return;

    const handleListenKeydown = async (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        setStatePlayVideo((prev) => ({ ...prev, isPlay: !prev.isPlay }));
      }
      if (e.code === 'ArrowRight' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const currentTime = videoRef.current.getCurrentTime();
        await videoRef.current.seekTo(currentTime + 15, 'seconds');
      }
      if (e.code === 'ArrowLeft' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        const currentTime = videoRef.current.getCurrentTime();
        await videoRef.current.seekTo(Math.max(currentTime - 15, 0), 'seconds'); // nếu nhỏ hơn 0 trả về 0
      }
      if (e.code === 'ArrowUp' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        setVolume((prevVolume) => Math.min(prevVolume + 15, 100)); // nếu lớn hơn 100 trả về 100
      }
      if (e.code === 'ArrowDown' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        setVolume((prevVolume) => Math.max(prevVolume - 15, 0)); // nếu nhỏ hơn 0 trả về 0
      }
      if (e.code === 'KeyF' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (document.fullscreenElement === null) {
          await hideMouseRef.current?.requestFullscreen();
          if (isLoadingVideo || isOpenQuality) setStatePlayVideo((prev) => ({ ...prev, isOpenSetting: false, isOpenQuality: false }));
        } else {
          await document.exitFullscreen();
        }
      }
      const duration = videoRef.current.getDuration();
      listKeyVideo.forEach(async (item) => {
        if (e.code === item.key && e.target.tagName !== 'INPUT') {
          await videoRef.current.seekTo(duration - item.coords * duration, 'seconds');
        }
      });
    };
    window.addEventListener('keydown', handleListenKeydown);
    // videoRef.current?.addEventListener('dblclick', handleFullScreenDBLclick);
    return () => {
      window.removeEventListener('keydown', handleListenKeydown);
      // videoRef.current?.removeEventListener('dblclick', handleFullScreenDBLclick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef.current, volume, isPlay]);
  function handleTogglePlayVideo(e) {
    e.stopPropagation();
    setStatePlayVideo((prev) => ({
      ...prev,
      isPlay: !prev.isPlay,
      isOpenQuality: false,
      isOpenSetting: false,
    }));
  }
  const handleMiniPlayer = () => {
    setStateScreenMode((prev) => ({ ...prev, isMiniPlayer: !prev.isMiniPlayer }));
  };
  const handleAudioVideo = () => {
    const indexNavigate = JSON.parse(localStorage.getItem('backTo'));
    navigate(-indexNavigate);
    onPlaySong(dataVideo.song, dataVideo.audioSongs, null);
  };
  const isExitsLikeVideo = currentUser?.followMv.some(({ encodeId }) => encodeId === videoId);
  const optionHeader = {
    themeApp: themeApp,
    isExitsLikeVideo: isExitsLikeVideo,
    onRemoveMv: onRemoveMv,
    videoId: videoId,
    onAddMv: onAddMv,
    dataVideo: dataVideo,
    onAudioVideo: handleAudioVideo,
    onCopyUrlClipBoard: onCopyUrlClipBoard,
    onMiniPlayer: handleMiniPlayer,
  };
  const handleToggleDrawer = (isboolean) => setStatePlayVideo((prev) => ({ ...prev, isOpenDrawer: isboolean }));
  if (!isOnMount) {
    return (
      <div className={cx('video-modal-loading')}>
        <div className={cx('container')} style={{ marginTop: '0' }}>
          <CardFullSkeletonBanner />
          <BoxSkeleton card={4} height={200} />
        </div>
      </div>
    );
  }
  return (
    <>
      {videoId && titleVideo && isOnMount && (
        <section className={cx('video-modal')} id='video-modal'>
          <Scrollbar
            wrapperProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <span {...restProps} ref={elementRef} style={{ inset: '0 0 10px 0' }} />;
              },
            }}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '4px' }} />;
              },
            }}
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    className='tHuMbY'
                    style={{
                      width: '100%',
                      backgroundColor: 'hsla(0,0%,100%,0.3)',
                      zIndex: '50',
                      position: 'relative',
                      borderRadius: '5px',
                    }}
                  />
                );
              },
            }}>
            <div className={cx('wrapper-video')}>
              <div className={cx('header')}>
                {isLoading ? (
                  <div className={cx('header-left')}>
                    <div className={cx('avatar')}>
                      <img src={dataVideo?.artist?.thumbnail} alt={dataVideo?.artist?.name} />
                    </div>
                    <div className={cx('name')}>
                      <h2>{dataVideo?.title}</h2>
                      <div className={cx('artists')}>
                        {dataVideo?.artists?.map(({ name, id, link, spotlight }, index, arr) => (
                          <span key={id} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', link))}>
                            {name}
                            {spotlight && <StarRateRoundedIcon />}
                            {`${index === arr.length - 1 ? '' : ','}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={cx('action-video')}>
                      <Tippy
                        content={<span className='tippy-title'>{isExitsLikeVideo ? 'Xóa vào thư viên' : 'Thêm khỏi thư viện'} </span>}
                        followCursor='horizontal'
                        placement='bottom'
                        arrow={true}
                        duration={300}>
                        {isExitsLikeVideo ? (
                          <div className={cx('icon')} onClick={() => onRemoveMv(videoId)}>
                            <FavoriteIcon fontSize='large' style={{ color: themeApp?.primaryColor }} />
                          </div>
                        ) : (
                          <div className={cx('icon')} onClick={() => onAddMv(dataVideo)}>
                            <FavoriteBorderIcon fontSize='large' />
                          </div>
                        )}
                      </Tippy>
                      <Tippy
                        content={<span className='tippy-title'>Nghe Audio</span>}
                        followCursor='horizontal'
                        placement='bottom'
                        arrow={true}
                        duration={300}>
                        <div className={cx('icon')} onClick={handleAudioVideo}>
                          <PiMusicNotesSimpleBold />
                        </div>
                      </Tippy>
                      <Tippy
                        content={<span className='tippy-title'>Sao chép link</span>}
                        followCursor='horizontal'
                        placement='bottom'
                        arrow={true}
                        duration={300}>
                        <div className={cx('icon')} onClick={onCopyUrlClipBoard}>
                          <PiLink />
                        </div>
                      </Tippy>
                    </div>
                  </div>
                ) : (
                  <RowSkeleton />
                )}
                <div className={cx('header-right')}>
                  {isLoading ? <Button icon={<TbWindowMinimize />} className='video-btn' onClick={handleMiniPlayer} /> : <CircleSkeleton />}
                  <Button
                    icon={<CloseRoundedIcon />}
                    style={{ margin: !isLoading && '4px 0' }}
                    className='video-btn'
                    onClick={() => {
                      const indexNavigate = JSON.parse(localStorage.getItem('backTo'));
                      navigate(-indexNavigate);
                    }}
                  />
                </div>
                <div className={cx('header__mobile')}>
                  <Button onClick={() => handleToggleDrawer(true)} icon={<MenuRoundedIcon fontSize='large' sx={{ fontSize: '3rem' }} />} />
                </div>
                <SwipeableDrawer
                  anchor={'right'}
                  open={statePlayVideo.isOpenDrawer}
                  onClose={() => handleToggleDrawer(false)}
                  onOpen={() => handleToggleDrawer(true)}>
                  <div className={cx('header__right-drawer')} onClick={() => setStatePlayVideo((prev) => ({ ...prev, isOpenDrawer: false }))}>
                    <MobileResponsiveHeader {...optionHeader} />
                  </div>
                </SwipeableDrawer>
              </div>
              <div
                className={cx('content', {
                  theaterMode: isTheaterMode,
                })}>
                <div className={cx('wrapper-content')}>
                  {isLoading ? (
                    <div
                      className={cx('video-player', {
                        isMouse: isMouse,
                      })}
                      onClick={handleTogglePlayVideo}
                      onDoubleClick={optionVideoControls.onChangeFullScreen}
                      ref={hideMouseRef}>
                      <VideoPlayer
                        ref={videoRef}
                        onPlay={() => setStatePlayVideo((prev) => ({ ...prev, isShowIcon: false, defaultIsPlay: true }))}
                        onPause={() => setStatePlayVideo((prev) => ({ ...prev, isShowIcon: true }))}
                        onProgress={(e) => {
                          setCurrentSeconds(Math.floor(e.playedSeconds));
                        }}
                        onStart={() => onAddHistoryMv(dataVideo)}
                        onBuffer={() => setStatePlayVideo((prev) => ({ ...prev, isLoadingVideo: true }))}
                        onBufferEnd={() => setStatePlayVideo((prev) => ({ ...prev, isLoadingVideo: false }))}
                        sourceVideo={sourceVideo}
                        isPlay={isPlay}
                        volume={volume / 100}
                        pip={isMiniPlayer}
                        light={!defaultIsPlay ? dataVideo?.thumbnailM : null}
                        onEnded={handleEndedVideo}
                        onEnablePIP={() => {
                          setStateScreenMode((prev) => ({ ...prev, isMiniPlayer: true }));
                          setStatePlayVideo((prev) => ({ ...prev, isPlay: true }));
                        }}
                        onDisablePIP={() => {
                          setStateScreenMode((prev) => ({ ...prev, isMiniPlayer: false }));
                          setStatePlayVideo((prev) => ({ ...prev, isPlay: false }));
                        }}
                      />
                      {defaultIsPlay && (
                        <>
                          {isShowIcon ? (
                            <span className={cx('default-icon-play')} onClick={handleTogglePlayVideo}>
                              <BsPlayCircle />
                            </span>
                          ) : (
                            <span
                              className={cx('default-icon-play', {
                                hidden: true,
                              })}
                              onClick={handleTogglePlayVideo}>
                              <BsPauseCircle />
                            </span>
                          )}
                          {isLoadingVideo && (
                            <span
                              className={cx('default-icon-play', {
                                rotate: true,
                              })}>
                              <AiOutlineLoading3Quarters />
                            </span>
                          )}
                          <VideoControls {...optionVideoControls} />
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={cx('wrapper_skeleton')}>
                      <VideoSkeleton />
                    </div>
                  )}
                  <VideoQueuePlayer {...optionQueuePlayer} />
                </div>
              </div>
            </div>
            <section className={cx('content__artist')}>
              {dataVideo?.artists.map((item, index) => (
                <div className={cx('box__video')} key={index}>
                  {isLoadingListMV && !!item?.filteredMvArtists.length && (
                    <TitlePath content={`MV Của ${item.name}`} style={{ marginTop: '30px', marginBottom: '20px' }} />
                  )}
                  <ListMvArtists
                    item={item}
                    isLoadingListMV={isLoadingListMV}
                    path={path}
                    onNavigateArtist={handleNavigate}
                    onNavigate={handleNavigate}
                    onOpenVideo={(url) => {
                      handleNavigateVideo(url);
                      setStatePlayVideo((prev) => ({ ...prev, defaultIsPlay: true, isShowIcon: false }));
                    }}
                  />
                </div>
              ))}
              <div className={cx('box__video')}>
                <TitlePath content={`V-Pop`} style={{ marginTop: '30px', marginBottom: '20px' }} />
                <ListMvArtists
                  item={listVPop.items}
                  isLoadingListMV={isLoadingListMV}
                  path={path}
                  onNavigateArtist={handleNavigate}
                  onNavigate={handleNavigate}
                  onOpenVideo={(url) => {
                    handleNavigateVideo(url);
                    setStatePlayVideo((prev) => ({ ...prev, defaultIsPlay: true, isShowIcon: false }));
                  }}
                />
              </div>
            </section>
          </Scrollbar>
        </section>
      )}
    </>
  );
};
export default Video;
