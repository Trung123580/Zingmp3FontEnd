import { useEffect, useState, useContext, memo } from 'react';
import { AuthProvider } from '~/AuthProvider';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { listTheme } from '~/utils/constant';
import { changeTheme } from '~/store/actions/dispatch';
import { Search, UserProfile } from '~/components';
import Tippy from '@tippyjs/react';
import Button from '~/utils/Button';
import { userDefault } from '~/asset';
import { IconTheme } from '~/asset/logo';
import classNames from 'classnames/bind';
import style from './Header.module.scss';
import EastIcon from '@mui/icons-material/East';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
const cx = classNames.bind(style);
const Header = () => {
  const [listHistory, setListHistory] = useState([]);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const { themeApp, handle, isAuth, user } = useContext(AuthProvider);
  const { onLoginApp, onSignOutApp } = handle;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // change history router app
  useEffect(() => {
    if (location.pathname === '/') setListHistory(['/']);
    setListHistory((prev) => [...new Set([...prev, location.pathname])]);
  }, [location.pathname]);
  const handleChangeTheme = (background, color, backgroundMusicBar) => {
    dispatch(changeTheme(background, color, backgroundMusicBar));
    setIsOpenSetting(false);
  };
  const handleShowMenuSetting = (e) => {
    e.stopPropagation();
    setIsOpenSetting(!isOpenSetting);
    setIsOpenLogin(false);
  };
  const handleShowLogin = (e) => {
    e.stopPropagation();
    setIsOpenLogin(!isOpenLogin);
    setIsOpenSetting(false);
  };
  const handleClickOutside = (event) => {
    setIsOpenSetting(false);
    setIsOpenLogin(false);
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header id={cx('header')}>
      <div className={cx('container')}>
        <div className={cx('main')}>
          <div className={cx('level-left')}>
            <div className={cx('navigate')}>
              <Button
                className='prev-next'
                content={<EastIcon fontSize='large' />}
                onClick={() => {
                  navigate(-1);
                  setListHistory((prev) => prev.filter((history) => history !== location.pathname));
                }}
                disabled={listHistory.length === 1}
                style={{ transform: 'rotate(180deg)' }}
              />
              <Button content={<EastIcon fontSize='large' />} onClick={() => navigate(+1)} />
            </div>
            <Search themeApp={themeApp} />
          </div>
          <div className={cx('level-right')}>
            <a
              href='https://github.com/zmp3-pc/zmp3-pc/releases/download/v1.1.3/Zing-MP3-Setup-1.1.3.exe'
              target='_parent'
              className={cx('download-app')}
              style={{ color: themeApp && themeApp.primaryColor }}>
              <BrowserUpdatedIcon fontSize='large' />
              Tải bản Windows
            </a>
            <div className={cx('setting')}>
              <Tippy content={<span className='tippy-title'>Cài đặt</span>} followCursor='horizontal' placement='bottom' arrow={true} duration={300}>
                <div className={cx('icon-setting')} onClick={handleShowMenuSetting}>
                  <SettingsOutlinedIcon fontSize='large' />
                </div>
              </Tippy>
              {isOpenSetting && (
                <ul className={cx('list')}>
                  <li className={cx('item')}>
                    <span>
                      <IconTheme />
                      Giao Diện
                    </span>
                    <ArrowForwardIosOutlinedIcon />
                    <ul className={cx('list-theme')}>
                      {listTheme.map(({ backgroundImage, color, id, name, backgroundMusicBar }) => (
                        <li key={id} onClick={() => handleChangeTheme(backgroundImage, color, backgroundMusicBar)}>
                          <div className={cx('image')}>
                            <img src={backgroundImage} alt='background-error' />
                          </div>
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className={cx('item')}>
                    <span>
                      <InfoOutlinedIcon />
                      Giới Thiệu
                    </span>
                    <ArrowForwardIosOutlinedIcon />
                  </li>
                </ul>
              )}
            </div>
            <div className={cx('user')}>
              <div
                className={cx('user-avatar')}
                onClick={(e) => {
                  if (!isAuth) {
                    onLoginApp();
                    return;
                  }
                  handleShowLogin(e);
                }}>
                <img src={(!!isAuth && user?.photoURL) || userDefault} alt='error' />
              </div>
              {isOpenLogin && isAuth && (
                <div className={cx('user-profile')}>
                  <UserProfile
                    user={user}
                    onSignOutApp={() => {
                      onSignOutApp();
                      setIsOpenLogin(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
