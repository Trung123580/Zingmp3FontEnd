import classNames from 'classnames/bind';
import style from './UserPlayList.module.scss';
import { AuthProvider } from '~/AuthProvider';
import { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CardAlbum } from '~/components';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
const UserPlayList = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { isPlay } = useSelector((store) => store.app);
  const { themeApp, handle, activeIdAlbum } = useContext(AuthProvider);
  const { onAddPlayList, onRemovePlayList, onOpenModal, onPlayMusicInPlaylist } = handle;
  const [isMyPlaylist, setIsMyPlaylist] = useState(false);
  const navigate = useNavigate();
  const dataRenderPlaylist = useMemo(() => {
    return [].concat(currentUser?.createPlaylist || [], currentUser?.followPlayList || []);
  }, [currentUser]);
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  const handleNavigatePlayList = (type, idPlayList) => {
    if (type === 1) return; // lam modal phat bai hat
    navigate(idPlayList);
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
  return (
    <section className={cx('container')}>
      <div className={cx('page__playlist')}>
        <nav className={cx('header')}>
          <h2 className={cx('title')}>Playlist</h2>
          <h3
            className={cx('text', {
              active: !isMyPlaylist,
            })}
            onClick={() => setIsMyPlaylist(false)}
            style={{ borderColor: !isMyPlaylist && themeApp?.primaryColor }}>
            tất cả
          </h3>
          <h3
            className={cx('text', {
              active: isMyPlaylist,
            })}
            onClick={() => setIsMyPlaylist(true)}
            style={{ borderColor: isMyPlaylist && themeApp?.primaryColor }}>
            Của tôi
          </h3>
        </nav>
        <div className={cx('content')}>
          <div className={cx('menu')}>
            <div
              className={cx('card__create-playlist')}
              onClick={() =>
                onOpenModal(
                  {
                    name: 'Tạo playlist mới',
                    type: true,
                  },
                  true
                )
              }
              style={{ color: themeApp && themeApp?.primaryColor }}>
              <IoAddCircleOutline />
              <span className={cx('note')}>Tạo playlist mới</span>
            </div>
            {isMyPlaylist
              ? currentUser?.createPlaylist.map((playlist) => (
                  <CardAlbum
                    key={playlist?.encodeId}
                    onNavigatePlayList={() => handleNavigatePlayList(null, playlist.artist ? playlist.link : playlist?.link.split('.')[0])}
                    onNavigateArtist={handleNavigate}
                    isPlay={isPlay}
                    onPlayMusicInPlaylist={onPlayMusicInPlaylist}
                    activeIdAlbum={activeIdAlbum}
                    data={playlist}
                    currentUser={currentUser}
                    noTitle={true}
                    onAddPlayList={(e) => onAddPlayList(e, playlist)}
                    onRemovePlayList={(e) => onRemovePlayList(e, playlist?.encodeId)}
                    themeApp={themeApp}
                    onDeletePlaylist={(e) => handleDeletePlaylist(e, playlist?.encodeId)}
                  />
                ))
              : dataRenderPlaylist.map((playlist) => (
                  <CardAlbum
                    key={playlist?.encodeId}
                    onNavigatePlayList={() => handleNavigatePlayList(null, playlist.artist ? playlist.link : playlist?.link.split('.')[0])}
                    isPlay={isPlay}
                    onPlayMusicInPlaylist={onPlayMusicInPlaylist}
                    activeIdAlbum={activeIdAlbum}
                    onNavigateArtist={handleNavigate}
                    data={playlist}
                    currentUser={currentUser}
                    noTitle={true}
                    onAddPlayList={(e) => onAddPlayList(e, playlist)}
                    onRemovePlayList={(e) => onRemovePlayList(e, playlist?.encodeId)}
                    themeApp={themeApp}
                    onDeletePlaylist={(e) => handleDeletePlaylist(e, playlist?.encodeId)}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPlayList;
