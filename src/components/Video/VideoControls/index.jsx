import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import { IoPlay, IoPause } from 'react-icons/io5';
import Slider from '@mui/material/Slider';
import { LuVolume2, LuVolumeX, LuVolume1 } from 'react-icons/lu';
import classNames from 'classnames/bind';
import style from '../Video.module.scss';
import ControlsRight from './ControlsRight';
const cx = classNames.bind(style);
const VideoControls = (props) => {
  const {
    isPlay,
    currentSeconds,
    maxDuration,
    onChangeCommitted,
    onChange,
    slots,
    onTogglePlayVideo,
    secondsLoaded,
    volume,
    onChangeVolume,
    themeApp,
    theme,
    changeCurrentTime,
    setChangeVolume,
    onNextVideo,
    onPrevVideo,
    //onChangeAutoPlay, => dùng ở controlsRight
    //isOpenQuality, => dùng ở controlsRight
    //isOpenSetting, => dùng ở controlsRight
    //onOpenQuality, => dùng ở controlsRight
    //isAutoPlay, => dùng ở controlsRight
    //quality, => dùng ở controlsRight
  } = props;
  return (
    <div
      className={cx('video-progress', {
        paused: !isPlay,
      })}
      onClick={(e) => e.stopPropagation()}>
      <div>
        <Slider
          className={cx('progress-bar')}
          aria-label='time-indicator'
          size='small'
          value={currentSeconds}
          min={0}
          step={1}
          max={maxDuration}
          onChange={onChange}
          onChangeCommitted={onChangeCommitted}
          slots={{
            valueLabel: slots,
          }}
          sx={{
            // color: '#fff',
            color: themeApp?.primaryColor,
            height: 4,
            '&:hover': {
              height: 5.5,
            },
            '& .MuiSlider-thumb': {
              width: 4,
              height: 4,
              display: 'none',
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&::before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 4px rgb(0 0 0 / 16%)`,
              },
              '&.Mui-active': {
                width: 10,
                height: 10,
              },
            },
            '& .MuiSlider-rail': {
              // opacity: 0.28,
              opacity: 1,
              background: '#626262',
              '&::after': {
                content: '""',
                top: 0,
                left: 0,
                background: 'rgb(184, 184, 184)',
                width: `${secondsLoaded}%`,
                height: '100%',
                position: 'absolute',
                zIndex: '-1', // Để đặt lớp ::after phía dưới slider
              },
            },
          }}
        />
      </div>
      <div className={cx('controls-video')}>
        <div className={cx('controls-left')}>
          <span className={cx('icon')} onClick={onPrevVideo}>
            <SkipPreviousRoundedIcon />
          </span>
          <span
            className={cx('icon', {
              sizeLg: true,
            })}
            onClick={onTogglePlayVideo}>
            {isPlay ? <IoPause /> : <IoPlay />}
          </span>
          <span className={cx('icon')} onClick={onNextVideo}>
            <SkipNextRoundedIcon />
          </span>
          <span
            className={cx('icon', {
              volume: true,
            })}
            style={{ marginLeft: '10px', padding: '5px' }}>
            {volume >= 60 ? (
              <LuVolume2 onClick={() => setChangeVolume(0)} />
            ) : volume > 0 && volume < 60 ? (
              <LuVolume1 onClick={() => setChangeVolume(0)} />
            ) : volume === 0 ? (
              <LuVolumeX onClick={() => setChangeVolume(100)} />
            ) : null}
            <Slider
              className={cx('slider-volume')}
              aria-label='Volume'
              value={volume}
              onChange={onChangeVolume}
              sx={{
                mx: '10px',
                height: 3,
                color: themeApp?.primaryColor,
                '&:hover': {
                  height: 4,
                },
                '& .MuiSlider-thumb': {
                  width: 13,
                  height: 13,
                  '&::before': {
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 4px ${theme?.palette.mode === 'dark' ? 'rgb(255 255 255 / 16%)' : 'rgb(0 0 0 / 16%)'}`,
                  },
                },
              }}
            />
          </span>
          <div className={cx('current-time')}>
            <span>{slots || '00:00'}</span>
            <span>|</span>
            <span>{changeCurrentTime || '00:00'}</span>
          </div>
        </div>
        <ControlsRight {...props} />
      </div>
    </div>
  );
};

export default VideoControls;
