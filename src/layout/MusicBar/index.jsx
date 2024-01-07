import { useContext, useEffect, useState, useRef, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { playSong, openPlayList, getSong, randomSong } from '~/store/actions/dispatch';
import { AuthProvider } from '~/AuthProvider';
import { apiInfoSong, apiSong } from '~/api';
import { shuffle as _shuffle } from 'lodash';
// import { useParams } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames/bind';
import style from './MusicBar.module.scss';
import Tippy from '@tippyjs/react';
//  icon
import { backgroundDefaultBar } from '~/asset';
import { PiShuffleLight } from 'react-icons/pi';
import { IoRepeatOutline } from 'react-icons/io5';
import { LiaMicrophoneAltSolid } from 'react-icons/lia';
import { LuVolume2, LuVolumeX, LuListMusic } from 'react-icons/lu';
import { BsPlayCircle, BsPauseCircle } from 'react-icons/bs';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { FaRegWindowRestore } from 'react-icons/fa6';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Divide from '~/utils/Divide';
import path from '~/router/path';
import { useNavigate, useParams } from 'react-router-dom';
const cx = classNames.bind(style);
const MusicBar = () => {
  // const [songInfo, setSongInfo] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [audio, setAudio] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(100);
  const { currentSong, isRandomSong, isPlay, isOpenPlayList, currentPlayList } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onAddLikeSong, onRemoveLikeSong } = handle;
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const thumbRef = useRef();
  const trackRef = useRef();
  const trackNoteRef = useRef();
  const volumeRef = useRef();
  const inputVolumeRef = useRef();
  const cdThumb = useRef();
  const cdThumbAnimate = useRef(null);
  // console.log(currentSong);
  useEffect(() => {
    if (audio) {
      audio.pause();
      audio.load();
      audio.currentTime = 0;
    }
    const getDetailsSong = async () => {
      try {
        const response = await apiSong(currentSong?.encodeId);
        if (response.data?.err === 0) {
          setAudio(new Audio(response.data?.data[128]));
        } else {
          // // modal
          // alert('bai hat can nap vip');
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDetailsSong();
  }, [currentSong]);
  useEffect(() => {
    (async () => {
      const response = await apiInfoSong(currentSong?.encodeId);
      if (response.data?.err === 0) {
        currentSong.mvlink = response.data.data.mvlink;
      }
    })();
  }, [currentSong?.encodeId]);
  // cdThumb rotate
  useEffect(() => {
    if (cdThumb.current) {
      if (!cdThumbAnimate.current) {
        cdThumbAnimate.current = cdThumb.current.animate([{ transform: 'rotate(360deg)' }], {
          duration: 10000,
          iterations: Infinity,
        });
      }
      if (!isPlay) {
        cdThumbAnimate.current.pause();
      } else {
        cdThumbAnimate.current.play();
      }
    }
  }, [isPlay]);

  useEffect(() => {
    const handleListenKeydown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (audio) {
          if (!audio.paused) {
            audio.pause();
            dispatch(playSong(false));
          } else {
            audio.play();
            dispatch(playSong(true));
          }
        }
      }
    };
    window.addEventListener('keydown', handleListenKeydown);
    return () => {
      window.removeEventListener('keydown', handleListenKeydown);
    };
  }, [audio]);
  const indexSong = useMemo(() => {
    return currentPlayList?.listItem?.findIndex(({ encodeId }) => encodeId === currentSong?.encodeId);
  }, [currentSong]);
  const handleNextSong = () => {
    if (indexSong !== -1 && indexSong + 1 < currentPlayList?.listItem?.length) {
      dispatch(getSong(currentPlayList?.listItem[indexSong + 1]));
    } else {
      dispatch(getSong(currentPlayList.listItem[0]));
    }
  };
  const handlePrevSong = () => {
    if (indexSong !== -1 && indexSong - 1 >= 0) {
      dispatch(getSong(currentPlayList?.listItem[indexSong - 1]));
    } else {
      // Không có bài hát trước đó, quay về cuối danh sách
      dispatch(getSong(currentPlayList.listItem[currentPlayList.listItem.length - 1]));
    }
  };
  // randomSong
  const handleToggleRandomSong = () => {
    if (isRandomSong) {
      dispatch(randomSong(false));
    } else {
      dispatch(randomSong(true));
    }
  };
  useEffect(() => {
    if (audio) {
      const handleEnded = () => {
        audio.pause();
        audio.load();
        audio.currentTime = 0;
        thumbRef.current.style.background = `linear-gradient(to right, #fff 0%, #fff 0%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)`;
        setSeconds(0);
        console.log(isRandomSong);
        if (isRandomSong) {
          if (indexSong !== -1 && indexSong + 1 < currentPlayList?.listItem?.length) {
            dispatch(getSong(_shuffle(currentPlayList?.listItem)[indexSong + 1]));
          } else {
            dispatch(getSong(currentPlayList.listItem[0]));
          }
          return;
        }
        if (indexSong !== -1 && indexSong + 1 < currentPlayList?.listItem?.length) {
          dispatch(getSong(currentPlayList?.listItem[indexSong + 1]));
        } else {
          dispatch(getSong(currentPlayList.listItem[0]));
        }
      };

      audio.addEventListener('ended', handleEnded);

      if (isPlay) {
        audio.play();
      }

      return () => {
        !!audio && audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audio, isRandomSong]);

  useEffect(() => {
    if (volumeRef.current) {
      if (audio) {
        audio.volume = volume / 100;
        volumeRef.current.style.background = `linear-gradient(to right, ${themeApp?.primaryColor} 0%, ${themeApp?.primaryColor} ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%, rgba(255, 255, 255, 0.3) 100%)`;
        inputVolumeRef.current.style.background = `linear-gradient(to right, ${themeApp?.primaryColor} 0%, ${themeApp?.primaryColor} ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%, rgba(255, 255, 255, 0.3) 100%)`;
      }
    }
  }, [volume]);
  const handleMuteToggleVolume = () => {
    if (volumeRef.current) {
      if (audio) {
        const result = (audio.volume = audio.volume === 0 ? 1 : 0);
        result === 1 ? setVolume(100) : setVolume(result);
      }
    }
  };
  useEffect(() => {
    let intervalId;
    const updateCurrentTime = () => {
      if (audio && !isDragging) {
        const percent = Math.round((audio.currentTime * 10000) / audio?.duration / 100);
        thumbRef.current.style.background = `linear-gradient(to right, #fff 0%, #fff ${percent}%, rgba(255, 255, 255, 0.3) ${percent}%, rgba(255, 255, 255, 0.3) 100%)`;
        trackNoteRef.current.style.left = `${percent - 1}%`;
        setSeconds(Math.round(audio.currentTime));
      }
    };
    if (isPlay) {
      intervalId = setInterval(updateCurrentTime, 50);
    } else {
      intervalId && clearInterval(intervalId);
    }
    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, [isPlay, audio, isDragging]);
  useEffect(() => {
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);
  const handleTogglePlayMusic = () => {
    if (isPlay) {
      audio?.pause();
      dispatch(playSong(false));
    } else {
      audio?.play();
      dispatch(playSong(true));
    }
  };
  const handleProgressbar = (e) => {
    if (audio?.currentTime) {
      const trackThumbnail = trackRef.current.getBoundingClientRect();
      const percent = calculatePercentage(e.clientX, trackThumbnail);
      thumbRef.current.style.background = `linear-gradient(to right, #fff 0%, #fff ${percent}%, rgba(255, 255, 255, 0.3) ${percent}%, rgba(255, 255, 255, 0.3) 100%)`;
      audio.currentTime = (percent * audio?.duration) / 100;
      setSeconds(Math.round((percent * audio?.duration) / 100));
    }
  };
  const calculatePercentage = (clientX, trackThumbnail) => {
    return Math.round(((clientX - trackThumbnail.left) * 10000) / trackThumbnail.width) / 100;
  };
  const handleDragStart = () => {
    setIsDragging(true);
  };
  const handleDragMove = (e) => {
    if (isDragging && audio) {
      const trackThumbnail = trackRef.current.getBoundingClientRect();
      let percent = calculatePercentage(e.clientX, trackThumbnail);
      // Giới hạn percent trong khoảng từ 0 đến 100
      percent = Math.min(100, Math.max(0, percent));
      thumbRef.current.style.background = `linear-gradient(to right, #fff 0%, #fff ${percent}%, rgba(255, 255, 255, 0.3) ${percent}%, rgba(255, 255, 255, 0.3) 100%)`;
      trackNoteRef.current.style.left = `${percent - 1}%`;
      if (percent >= 0 && percent <= 100) {
        audio.currentTime = (percent * audio?.duration) / 100;
        setSeconds(Math.round((percent * audio?.duration) / 100));
      }
      if (percent === 100) {
        thumbRef.current.style.background = `linear-gradient(to right, #fff 0%, #fff ${percent}%, rgba(255, 255, 255, 0.3) ${percent}%, rgba(255, 255, 255, 0.3) 100%)`;
      }
    }
  };
  const handleDragEnd = (e) => {
    setIsDragging(false);
    // Nếu người dùng nhấc chuột lên từ thanh tiến độ, cập nhật thanh tiến độ
    if (e.target === trackRef.current) {
      const trackThumbnail = trackRef.current.getBoundingClientRect();
      const percent = calculatePercentage(e.clientX, trackThumbnail);
      thumbRef.current.style.background = `linear-gradient(to right, #fff 0%, #fff 100%, rgba(255, 255, 255, 0.3) 100%, rgba(255, 255, 255, 0.3) 100%)`;
      audio.currentTime = (percent * audio?.duration) / 100;
      setSeconds(Math.round((percent * audio?.duration) / 100));
    }
  };
  const handleOpenQueue = () => {
    dispatch(openPlayList(!isOpenPlayList));
  };
  // next sing

  // navigate
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  // console.log(currentSong);
  const handleNavigateVideo = (url) => {
    const pathLink = path.DETAILS_ARTIST.replace(':name', name) + path.OPEN_VIDEO;
    navigate(pathLink.replace('/video-clip/:titleVideo/:videoId', url.split('.')[0]));
  };
  // loveMusic
  const isLikeMusic = currentUser?.loveMusic.some(({ encodeId }) => encodeId === currentSong?.encodeId);
  if (!currentSong && !audio) return null;
  // if (isHiddenMusicBar) return null;
  return (
    <div id={cx('music-bar')} style={{ backgroundImage: `url(${themeApp?.backgroundMusicBar || backgroundDefaultBar})` }}>
      <div className={cx('player-controls')}>
        <div className={cx('player-left')}>
          <div className={cx('song-info')}>
            <div
              ref={cdThumb}
              className={cx('avatar', {
                rotate: isPlay,
              })}>
              <img src={currentSong?.thumbnailM} alt='error' />
            </div>
            <div className={cx('name')}>
              <h3>{currentSong?.title}</h3>
              <div className={cx('artists')}>
                {currentSong?.artists?.map(({ name, id, link }, index, arr) => (
                  <span key={id} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', link))}>
                    {name + `${index === arr.length - 1 ? '' : ','}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={cx('action')}>
            <Tippy
              content={<span className='tippy-title'>Thêm vào thư viện</span>}
              followCursor='horizontal'
              placement='top'
              arrow={true}
              duration={300}>
              {isLikeMusic ? (
                <span className={cx('icon')} onClick={(e) => onRemoveLikeSong(e, currentSong?.encodeId)}>
                  <FavoriteIcon fontSize='large' style={{ color: themeApp?.primaryColor }} />
                </span>
              ) : (
                <span className={cx('icon')} onClick={(e) => onAddLikeSong(e, currentSong)}>
                  <FavoriteBorderIcon fontSize='large' />
                </span>
              )}
            </Tippy>
            <Tippy content={<span className='tippy-title'>Khác</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
              <span className={cx('icon')}>{<MoreHorizIcon fontSize='large' />}</span>
            </Tippy>
          </div>
        </div>
        <div className={cx('player-middle')}>
          <div className={cx('music-controls')}>
            <Tippy
              content={<span className='tippy-title'>bật phát ngẫu nhiên</span>}
              followCursor='horizontal'
              placement='top'
              arrow={true}
              duration={300}>
              <span className={cx('zm-btn')} style={{ color: isRandomSong && themeApp?.primaryColor }} onClick={handleToggleRandomSong}>
                <PiShuffleLight />
              </span>
            </Tippy>
            <span className={cx('zm-btn')} onClick={handlePrevSong}>
              <SkipPreviousRoundedIcon />
            </span>
            <span className={cx('zm-btn')} onClick={handleTogglePlayMusic}>
              {isPlay ? <BsPauseCircle className={cx('icon-play')} /> : <BsPlayCircle className={cx('icon-play')} />}
            </span>
            <span className={cx('zm-btn')} onClick={handleNextSong}>
              <SkipNextRoundedIcon />
            </span>
            <Tippy
              content={<span className='tippy-title'>bật phát lại tất cả</span>}
              followCursor='horizontal'
              placement='top'
              arrow={true}
              duration={300}>
              <span className={cx('zm-btn')}>
                <IoRepeatOutline />
              </span>
            </Tippy>
          </div>
          <div className={cx('music-range')}>
            <div className={cx('start')}>{moment.utc(moment.duration(seconds, 'seconds').asMilliseconds()).format('mm:ss')}</div>
            <div className={cx('wrapper-range')} ref={trackRef} onClick={handleProgressbar} onMouseDown={handleDragStart}>
              <div className={cx('thumbTrack')} ref={thumbRef}></div>
              <span className={cx('note-track')} ref={trackNoteRef} style={{ background: themeApp?.primaryColor }}></span>
            </div>
            <div className={cx('end')}>{moment.utc(moment.duration(audio?.duration - seconds || 0, 'seconds').asMilliseconds()).format('mm:ss')}</div>
          </div>
        </div>
        <div className={cx('player-right')}>
          <div className={cx('music-controls')}>
            <Tippy content={<span className='tippy-title'>MV</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
              {currentSong?.mvlink ? (
                <span className={cx('zm-btn')} onClick={() => handleNavigateVideo(currentSong?.mvlink)}>
                  <BiSolidMoviePlay />
                </span>
              ) : (
                <span
                  className={cx('zm-btn', {
                    disable: true,
                  })}>
                  <BiSolidMoviePlay />
                </span>
              )}
            </Tippy>
            <Tippy
              content={<span className='tippy-title'>Xem lời bài hát</span>}
              followCursor='horizontal'
              placement='top'
              arrow={true}
              duration={300}>
              <span className={cx('zm-btn')}>
                <LiaMicrophoneAltSolid />
              </span>
            </Tippy>
            <Tippy content={<span className='tippy-title'>Chế độ cửa sổ</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
              <span className={cx('zm-btn')}>
                <FaRegWindowRestore />
              </span>
            </Tippy>
            <div className={cx('fixes')}>
              <div className={cx('zm-btn')} onClick={handleMuteToggleVolume}>
                {audio?.volume === 0 ? <LuVolumeX /> : <LuVolume2 />}
              </div>
              <div className={cx('volume')}>
                <div className={cx('volume-wrapper')}>
                  <input
                    className={cx('volume-input')}
                    type='range'
                    min={0}
                    max={100}
                    step={1}
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    ref={inputVolumeRef}
                    style={{
                      background: `linear-gradient(to right, ${themeApp?.primaryColor} 0%, ${themeApp?.primaryColor} ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%, rgba(255, 255, 255, 0.3) 100%)`,
                    }}
                  />
                  <div
                    className={cx('volume-slide-thumb')}
                    ref={volumeRef}
                    style={{
                      background: `linear-gradient(to right, ${themeApp?.primaryColor} 0%, ${themeApp?.primaryColor} ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%, rgba(255, 255, 255, 0.3) 100%)`,
                    }}></div>
                </div>
              </div>
            </div>
            <Divide style={{ height: '33px', width: '1px', background: 'hsla(0,0%,100%,0.1)', margin: '0 10px' }} />
            <Tippy
              content={<span className='tippy-title'>Danh sách phát</span>}
              followCursor='horizontal'
              placement='top'
              arrow={true}
              duration={300}>
              <span
                className={cx('zm-btn', {
                  openPlayList: isOpenPlayList,
                })}
                style={{ background: isOpenPlayList && themeApp?.primaryColor }}
                onClick={handleOpenQueue}>
                <LuListMusic />
              </span>
            </Tippy>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MusicBar);
