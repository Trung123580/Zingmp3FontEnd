import { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import style from './HistorySong.module.scss';
import { listNavHistorySong } from '~/utils/constant';
import { AuthProvider } from '~/AuthProvider';
import { useSelector } from 'react-redux';
import { CardAlbum, CardAlbumSong, CardVideo } from '..';
import { useNavigate } from 'react-router-dom';
import path from '~/router/path';
const cx = classNames.bind(style);
const HistorySong = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { currentSong, isPlay } = useSelector((state) => state.app);
  const { themeApp, handle, activeIdAlbum } = useContext(AuthProvider);
  const {
    onPlaySong,
    onRemovePlayList,
    onAddPlayList,
    onPlayMusicInPlaylist,
    onActiveSong,
    onAddLikeSong,
    onRemoveLikeSong,
    onOpenModal,
    onRemoveHistoryMv,
  } = handle;
  const [stateHistorySong, setStateHistory] = useState({
    page: 1,
    data: 0,
  });
  const navigate = useNavigate();
  const handleActivePage = (number) => {
    if (number === stateHistorySong.page) return;
    setStateHistory((prev) => ({ ...prev, page: number }));
  };
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  const handleDeletePlaylist = (e, idPlayList) => {
    e.stopPropagation();
    onOpenModal({
      id: idPlayList,
      name: 'Playlist của bạn sẽ bị xóa khỏi thư viện cá nhân. Bạn có muốn xóa?',
      type: true,
      isDeleteShow: true,
    });
  };
  const handleNavigateVideo = (url, name) => {
    const pathLink = path.DETAILS_ARTIST.replace(':name', name) + path.OPEN_VIDEO;
    handleNavigate(pathLink.replace('/video-clip/:titleVideo/:videoId', url.split('.')[0]));
  };
  return (
    <section className={cx('container')}>
      <div className={cx('history')}>
        <nav className={cx('header')}>
          <h2 className={cx('title')}>Phát gần đây</h2>
          {listNavHistorySong.map(({ id, name, number }) => (
            <h3
              key={id}
              className={cx('text', {
                active: stateHistorySong.page === number,
              })}
              style={{ borderColor: stateHistorySong.page === number && themeApp?.primaryColor }}
              onClick={() => handleActivePage(number)}>
              {name}
            </h3>
          ))}
        </nav>
        <div className={cx('content')}>
          {stateHistorySong.page === 0 &&
            (currentUser?.historySong || []).map((song, index, arr) => (
              <CardAlbumSong
                key={song.encodeId}
                song={song}
                onActiveSong={(e) => onActiveSong(e, song)}
                currentSong={currentSong}
                hiddenIconMusic={true}
                currentUser={currentUser}
                onNavigateArtist={handleNavigate}
                onNavigate={(e) => {
                  e.stopPropagation();
                  handleNavigate(song.album.link.split('.')[0]);
                }}
                isPlay={isPlay}
                theme={themeApp}
                onAddLikeSong={(e) => onAddLikeSong(e, song)}
                onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
                onPlaySong={() => onPlaySong(song, arr, 'Nhạc yêu thích')}
              />
            ))}
          {stateHistorySong.page === 1 && (
            <div className={cx('menu__album')}>
              {(currentUser?.historyPlaylist || []).map((album) => (
                <CardAlbum
                  key={album?.encodeId}
                  onNavigatePlayList={() => handleNavigate(album?.link.split('.')[0])}
                  onNavigateArtist={handleNavigate}
                  data={album}
                  isPlay={isPlay}
                  onPlayMusicInPlaylist={onPlayMusicInPlaylist}
                  activeIdAlbum={activeIdAlbum}
                  currentUser={currentUser}
                  noTitle={true}
                  onAddPlayList={(e) => onAddPlayList(e, album)}
                  onRemovePlayList={(e) => onRemovePlayList(e, album?.encodeId)}
                  themeApp={themeApp}
                  onDeletePlaylist={(e) => handleDeletePlaylist(e, album?.encodeId)}
                />
              ))}
            </div>
          )}
          {stateHistorySong.page === 2 && (
            <div className={cx('menu__mv')}>
              {(currentUser?.historyMv || []).map((video) => (
                <CardVideo
                  data={video}
                  onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', video.artist.link))}
                  onNavigateArtist={handleNavigate}
                  onOpenVideo={() => handleNavigateVideo(video.link, video.name)}
                  isIconDelete={true}
                  deleteHistory={{
                    isIconDelete: true,
                    onDeleteHistory: (e) => onRemoveHistoryMv(e, video?.encodeId),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HistorySong;
