import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import { menuNavigate, menuRanks, menuRouteUser } from '~/router';
import path from '~/router/path';
import { SidebarSkeleton } from '~/BaseSkeleton';
import { AuthProvider } from '~/AuthProvider';
import classNames from 'classnames/bind';
import style from './Sidebar.module.scss';
import Button from '~/utils/Button';
import Divide from '~/utils/Divide';
const cx = classNames.bind(style);
const Sidebar = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const { theme } = useSelector((state) => state.auth);
  const { isAuth, handle } = useContext(AuthProvider);
  const { onLoginApp } = handle;
  useEffect(() => {
    const timeLoading = setTimeout(() => {
      setIsLoading(true);
    }, 2000);
    return () => {
      clearTimeout(timeLoading);
    };
  }, []);
  return (
    <aside id={cx('sidebar')}>
      <div className={cx('wrapper')} onClick={() => navigate(path.HOME)}>
        <div id={cx('logo')}></div>
      </div>
      <nav className={cx('nav-bar')}>
        <ul className={cx('menu-navigate')}>
          {menuNavigate.map(({ path, content, icon: Icon, id }) => {
            return (
              <li
                key={id}
                className={cx('menu-item', {
                  active: path === pathname,
                })}
                style={{ borderColor: path === pathname ? theme?.primaryColor || '#9b4de0' : 'transparent' }}>
                <Link
                  to={path}
                  className={cx({
                    active: path === pathname,
                  })}>
                  {isLoading ? (
                    <>
                      <Icon />
                      <span className={cx('item-text')}>{content}</span>
                    </>
                  ) : (
                    <SidebarSkeleton />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Divide />
      <div className={cx('scroll-profile')}>
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
          <nav className={cx('nav-bar')}>
            <ul className={cx('menu-profile')}>
              {menuRanks.map(({ path, content, id, icon: Icon }) => {
                return (
                  <li
                    key={id}
                    className={cx('menu-item', {
                      active: path === pathname,
                    })}
                    style={{ borderColor: path === pathname ? theme?.primaryColor || '#9b4de0' : 'transparent' }}>
                    <Link
                      to={path}
                      className={cx({
                        active: path === pathname,
                      })}>
                      {isLoading ? (
                        <>
                          <Icon />
                          <span className={cx('item-text')}>{content}</span>
                        </>
                      ) : (
                        <SidebarSkeleton />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {!!isAuth ? (
            <>
              <nav className={cx('nav-bar')}>
                <ul className={cx('menu-profile')}>
                  {menuRouteUser.insideRoute.map(({ id, path, icon: Icon, content }) => {
                    return (
                      <li
                        key={id}
                        className={cx('menu-item', {
                          active: path === pathname,
                        })}
                        style={{ borderColor: path === pathname ? theme?.primaryColor || '#9b4de0' : 'transparent' }}>
                        <Link
                          to={path}
                          className={cx({
                            active: path === pathname,
                          })}>
                          {isLoading ? (
                            <>
                              <Icon />
                              <span className={cx('item-text')}>{content}</span>
                            </>
                          ) : (
                            <SidebarSkeleton />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <Divide />
              <div className={cx('menu-item')}>playlist</div>
            </>
          ) : (
            <div className={cx('notification-login')}>
              <p className={cx('description')}>Đăng nhập để khám phá playlist dành riêng cho bạn</p>
              <Button content='ĐĂNG NHẬP' onClick={onLoginApp} className='login' />
            </div>
          )}
        </Scrollbar>
      </div>
    </aside>
  );
};

export default Sidebar;
