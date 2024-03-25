import { useContext } from 'react';
import { SearchProvider } from '../ContextSearch';
import { CardAlbumSong } from '~/components';
import TitlePath from '~/utils/TitlePath';
import { modalSongErr } from '~/asset';
import classNames from 'classnames/bind';
import style from './Songs.module.scss';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { AuthProvider } from '~/AuthProvider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import path from '~/router/path';
const cx = classNames.bind(style);
const Songs = () => {
  const { stateSearch } = useContext(SearchProvider);
  const { currentUser } = useSelector((state) => state.auth);
  const { currentSong, isPlay } = useSelector((state) => state.app);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onPlaySong, onActiveSong, onAddLikeSong, onRemoveLikeSong } = handle;
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
  const handleNavigateVideo = (url, name) => {
    const pathLink = path.DETAILS_ARTIST.replace(':name', name) + path.OPEN_VIDEO;
    handleNavigate(pathLink.replace('/video-clip/:titleVideo/:videoId', url.split('.')[0]));
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
    <div className={cx('songs')}>
      <TitlePath content={'Bài hát'} style={{ marginTop: '0' }} />
      <div>
        {(searchData?.songs || []).map((song, _index, arr) => (
          <CardAlbumSong
            key={song?.encodeId}
            song={song}
            hiddenIconMusic={true}
            currentSong={currentSong}
            currentUser={currentUser}
            isPlay={isPlay}
            onActiveSong={(e) => onActiveSong(e, song)}
            onNavigateArtist={handleNavigate}
            onNavigate={() => handleNavigate(song.album.link.split('.')[0])}
            theme={themeApp}
            onAddLikeSong={(e) => onAddLikeSong(e, song)}
            onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
            onPlaySong={() => onPlaySong(song, arr, '#zingchart')}
            onNavigateVideo={() => handleNavigateVideo(song?.mvlink)}
          />
        ))}
      </div>
    </div>
  );
};

export default Songs;
