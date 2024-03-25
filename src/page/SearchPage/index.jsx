import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './SearchPage.module.scss';
import { router } from '~/router';
import path from '~/router/path';
import { ContextSearch } from './ContextSearch';
const cx = classNames.bind(style);
const SearchPage = () => {
  const { pathname } = useLocation();
  const { keyWord } = useParams();
  const [navLink] = useState(router.find((item) => item.path === path.SEARCH));
  const pathLink = useMemo(() => {
    return pathname.split('/').filter((item) => item !== '')[1];
  }, [pathname]);
  return (
    <section className={cx('container')}>
      <div className={cx('search')}>
        <nav className={cx('header')}>
          <h2 className={cx('title')}>Kết Quả Tìm Kiếm</h2>
          {navLink.insideRoute.map(({ content, id, path }) => (
            <h3
              className={cx('text', {
                active: path.includes(pathLink),
              })}
              key={id}>
              <Link style={{ display: 'inline-block' }} to={path.replace('/:keyWord', `/${keyWord}`)}>
                {content}
              </Link>
            </h3>
          ))}
        </nav>
        <ContextSearch>
          <Outlet />
        </ContextSearch>
      </div>
    </section>
  );
};

export default SearchPage;
