import classNames from 'classnames/bind';
import style from './LyricSongHeaderRight.module.scss';
import Tippy from '@tippyjs/react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Switch } from '~/components';
import { fontsLyric } from '~/utils/constant';
const cx = classNames.bind(style);
const LyricSongHeaderRight = ({
  onToggleBackGround,
  className,
  stateLyric,
  theme,
  themeApp,
  onToggleLyricSong,
  onChangeFullScreen,
  onToggleSetting,
  onActiveFonts,
}) => {
  return (
    <div
      className={cx('header__right', {
        [className]: className,
      })}>
      <Tippy
        content={<span className='tippy-title'>{stateLyric.isChangeFullScreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}</span>}
        followCursor='horizontal'
        placement='top'
        arrow={true}
        duration={300}>
        {stateLyric.isChangeFullScreen ? (
          <span className={cx('zm-btn')} onClick={onChangeFullScreen}>
            <AiOutlineFullscreenExit />
          </span>
        ) : (
          <span className={cx('zm-btn')} onClick={onChangeFullScreen}>
            <AiOutlineFullscreen />
          </span>
        )}
      </Tippy>
      <div className={cx('zm-btn')} style={{ padding: '0' }} onClick={onToggleSetting}>
        <Tippy content={<span className='tippy-title'>Cài đặt</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
          <span className={cx('zm-btn')}>
            <SettingsOutlinedIcon />
          </span>
        </Tippy>
        {stateLyric.isShowSetting && (
          <div className={cx('setting')} onClick={(e) => e.stopPropagation()}>
            <ul className={cx('menu__settings')}>
              <li className={cx('setting__item')}>
                <span>Hình nền</span>
                <Switch theme={theme} themeApp={themeApp} checked={stateLyric.isRandomBackGround} onChange={onToggleBackGround} />
              </li>
              <li className={cx('setting__item')}>
                <span>Cỡ chữ lời nhạc</span>
                <ul className={cx('fonts')}>
                  {fontsLyric.map(({ id, fontSize, text }) => (
                    <li
                      key={id}
                      className={cx('font__item', {
                        active: stateLyric.activeFont() === id,
                      })}
                      style={{ fontSize: fontSize, background: stateLyric.activeFont() === id && themeApp.primaryColor }}
                      onClick={(e) => onActiveFonts(id)}>
                      {text}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>
      {!stateLyric.isChangeFullScreen && (
        <Tippy content={<span className='tippy-title'>Đóng</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
          <span className={cx('zm-btn')} onClick={onToggleLyricSong}>
            <KeyboardArrowDownRoundedIcon />
          </span>
        </Tippy>
      )}
    </div>
  );
};

export default LyricSongHeaderRight;
