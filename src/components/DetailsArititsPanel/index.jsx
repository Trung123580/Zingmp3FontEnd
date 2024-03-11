import { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './DetailsArititsPanel.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CardAlbum, CardAlbumSong, CardVideo } from '..';
import { AuthProvider } from '~/AuthProvider';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { TbSortAscending } from 'react-icons/tb';
// import ArrowBackIosIcon from '@mui/icons-materi  al/ArrowBackIos';
import { sortBy as _sortBy } from 'lodash';
import path from '~/router/path';
import { isScrollTop } from '~/store/actions/dispatch';
const cx = classNames.bind(style);
const DetailsArtistPanel = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { currentSong, isPlay, artistTopSection, singleEP, artistVideo } = useSelector((state) => state.app);
  const [sortSong, setSortSong] = useState(0);
  const [isShowDropDown, setIsShowDropDown] = useState(false);
  const { themeApp, handle, activeIdAlbum } = useContext(AuthProvider);
  const { onPlaySong, onAddLikeSong, onRemoveLikeSong, onAddAlbum, onRemoveAlbum, onPlayMusicInPlaylist } = handle;
  const { name, panel } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(artistVideo);
  const listSong = useMemo(() => {
    return artistTopSection?.items;
  }, [artistTopSection]);
  const handleNavigate = (type, url) => {
    if (type === 1) return; // lam modal phat bai hat
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  const handleNavigateUser = (url) => {
    const index = url
      .split('/')
      .filter((item) => item !== 'nghe-si')
      .findLastIndex((item) => item);
    if (!(url.split('/').filter((item) => item !== 'nghe-si')[index] === name)) {
      navigate(
        url
          .split('/')
          .filter((item) => item !== 'nghe-si')
          .join('/')
      );
    }
  };
  const handleShowDropdown = (e) => {
    e.stopPropagation();
    setIsShowDropDown(!isShowDropDown);
  };
  const handleSortSong = (typeNumber) => {
    if (typeNumber === 0) {
      setSortSong(0);
      artistTopSection.items = listSong;
      return;
    }
    if (typeNumber === 1) {
      setSortSong(1);
      artistTopSection.items = _sortBy(artistTopSection.items, 'releaseDate').reverse();
      return;
    }
  };
  const handleClickOutside = () => {
    setIsShowDropDown(false);
  };
  const handleNavigateVideo = (url) => {
    const pathLink = path.DETAILS_ARTIST.replace(':name', name) + path.OPEN_VIDEO;
    navigate(pathLink.replace('/video-clip/:titleVideo/:videoId', url.split('.')[0]));
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    dispatch(isScrollTop(true));
    return () => {
      document.removeEventListener('click', handleClickOutside);
      dispatch(isScrollTop(false));
    };
    // eslint-disable-next-line
  }, []);
  if (panel === 'bai-hat' && artistTopSection) {
    return (
      <section className={cx('wrapper-song')}>
        <div className={cx('title')}>
          <h2>{name} - Tất Cả Bài Hát</h2>
          <div className={cx('select')} onClick={handleShowDropdown}>
            <TbSortAscending style={{ fontSize: '18px' }} />
            <span>{sortSong ? 'Mới Nhât' : 'Nổi bật'}</span>
            <div
              className={cx('dropdown', {
                show: isShowDropDown,
              })}>
              <span className={cx('item')} onClick={() => handleSortSong(0)}>
                Nổi bật
              </span>
              <span className={cx('item')} onClick={() => handleSortSong(1)}>
                Mới nhất
              </span>
            </div>
          </div>
        </div>
        <div className={cx('list-song')}>
          {artistTopSection?.items.map((song) => (
            <CardAlbumSong
              song={song}
              key={song.encodeId}
              hiddenIconMusic={true}
              currentSong={currentSong}
              currentUser={currentUser}
              onNavigateArtist={handleNavigate}
              onNavigate={() => handleNavigate(null, song.album.link.split('.')[0])}
              isPlay={isPlay}
              theme={themeApp}
              onAddLikeSong={(e) => onAddLikeSong(e, song)}
              onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
              onPlaySong={() => onPlaySong(song, artistTopSection.items, artistTopSection.title)}
            />
          ))}
        </div>
      </section>
    );
  }
  if (panel === 'single' && singleEP.length) {
    return (
      <section className={cx('single')}>
        <div className={cx('title')}>
          <h2>{name} - Tất Cả Bài Hát</h2>
        </div>
        <div className={cx('menu')}>
          {singleEP[0].items.map((data) => (
            <div className={cx('item-album')} key={data.encodeId}>
              <CardAlbum
                data={data}
                onNavigatePlayList={() => handleNavigate(data.link.split('.')[0])}
                onAddPlayList={(e) => onAddAlbum(e, data)}
                onRemovePlayList={(e) => onRemoveAlbum(e, data.encodeId)}
                onNavigateArtist={handleNavigate}
                currentUser={currentUser}
                themeApp={themeApp}
                noTitle={true}
                isPlay={isPlay}
                onPlayMusicInPlaylist={onPlayMusicInPlaylist}
                activeIdAlbum={activeIdAlbum}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (panel === 'video' && artistVideo) {
    return (
      <section className={cx('video')}>
        <div className={cx('title')}>
          <h2>{name} - Tất Cả Video</h2>
        </div>
        <div className={cx('video-menu')}>
          {artistVideo?.items.map((data) => (
            <div key={data.encodeId} className={cx('video-item')}>
              <CardVideo
                data={data}
                onNavigate={() => handleNavigateUser(path.DETAILS_ARTIST.replace('/:name', data.artist.link))}
                onNavigateArtist={handleNavigateUser}
                onOpenVideo={() => handleNavigateVideo(data.link)}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }
  return (
    <>
      <CardFullSkeletonBanner />
      <BoxSkeleton card={5} height={200} />
    </>
  );
};

export default DetailsArtistPanel;
