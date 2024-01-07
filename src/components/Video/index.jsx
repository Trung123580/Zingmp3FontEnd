import { useEffect, useState, useRef, useContext } from 'react';
import { apiVideoArtist } from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import Button from '~/utils/Button';
import classNames from 'classnames/bind';
import style from './Video.module.scss';
import { getDataVideo } from '~/store/actions/dispatch';
import { TbWindowMinimize } from 'react-icons/tb';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import { BsPlayCircle, BsPauseCircle } from 'react-icons/bs';
import path from '~/router/path';
import VideoQueuePlayer from './VideoQueuePlayer';
import { useTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import VideoPlayer from './VideoPlayer';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import CropFreeRoundedIcon from '@mui/icons-material/CropFreeRounded';
import { IoPlay, IoPause, IoRepeatOutline } from 'react-icons/io5';
import { LuRectangleHorizontal } from 'react-icons/lu';
import { LuVolume2, LuVolumeX } from 'react-icons/lu';
import { AuthProvider } from '~/AuthProvider';
const cx = classNames.bind(style);
const Video = () => {
  const { dataVideo } = useSelector((state) => state.app);
  const [isLoading, setIsLoading] = useState(false);
  const { videoId, titleVideo, name } = useParams();
  const [sourceVideo, setSourceVideo] = useState(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [volume, setVolume] = useState(100);
  const [statePlayVideo, setStatePlayVideo] = useState({
    isPlay: false,
    isShowIcon: false,
    defaultIsPlay: false,
  });
  const { isPlay, isShowIcon, defaultIsPlay } = statePlayVideo;
  const { themeApp } = useContext(AuthProvider);
  const videoRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const formatDuration = (value) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };
  useEffect(() => {
    (async () => {
      const response = await apiVideoArtist(videoId);
      if (response.data.err === 0) {
        setIsLoading(true);
        dispatch(getDataVideo(response));
        setSourceVideo(response.data.data.streaming.mp4['720p']);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);
  useEffect(() => {
    let timePlayVideo;
    if (isLoading) {
      timePlayVideo = setTimeout(() => {
        setStatePlayVideo((prev) => ({ ...prev, isPlay: !prev.isPlay, isShowIcon: !prev.isShowIcon }));
      }, 300);
    }
    return () => {
      timePlayVideo && clearTimeout(timePlayVideo);
    };
  }, [isLoading]);
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
  const handleTogglePlayVideo = (e) => {
    e.stopPropagation();
    setStatePlayVideo((prev) => ({
      ...prev,
      isPlay: !prev.isPlay,
    }));
  };
  const handleChangeVolume = (e, value) => {
    setVolume(value);
  };
  if (!isLoading) {
    return (
      <div className={cx('video-modal-loading')}>
        <div className={cx('container')} style={{ marginTop: '0' }}>
          <CardFullSkeletonBanner />
          <BoxSkeleton card={5} height={200} />
        </div>
      </div>
    );
  }
  return (
    <>
      {videoId && titleVideo && isLoading && (
        <section className={cx('video-modal')}>
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
                <div className={cx('header-left')}>
                  <div className={cx('avatar')}>
                    <img src={dataVideo?.artist.thumbnail} alt={dataVideo?.artist.name} />
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
                  <div className={cx('action-video')}></div>
                </div>
                <div className={cx('header-right')}>
                  <Button icon={<TbWindowMinimize />} className='video-btn' />
                  <Button icon={<CloseRoundedIcon />} className='video-btn' onClick={() => navigate(-1)} />
                </div>
              </div>
              <div className={cx('content')}>
                <div className={cx('wrapper-content')}>
                  <div
                    className={cx('video-player')}
                    style={{
                      paddingBottom: defaultIsPlay ? '0' : '56.25%',
                    }}>
                    <VideoPlayer
                      ref={videoRef}
                      onPlay={() =>
                        setStatePlayVideo((prev) => ({
                          ...prev,
                          isShowIcon: false,
                          defaultIsPlay: true,
                        }))
                      }
                      onPause={() => setStatePlayVideo((prev) => ({ ...prev, isShowIcon: true }))}
                      onProgress={(e) => setCurrentSeconds(Math.floor(e.playedSeconds))}
                      dataVideo={dataVideo}
                      sourceVideo={sourceVideo}
                      isPlay={isPlay}
                      volume={volume / 100}
                    />
                    {defaultIsPlay && (
                      <>
                        <div className={cx('overlay')} onClick={handleTogglePlayVideo} />
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
                        <div className={cx('video-progress')}>
                          <div>
                            <Slider
                              className={cx('progress-bar')}
                              aria-label='time-indicator'
                              size='small'
                              value={currentSeconds}
                              min={0}
                              step={1}
                              max={videoRef.current?.getDuration()}
                              onChange={(_, value) => setCurrentSeconds(value)}
                              onChangeCommitted={(_, value) => videoRef.current.seekTo(value)}
                              slots={{
                                valueLabel: formatDuration(currentSeconds),
                              }}
                              sx={{
                                color: '#fff',
                                height: 4,
                                '&:hover': {
                                  height: 6,
                                },
                                '& .MuiSlider-thumb': {
                                  width: 8,
                                  height: 8,
                                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                  '&::before': {
                                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                  },
                                  '&:hover, &.Mui-focusVisible': {
                                    boxShadow: `0px 0px 0px 4px ${theme.palette.mode === 'dark' ? 'rgb(255 255 255 / 16%)' : 'rgb(0 0 0 / 16%)'}`,
                                  },
                                  '&.Mui-active': {
                                    width: 10,
                                    height: 10,
                                  },
                                },
                                '& .MuiSlider-rail': {
                                  opacity: 0.28,
                                },
                              }}
                            />
                          </div>
                          <div className={cx('controls-video')}>
                            <div className={cx('controls-left')}>
                              <span className={cx('icon')}>
                                <SkipPreviousRoundedIcon />
                              </span>
                              <span
                                className={cx('icon', {
                                  sizeLg: true,
                                })}
                                onClick={handleTogglePlayVideo}>
                                {isPlay ? <IoPause /> : <IoPlay />}
                              </span>
                              <span className={cx('icon')}>
                                <SkipNextRoundedIcon />
                              </span>
                              <span
                                className={cx('icon', {
                                  volume: true,
                                })}
                                style={{ marginLeft: '10px' }}>
                                {volume ? <LuVolume2 onClick={() => setVolume(0)} /> : <LuVolumeX onClick={() => setVolume(100)} />}
                                <Slider
                                  className={cx('slider-volume')}
                                  aria-label='Volume'
                                  value={volume}
                                  onChange={handleChangeVolume}
                                  sx={{
                                    mx: '10px',
                                    height: 3,
                                    '&:hover': {
                                      height: 4,
                                    },
                                    color: themeApp?.primaryColor,
                                    '& .MuiSlider-thumb': {
                                      width: 13,
                                      height: 13,
                                      '&::before': {
                                        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.4)',
                                      },
                                      '&:hover, &.Mui-focusVisible': {
                                        boxShadow: `0px 0px 0px 4px ${theme.palette.mode === 'dark' ? 'rgb(255 255 255 / 16%)' : 'rgb(0 0 0 / 16%)'}`,
                                      },
                                    },
                                  }}
                                />
                              </span>
                              <div className={cx('current-time')}>
                                <span>00:00</span>
                                <span>|</span>
                                <span> 00:00</span>
                              </div>
                            </div>
                            <div className={cx('controls-right')}>
                              <span className={cx('icon')}>
                                <IoRepeatOutline />
                              </span>
                              <span className={cx('icon')}>
                                <SettingsOutlinedIcon />
                              </span>
                              <span className={cx('icon')}>
                                <LuRectangleHorizontal />
                              </span>
                              <span className={cx('icon')}>
                                <CropFreeRoundedIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <VideoQueuePlayer />
                </div>
              </div>
            </div>
            <div>
              <span>{formatDuration(currentSeconds)}</span>
              <span>{formatDuration(Number(Math.floor(videoRef.current?.getDuration())) - Number(currentSeconds))}</span>
              <br />
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea quidem praesentium, et voluptas amet a delectus nostrum neque culpa!
              Dignissimos quo autem ut et quasi ducimus sit quibusdam eum at. Tempore molestias quas tempora libero voluptatem, deserunt quod deleniti
              doloribus! Esse neque, ab fugit, eaque assumenda ad quaerat illum adipisci omnis, autem asperiores earum officia saepe dolorem.
              Asperiores, repudiandae iure. Voluptate facilis earum, reprehenderit sed rem hic, veniam vero expedita dolorum adipisci officia
              doloremque quod, dolor assumenda! Dignissimos ipsam, accusantium, eveniet totam quod praesentium facilis, quam quae necessitatibus
              labore inventore! Placeat maxime voluptate ea culpa. Adipisci corrupti culpa similique aspernatur, saepe quasi quas odit illum,
              excepturi fuga sunt pariatur cumque earum reprehenderit obcaecati, voluptates voluptatem quod porro ratione suscipit! Sequi. Ipsum,
              consequatur perspiciatis minus, aspernatur pariatur dolorem incidunt illum nulla blanditiis maiores natus ipsam vero magnam autem
              adipisci vel nesciunt nihil quasi veritatis voluptates accusantium qui? Voluptatem sed minus tempore. Excepturi corrupti reiciendis
              explicabo voluptatibus quasi cum. Ratione ut eveniet nobis. Ea iure maxime praesentium similique voluptate, reiciendis fugiat doloribus,
              nobis ducimus numquam esse veritatis. Nisi repellendus doloremque quibusdam laborum. Voluptatum expedita corrupti ducimus nostrum
              suscipit magnam autem aspernatur repudiandae explicabo sit, officia deleniti amet nulla, iste modi similique quod facilis dicta,
              officiis natus consequatur libero. Aut ex a enim!
            </div>
          </Scrollbar>
        </section>
      )}
    </>
  );
};

export default Video;
