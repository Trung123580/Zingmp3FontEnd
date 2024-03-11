import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './LibraryMusic.module.scss';
import path from '~/router/path';
import { AuthProvider } from '~/AuthProvider';
import TitlePage from '~/utils/TitlePage';
import { useSelector } from 'react-redux';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { CardAlbum, CardAlbumSong, CardArtists, CardVideo, SingerListSong } from '~/components';
import { Autoplay, Keyboard } from 'swiper/modules';
import TitlePath from '~/utils/TitlePath';
import { Swiper, SwiperSlide } from 'swiper/react';
import { listLibrary } from '~/utils/constant';
const cx = classNames.bind(style);
const LibraryMusic = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { currentSong, isPlay } = useSelector((state) => state.app);
  const { themeApp, handle, activeIdAlbum } = useContext(AuthProvider);
  const { onPlaySong, onRemovePlayList, onAddPlayList, onOpenModal, onPlayMusicInPlaylist, onActiveSong, onAddLikeSong, onRemoveLikeSong } = handle;
  const [navItem, setNavItem] = useState(0);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const refBottom = useRef(null);
  const listPathRouter = ['/library-music/user-play-list', '/library-music/artist', '/library-music/history'];
  const constantPath = ['/library-music/love-song', '/library-music/user-album', '/library-music/upload'];
  const isRouter = listPathRouter.some((item) => item === pathname);
  const isConstantPath = constantPath.some((item) => item === pathname);
  useEffect(() => {
    if (isConstantPath && refBottom.current) {
      refBottom.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      const index = constantPath.findIndex((item) => item === pathname);
      if (index === 2) return;
      setNavItem(index);
    }
    // eslint-disable-next-line
  }, [isConstantPath, refBottom, pathname]);

  console.log(currentUser);
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
  const handleNavigateVideo = (url, name) => {
    const pathLink = path.DETAILS_ARTIST.replace(':name', name) + path.OPEN_VIDEO;
    navigate(pathLink.replace('/video-clip/:titleVideo/:videoId', url.split('.')[0]));
  };
  const handleNavItem = (itemPath, pathLink) => {
    setNavItem(itemPath);
    if (pathLink) handleNavigate(path.LIBRARY_MUSIC + pathLink);
  };
  const dataRenderPlaylist = useMemo(() => {
    return [].concat(currentUser?.createPlaylist || [], currentUser?.followPlayList || []);
  }, [currentUser]);
  // const isExitRender = router.find((item) => item.path === path.LIBRARY_MUSIC)?.insideRoute.some((route) => route.path === pathname);
  if (!currentUser) {
    return (
      <section className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={4} height={200} />
      </section>
    );
  }
  if (isRouter) {
    return <Outlet />;
  }
  return (
    <section className={cx('container')}>
      <div className={cx('library__music')}>
        <TitlePage
          content='Thư viện'
          className='artist'
          onClick={() =>
            onPlaySong(
              currentUser?.loveMusic[Math.floor(Math.random() * currentUser?.loveMusic.length)],
              currentUser?.loveMusic || [],
              'Nhạc yêu thích'
            )
          }
        />
        <div className={cx('menu__artists')}>
          {currentUser?.followArtist.map((artist, index) => {
            return (
              <CardArtists
                key={artist.id}
                data={artist}
                isHiddenFollow={true}
                // onToggleArtist={(e) => {
                //   currentUser?.followArtist.some((item) => item.id === artist.id) ? onRemoveArtist(e, artist.id) : onAddArtist(e, artist);
                // }}
                // isFollowArtist={currentUser?.followArtist.some((item) => item.id === artist.id)}
                themeApp={themeApp}
                onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', artist.link))}
              />
            );
          })}
          <CardArtists navigateFollow themeApp={themeApp} onNavigate={() => handleNavigate(`${path.LIBRARY_MUSIC}${path.ARTISTS}`)} />
        </div>
        <div className={cx('playlist')}>
          <TitlePath
            themeApp={themeApp}
            content={'PLAYLIST'}
            show={true}
            onClick={() => handleNavigate(`${path.LIBRARY_MUSIC}${path.USER_PLAY_LIST}`)}
          />
          <div className={cx('list__playlist')}>
            <Swiper
              className={cx('slider')}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={30}
              navigation={false}
              keyboard={true}
              rewind={true}
              noSwiping={true}
              modules={[Autoplay, Keyboard]}
              breakpoints={{
                360: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1023: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 5,
                },
              }}>
              {dataRenderPlaylist?.map((playlist) => (
                <SwiperSlide key={playlist?.encodeId}>
                  <CardAlbum
                    // key={playlist?.encodeId}
                    onNavigatePlayList={() => handleNavigatePlayList(null, playlist.artist ? playlist.link : playlist?.link.split('.')[0])}
                    onNavigateArtist={handleNavigate}
                    data={playlist}
                    isPlay={isPlay}
                    onPlayMusicInPlaylist={onPlayMusicInPlaylist}
                    activeIdAlbum={activeIdAlbum}
                    currentUser={currentUser}
                    noTitle={true}
                    onAddPlayList={(e) => onAddPlayList(e, playlist)}
                    onRemovePlayList={(e) => onRemovePlayList(e, playlist?.encodeId)}
                    themeApp={themeApp}
                    onDeletePlaylist={(e) => handleDeletePlaylist(e, playlist?.encodeId)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className={cx('bottom')} ref={refBottom}>
          <nav className={cx('nav__library')}>
            <ul className={cx('menu')}>
              {listLibrary.map(({ id, name, path, number }) => (
                <li
                  key={id}
                  className={cx('item', { active: number === navItem })}
                  style={{ borderColor: navItem === number && themeApp?.primaryColor }}
                  onClick={() => handleNavItem(number, path)}>
                  {name}
                </li>
              ))}
            </ul>
          </nav>
          <div className={cx('content')}>
            {navItem === 0 && (
              <>
                <SingerListSong playListData={{ isPlaylistUser: true }} />
                {(currentUser?.loveMusic || []).map((song, index, arr) => (
                  <CardAlbumSong
                    key={song.encodeId}
                    song={song}
                    onActiveSong={(e) => onActiveSong(e, song)}
                    currentSong={currentSong}
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
              </>
            )}
            {navItem === 1 && (
              <div className={cx('menu__album')}>
                {(currentUser?.followAlbum || []).map((album) => (
                  <CardAlbum
                    key={album?.encodeId}
                    onNavigatePlayList={() => handleNavigatePlayList(null, album?.link.split('.')[0])}
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
            {navItem === 2 && (
              <div className={cx('menu__mv')}>
                {(currentUser?.followMv || []).map((video) => (
                  <CardVideo
                    data={video}
                    onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', video.artist.link))}
                    onNavigateArtist={handleNavigate}
                    onOpenVideo={() => handleNavigateVideo(video.link, video.name)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <Outlet /> */}
    </section>
  );
};

export default LibraryMusic;
