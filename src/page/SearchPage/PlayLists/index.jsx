import { useContext } from 'react';
import { SearchProvider } from '../ContextSearch';
import { CardAlbum } from '~/components';
import TitlePath from '~/utils/TitlePath';
import { modalSongErr } from '~/asset';
import classNames from 'classnames/bind';
import style from './PlayLists.module.scss';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { AuthProvider } from '~/AuthProvider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
const Playlist = () => {
  const { stateSearch } = useContext(SearchProvider);
  const { currentUser } = useSelector((state) => state.auth);
  const { isPlay } = useSelector((state) => state.app);
  const { themeApp, handle, activeIdAlbum } = useContext(AuthProvider);
  const { onAddPlayList, onRemovePlayList, onPlayMusicInPlaylist } = handle;
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
    <div className={cx('playlist')}>
      <TitlePath content={'Playlist/Album'} />
      <div className={cx('list')}>
        {(searchData?.playlists || []).map((playlist) => (
          <CardAlbum
            key={playlist?.encodeId}
            data={playlist}
            onNavigatePlayList={() => handleNavigate(playlist.link.split('.')[0])}
            onNavigateArtist={handleNavigate}
            onAddPlayList={(e) => onAddPlayList(e, playlist)}
            onRemovePlayList={(e) => onRemovePlayList(e, playlist.encodeId)}
            currentUser={currentUser}
            themeApp={themeApp}
            isPlay={isPlay}
            onPlayMusicInPlaylist={onPlayMusicInPlaylist}
            activeIdAlbum={activeIdAlbum}
            noTitle={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Playlist;
