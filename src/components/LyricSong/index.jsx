import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { v4 as uuid } from 'uuid';
import style from './LyricSong.module.scss';
import { AuthProvider } from '~/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import { getSong, hiddenLyric } from '~/store/actions/dispatch';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { apiLyricSong } from '~/api';
import { Scrollbar } from 'react-scrollbars-custom';
import { Pagination, EffectCoverflow, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useTheme } from '@mui/material/styles';
import { fontsLyric } from '~/utils/constant';
import { loading } from '~/asset';
import { sample as _sample } from 'lodash';
import Button from '~/utils/Button';
import LyricSongHeaderRight from './LyricSongHeaderRight';
const cx = classNames.bind(style);
const LyricSong = () => {
  const { handle, themeApp } = useContext(AuthProvider);
  const { currentSong, currentPlayList } = useSelector((store) => store.app);
  const { currentTimeSongLyric, isHidden } = useSelector((store) => store.lyric);
  const { onToggleLyricSong } = handle;
  const [swiperRef, setSwiperRef] = useState(null);
  const indexSong = useMemo(() => {
    if (!currentPlayList?.listItem.length) return;
    const playList = currentPlayList?.listItem || [];
    return playList?.findIndex((item) => item?.encodeId === currentSong?.encodeId) || 0;
    // eslint-disable-next-line
  }, [currentSong?.encodeId]);
  const [stateLyric, setStateLyric] = useState({
    isLoadingLyric: false, // dung cho ne xt lyricSong
    dataLyric: null,
    activeFont: () => fontsLyric[0].id,
    isShowSetting: false,
    isChangeFullScreen: false,
    isOpenDrawer: false,
    isContentPage: true,
    isRandomBackGround: false,
    imgRandomBackGround: '',
    currentSlide: indexSong,
    isNextSlide: false,
    prefixIndexLyric: null,
  });
  const itemLyricRef = useRef(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const refScroll = useRef(null);
  const hideMouseRef = useRef(null);
  const timeoutRef = useRef(null);
  const findLyricSong = useMemo(() => {
    const string = String(currentTimeSongLyric);
    const index = string.split('').indexOf('.');
    const prefix = string.substring(0, index);
    const suffixes = string.substring(index + 1, index + 4);
    const result = Number(prefix + suffixes);
    return stateLyric.dataLyric?.sentences?.findIndex((lyric) => lyric.words.some((item) => result >= item.startTime && result <= item.endTime));
  }, [currentTimeSongLyric, stateLyric.dataLyric]);

  useEffect(() => {
    if (findLyricSong !== -1) {
      itemLyricRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      setStateLyric((prev) => ({ ...prev, prefixIndexLyric: findLyricSong }));
    }
  }, [findLyricSong, itemLyricRef]);
  useEffect(() => {
    (async () => {
      try {
        setStateLyric((prev) => ({ ...prev, isLoadingLyric: false }));
        const response = await apiLyricSong(currentSong.encodeId);
        if (response.data?.err === 0) {
          setStateLyric((prev) => ({ ...prev, dataLyric: response.data.data, prefixIndexLyric: null, isLoadingLyric: true }));
        }
      } catch (error) {
        console.error(error);
      }
    })();
    // eslint-disable-next-line
  }, [currentSong.encodeId]);
  useEffect(() => {
    if (swiperRef) {
      swiperRef?.slideTo(indexSong);
    }
    // eslint-disable-next-line
  }, [swiperRef, currentSong?.encodeId]);
  useEffect(() => {
    const handleClickOutside = () => {
      setStateLyric((prev) => ({ ...prev, isShowSetting: false }));
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      dispatch(hiddenLyric(false));
      if (hideMouseRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          if (hideMouseRef.current) {
            dispatch(hiddenLyric(true));
          }
        }, 5000);
      }
    };
    let mouseRef = hideMouseRef.current;
    if (mouseRef) {
      mouseRef.addEventListener('mousemove', handleMouseMove);
      return () => {
        if (mouseRef) mouseRef.removeEventListener('mousemove', handleMouseMove);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideMouseRef]);
  const handleActiveFonts = (idFont) => setStateLyric((prev) => ({ ...prev, activeFont: () => idFont }));
  const handleToggleSetting = (e) => {
    e.stopPropagation();
    setStateLyric((prev) => ({ ...prev, isShowSetting: !prev.isShowSetting }));
  };
  const handleOnChangeFullScreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setStateLyric((prev) => ({ ...prev, isChangeFullScreen: true }));
      return;
    }
    await document.exitFullscreen();
    setStateLyric((prev) => ({ ...prev, isChangeFullScreen: false }));
  };
  const handleChangeFontStyle = () => {
    let font = '';
    const indexLyric = fontsLyric.findIndex(({ id }) => id === stateLyric.activeFont());
    indexLyric === 0 ? (font = '30px') : indexLyric === 1 ? (font = '42px') : (font = '46px');
    return font;
  };
  const handleToggleDrawer = (isboolean) => setStateLyric((prev) => ({ ...prev, isOpenDrawer: isboolean }));
  const handleToggleContent = () => setStateLyric((prev) => ({ ...prev, isContentPage: !prev.isContentPage }));
  const handleSlideChange = (e) => setStateLyric((prev) => ({ ...prev, currentSlide: e?.activeIndex }));
  const handleDragEndSlide = () => setStateLyric((prev) => ({ ...prev, isNextSlide: true }));
  // const handleDragStartSlide = () => setStateLyric((prev) => ({ ...prev, isNextSlide: false }));
  // next prev
  const handleNextSlideEndPrev = () => setStateLyric((prev) => ({ ...prev, isNextSlide: true }));

  useEffect(() => {
    if (!stateLyric.isNextSlide) return;
    let timeNextSlide;
    timeNextSlide = setTimeout(() => {
      dispatch(getSong(currentPlayList.listItem[stateLyric.currentSlide]));
      setStateLyric((prev) => ({ ...prev, isNextSlide: false }));
    }, 1000);
    return () => {
      timeNextSlide && clearTimeout(timeNextSlide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateLyric.isNextSlide]);
  const handleToggleBackGround = () => setStateLyric((prev) => ({ ...prev, isRandomBackGround: !prev.isRandomBackGround }));
  useEffect(() => {
    if (!stateLyric.isRandomBackGround) return;
    setStateLyric((prev) => ({
      ...prev,
      imgRandomBackGround: _sample(stateLyric.dataLyric?.defaultIBGUrls || []),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateLyric.isRandomBackGround]);
  // console.log(currentPlayList?.listItem);
  // console.log(stateLyric.currentSlide);
  useEffect(() => {
    const handleChangeScreen = () => {
      if (stateLyric.isChangeFullScreen && !document.fullscreenElement) setStateLyric((prev) => ({ ...prev, isChangeFullScreen: false }));
    };
    document.addEventListener('fullscreenchange', handleChangeScreen);
    return () => {
      document.removeEventListener('fullscreenchange', handleChangeScreen);
    };
  }, [stateLyric.isChangeFullScreen]);
  const optionRight = {
    theme: theme,
    onToggleSetting: handleToggleSetting,
    onToggleLyricSong: onToggleLyricSong,
    themeApp: themeApp,
    onActiveFonts: handleActiveFonts,
    stateLyric: stateLyric,
    onChangeFullScreen: handleOnChangeFullScreen,
    onToggleBackGround: handleToggleBackGround,
    isHidden: isHidden,
  };
  // console.log(stateLyric.dataLyric);
  // console.log(itemLyricRef.current?.getBoundingClientRect().y);
  return (
    <section className={cx('lyric')}>
      <section
        className={cx('wrapper__lyric')}
        ref={hideMouseRef}
        style={{
          background: stateLyric.isRandomBackGround && !!stateLyric.imgRandomBackGround ? `url('${stateLyric.imgRandomBackGround}')` : '#2d2f32',
        }}>
        <div className={cx('header')}>
          <div className={cx('header__left')}>
            <div className={cx('header__logo')}></div>
          </div>
          <div
            className={cx('header__middle', {
              hidden: isHidden,
            })}>
            <ul className={cx('header__menu')}>
              <li
                className={cx('header__menu-item', {
                  active: !stateLyric.isContentPage,
                })}
                onClick={handleToggleContent}>
                Danh sách phát
              </li>
              <li
                className={cx('header__menu-item', {
                  active: stateLyric.isContentPage,
                })}
                onClick={handleToggleContent}>
                Lời bài hát
              </li>
            </ul>
          </div>
          <LyricSongHeaderRight {...optionRight} className={'hidden__mobile'} />
          <div
            className={cx('icon__menu', {
              hidden: isHidden,
            })}>
            <Button onClick={() => handleToggleDrawer(true)} icon={<MenuRoundedIcon fontSize='large' sx={{ fontSize: '3rem' }} />} />
            <SwipeableDrawer
              anchor={'right'}
              open={stateLyric.isOpenDrawer}
              onClose={() => handleToggleDrawer(false)}
              onOpen={() => handleToggleDrawer(true)}>
              <div className={cx('header__right-drawer')} onClick={() => setStateLyric((prev) => ({ ...prev, isOpenDrawer: false }))}>
                <LyricSongHeaderRight {...optionRight} className={'drawer'} />
              </div>
            </SwipeableDrawer>
          </div>
        </div>
        <div className={cx('content')}>
          {stateLyric.isContentPage ? (
            <>
              {stateLyric.isLoadingLyric ? (
                <div className={cx('content__lyricSong')}>
                  <div className={cx('content__image')}>
                    <img src={currentSong?.thumbnailM} alt='' />
                  </div>
                  <div className={cx('content__text')}>
                    <Scrollbar
                      ref={refScroll}
                      // scrollTop={itemLyricRef.current?.getBoundingClientRect().top} // dung de cuon den vi tri loi bai hat
                      wrapperProps={{
                        renderer: (props) => {
                          const { elementRef, ...restProps } = props;
                          return <span {...restProps} ref={elementRef} style={{ inset: '0 0 10px 0' }} />;
                        },
                      }}
                      trackYProps={{
                        renderer: (props) => {
                          const { elementRef, ...restProps } = props;
                          return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '3px' }} />;
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
                      <ul
                        className={cx('content__menu-lyric')}
                        style={{
                          fontSize: handleChangeFontStyle(),
                        }}>
                        {stateLyric.dataLyric?.sentences.map((item, index) => {
                          return (
                            <li
                              key={uuid()}
                              ref={findLyricSong === index ? itemLyricRef : null}
                              className={cx('content__item-lyric')}
                              style={{
                                color: (findLyricSong === index || stateLyric.prefixIndexLyric === index) && themeApp?.primaryColor,
                              }}>
                              {item.words.map(({ data }) => data).join(' ')}
                            </li>
                          );
                        })}
                      </ul>
                    </Scrollbar>
                  </div>
                </div>
              ) : (
                <div className={cx('loading__lyric')}>
                  <img src={loading} alt='' style={{ width: '100px', height: ' 100px' }} />
                </div>
              )}
            </>
          ) : (
            <div className={cx('list__wrapper')}>
              <Swiper
                effect={'coverflow'}
                onSwiper={setSwiperRef}
                grabCursor={true}
                // onTouchStart={handleDragStartSlide}
                onTouchEnd={handleDragEndSlide}
                onNavigationNext={handleNextSlideEndPrev}
                onNavigationPrev={handleNextSlideEndPrev}
                centeredSlides={true}
                slidesPerView={'auto'}
                // pagination={true}
                navigation={true}
                onSlideChange={(e) => handleSlideChange(e)}
                modules={[EffectCoverflow, Pagination, Navigation]}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                className='mySwiper'>
                {currentPlayList?.listItem.map((item, index) => (
                  <SwiperSlide
                    key={item.encodeId}
                    className={cx('slide__lyric-song', {
                      activeSlide: stateLyric.currentSlide === index,
                    })}>
                    <img src={item.thumbnailM} alt='' className={cx('slide__img')} />
                    <div className={cx('item__banner')}>
                      <h3 className={cx('title')}>{item?.title}</h3>
                      <h3 className={cx('subtitle')}>{item?.artistsNames}</h3>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          <div
            className={cx('bottom__info', {
              hidden: isHidden,
            })}>
            <h3 className={cx('bottom__info-title')}>
              {currentSong?.title} -<span> {currentSong?.artistsNames}</span>
            </h3>
          </div>
        </div>
      </section>
    </section>
  );
};

export default LyricSong;
