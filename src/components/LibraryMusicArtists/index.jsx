import classNames from 'classnames/bind';
import style from './LibraryMusicArtists.module.scss';
import { CardArtists } from '..';
import path from '~/router/path';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthProvider } from '~/AuthProvider';
const cx = classNames.bind(style);
const LibraryMusicArtists = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onRemoveArtist, onAddArtist } = handle;
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  return (
    <section className={cx('container')}>
      <div className={cx('page__artists')}>
        <nav className={cx('header')}>
          <h2 className={cx('title')}>Nghệ sĩ</h2>
          <h3 className={cx('text')} style={{ borderColor: themeApp && themeApp?.primaryColor }}>
            tất cả
          </h3>
        </nav>
        <div className={cx('content')}>
          <div className={cx('menu__artists')}>
            {currentUser?.followArtist.map((artist) => {
              return (
                <CardArtists
                  key={artist.id}
                  data={artist}
                  onToggleArtist={(e) => {
                    currentUser?.followArtist.some((item) => item.id === artist.id) ? onRemoveArtist(e, artist.id) : onAddArtist(e, artist);
                  }}
                  isFollowArtist={currentUser?.followArtist.some((item) => item.id === artist.id)}
                  themeApp={themeApp}
                  onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', artist.link))}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryMusicArtists;
