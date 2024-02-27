import { memo } from 'react';
import Tippy from '@tippyjs/react';
import { v4 as uuid } from 'uuid';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CropFreeRoundedIcon from '@mui/icons-material/CropFreeRounded';
import FullscreenExitRoundedIcon from '@mui/icons-material/FullscreenExitRounded';
import { IoRepeatOutline } from 'react-icons/io5';
import { LuRectangleHorizontal } from 'react-icons/lu';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import classnames from 'classnames/bind';
import style from '../../Video.module.scss';
const cx = classnames.bind(style);
const ControlsRight = (pops) => {
  const {
    themeApp,
    isAutoPlay,
    isOpenQuality,
    isOpenSetting,
    quality,
    onChangeAutoPlay,
    onOpenQuality,
    onChangeQuality,
    onChangeTheaterMode,
    onChangeFullScreen,
    menuQuality,
  } = pops;
  // const menuQuality = ['720p', '480p', '360p'];
  return (
    <div className={cx('controls-right')} onClick={(e) => e.stopPropagation()}>
      <Tippy content={<span className='tippy-title'>Lặp lại</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
        <div className={cx('icon')} onClick={() => onChangeAutoPlay()}>
          <IoRepeatOutline style={{ color: themeApp && !isAutoPlay && themeApp?.primaryColor }} />
        </div>
      </Tippy>
      <Tippy content={<span className='tippy-title'>Cài đặt</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
        <div
          className={cx('icon')}
          onClick={(e) => {
            onOpenQuality(true, false);
          }}>
          <SettingsOutlinedIcon />
        </div>
      </Tippy>
      <div
        className={cx('current-quality', {
          open: isOpenSetting && !isOpenQuality,
        })}
        onClick={(e) => {
          onOpenQuality(false, true);
        }}>
        <div>Chất lượng</div>
        <div>
          Auto {quality} <ArrowForwardIosRoundedIcon sx={{ fontSize: '1.7rem !important' }} />
        </div>
      </div>
      <div
        className={cx('wrapper-menu__hd', {
          open: isOpenQuality,
        })}>
        <div onClick={() => onOpenQuality(false, false, true)}>
          <ArrowForwardIosRoundedIcon sx={{ fontSize: '1.7rem !important', rotate: '180deg' }} />
          Chất lượng
        </div>
        <ul className={cx('menu-hd')}>
          {menuQuality().map((item) => (
            <li className={cx('item-hd')} key={uuid()} onClick={() => onChangeQuality(item)}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Tippy content={<span className='tippy-title'>Chế đọ rạp chiếu</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
        <div className={cx('icon')} onClick={onChangeTheaterMode}>
          <LuRectangleHorizontal />
        </div>
      </Tippy>
      <Tippy content={<span className='tippy-title'>Toàn màn hình</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
        <div className={cx('icon')} onClick={onChangeFullScreen}>
          {document.fullscreenElement == null ? <CropFreeRoundedIcon /> : <FullscreenExitRoundedIcon />}
        </div>
      </Tippy>
    </div>
  );
};

export default memo(ControlsRight);
