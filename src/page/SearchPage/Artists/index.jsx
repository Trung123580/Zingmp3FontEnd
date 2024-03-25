import classNames from 'classnames/bind';
import style from './Artists.module.scss';
import TitlePath from '~/utils/TitlePath';
import { useContext } from 'react';
import { SearchProvider } from '../ContextSearch';
import { CardArtists } from '~/components';
import { modalSongErr } from '~/asset';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { AuthProvider } from '~/AuthProvider';
import { useSelector } from 'react-redux';
import path from '~/router/path';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
const Artists = () => {
  const { stateSearch } = useContext(SearchProvider);
  const { currentUser } = useSelector((state) => state.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onRemoveArtist, onAddArtist } = handle;
  const { isLoading, isError, searchData } = stateSearch;
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  if (isError) {
    return (
      <div className={cx('error')}>
        <img src={modalSongErr} alt='' />
        <h3>Lỗi tải trang</h3>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={4} height={200} />
      </div>
    );
  }
  return (
    <div className={cx('artist')}>
      <TitlePath content={'Nghệ sĩ/OA'} style={{ marginTop: '0' }} />
      <div className={cx('list')}>
        {(searchData?.artists || []).map((artist) => (
          <CardArtists
            data={artist}
            key={artist?.id}
            themeApp={themeApp}
            onToggleArtist={(e) => {
              currentUser?.followArtist.some((item) => item.id === artist.id) ? onRemoveArtist(e, artist.id) : onAddArtist(e, artist);
            }}
            isFollowArtist={currentUser?.followArtist.some((item) => item.id === artist.id)}
            onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', artist.link))}
          />
        ))}
      </div>
    </div>
  );
};

export default Artists;
