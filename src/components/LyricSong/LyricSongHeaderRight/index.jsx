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
  isHidden,
}) => {
  const handleMountIcon = () => {
    if (className === 'drawer') {
      return stateLyric.isShowSetting ? <KeyboardArrowDownRoundedIcon style={{ rotate: '180deg' }} /> : <KeyboardArrowDownRoundedIcon />;
    } else {
      return null;
    }
  };
  return (
    <div
      className={cx('header__right', {
        [className]: className,
      })}>
      <div
        className={cx('wrapper__right', {
          hidden: isHidden,
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
              <span className={cx('text__drawer')}>{className === 'drawer' && 'Thoát toàn màn hình'}</span>
            </span>
          ) : (
            <span className={cx('zm-btn')} onClick={onChangeFullScreen}>
              <AiOutlineFullscreen />
              <span className={cx('text__drawer')}>{className === 'drawer' && 'Toàn màn hình'}</span>
            </span>
          )}
        </Tippy>
        <div
          className={cx('zm-btn', {
            'flex-direction': true,
          })}
          style={{ padding: '0' }}
          onClick={onToggleSetting}>
          <Tippy content={<span className='tippy-title'>Cài đặt</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
            <span className={cx('zm-btn')}>
              <SettingsOutlinedIcon sx={{ backgroundColor: 'transparent' }} />
              <span className={cx('text__drawer')}>
                {className === 'drawer' && `Cài đặt`}
                {handleMountIcon()}
              </span>
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
              <span className={cx('text__drawer')}>{className === 'drawer' && 'Đóng '}</span>
            </span>
          </Tippy>
        )}
      </div>
    </div>
  );
};

export default LyricSongHeaderRight;
