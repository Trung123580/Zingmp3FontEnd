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
import path from '~/router/path';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const expirationDate = new Date();
const cx = classNames.bind(style);
const Header = () => {
  const [listHistory, setListHistory] = useState([]);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSetting, setIsOpenSetting] = useState(false);
  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState(() => {
    return cookies.get('list_Search') ?? [];
  });
  const [isSuggest, setIsSuggest] = useState(false);
  const { themeApp, handle, isAuth, user } = useContext(AuthProvider);
  const { onLoginApp, onSignOutApp } = handle;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleFormatText = (text) => {
    const regex = /[!@#$%^&*(),.?":{}|<>']/g;
    return text.replace(regex, '');
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    navigate(path.SEARCH + path.SEARCH_ALL.replace('/:keyWord', `/${handleFormatText(search)}`));
    const historySearch = cookies.get('list_Search') || [];
    const isResult = historySearch.includes(search);
    if (isResult) {
      cookies.set('list_Search', historySearch);
    } else {
      const currentMonth = expirationDate.getMonth();
      expirationDate.setMonth(currentMonth + 1);
      if (expirationDate.getMonth() === currentMonth) {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }
      historySearch.push(search);
      cookies.set('list_Search', historySearch, {
        expires: currentMonth,
      });
      setSearchList(historySearch);
    }
    if (isSuggest) setIsSuggest(false);
  };
  const optionSearch = {
    search: search,
    isSuggest: isSuggest,
    searchList: searchList,
    onDeleteSearch: (e, value) => {
      e.preventDefault();
      const historySearch = cookies.get('list_Search') || [];
      const newData = historySearch.filter((item) => item !== value);
      cookies.set('list_Search', newData);
      setSearchList(newData);
      // return newData;
    },
    onSearch: (e, value) => {
      e.preventDefault();
      setSearch(value);
      handleSubmit(e);
    },
    onKeySearch: (keyWord) => {
      setSearch(keyWord);
    },
    onRefresh: () => {
      if (search) setSearch('');
    },
    onFocusSuggest: () => setIsSuggest(true),
    onSubmitSearch: handleSubmit,
  };

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
  const handleClickOutside = () => {
    if (isOpenSetting || isOpenLogin) {
      setIsOpenSetting(false);
      setIsOpenLogin(false);
    }
    setIsSuggest(false);
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    //eslint-disable-next-line
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
            <Search themeApp={themeApp} {...optionSearch} />
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
                    <div className={cx('wrapper-icon')}>
                      <span>
                        <IconTheme />
                        Giao Diện
                      </span>
                      <ArrowForwardIosOutlinedIcon />
                    </div>
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
                    <div className={cx('wrapper-icon')}>
                      <span>
                        <InfoOutlinedIcon />
                        Giới Thiệu
                      </span>
                      <ArrowForwardIosOutlinedIcon />
                    </div>
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
