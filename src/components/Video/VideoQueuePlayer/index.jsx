import { memo } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Scrollbar as ScrollbarX } from 'swiper/modules';
import classNames from 'classnames/bind';
import style from './VideoQueuePlayer.module.scss';
import { v4 as uuid } from 'uuid';
// import { Switch } from '@mui/material';
import CardNext from '../CardNext';
import { Switch } from '~/components';
const cx = classNames.bind(style);
const VideoQueuePlayer = (props) => {
  const { isAutoPlay, onChangeAutoPlay, selectItem, theme, themeApp, dataVideo, theaterMode, onNavigate, onNavigateVideo } = props;
  return (
    <div
      className={cx('queue-player', {
        theaterMode: theaterMode,
      })}>
      <div className={cx('wrapper-queue')}>
        <div className={cx('queue-title')}>
          <h3>Danh Sách Phát</h3>
          <div className={cx('auto-play-switch')}>
            <span className={cx('auto-play-text')}>Tự động phát</span>
            <Switch checked={isAutoPlay} onChange={onChangeAutoPlay} theme={theme} themeApp={themeApp} />
          </div>
        </div>
        <div className={cx('scrollbar__menu')}>
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
            <div className={cx('menu')}>
              {dataVideo?.recommends.map((video) => (
                <CardNext
                  key={video.encodeId}
                  {...video}
                  selectItem={selectItem}
                  theaterMode={theaterMode}
                  onNavigate={onNavigate}
                  onNavigateVideo={onNavigateVideo}
                />
              ))}
            </div>
          </Scrollbar>
        </div>
        <div className={cx('scrollbar__menu-medium')}>
          <Swiper
            className={cx('slider')}
            autoplay={{
              delay: 3000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            spaceBetween={30}
            navigation={false}
            keyboard={true}
            rewind={true}
            noSwiping={true}
            modules={[Autoplay, Keyboard, ScrollbarX]}
            breakpoints={{
              360: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              993: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}>
            {/* { thumbnailM, sortDescription, encodeId, link, title } */}
            {dataVideo?.recommends.map((video) => (
              <SwiperSlide key={uuid()}>
                <CardNext {...video} selectItem={selectItem} theaterMode={theaterMode} onNavigate={onNavigate} onNavigateVideo={onNavigateVideo} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default memo(VideoQueuePlayer);
