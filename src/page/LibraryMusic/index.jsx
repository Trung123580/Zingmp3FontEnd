import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import style from './LibraryMusic.module.scss';
import path from '~/router/path';
import { ref, listAll, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseStorage } from '~/fireBase-config';
import { AuthProvider } from '~/AuthProvider';
import TitlePage from '~/utils/TitlePage';
import { useSelector } from 'react-redux';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { CardAlbum, CardAlbumSong, CardArtists, CardVideo, SingerListSong } from '~/components';
import { Autoplay, Keyboard } from 'swiper/modules';
import TitlePath from '~/utils/TitlePath';
import { Swiper, SwiperSlide } from 'swiper/react';
import { listLibrary } from '~/utils/constant';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { songDefault } from '~/asset';
import Button from '~/utils/Button';
const cx = classNames.bind(style);
const LibraryMusic = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { currentSong, isPlay } = useSelector((state) => state.app);
  const { themeApp, handle, activeIdAlbum } = useContext(AuthProvider);
  const { onPlaySong, onRemovePlayList, onAddPlayList, onOpenModal, onPlayMusicInPlaylist, onActiveSong, onAddLikeSong, onRemoveLikeSong } = handle;
  const [navItem, setNavItem] = useState(0);
  const [isTransferSong, setIsTransferSong] = useState(false);
  const [stateLibrary, setStateLibrary] = useState({
    listAudioUpload: [],
    reRender: false,
  });
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const refBottom = useRef(null);
  const [listPathRouter] = useState(['/library-music/user-play-list', '/library-music/artist', '/library-music/history']);
  const [constantPath] = useState(['/library-music/love-song', '/library-music/user-album', '/library-music/upload']);
  const isRouter = useMemo(() => listPathRouter.some((item) => item === pathname), [pathname, listPathRouter]);
  const isConstantPath = useMemo(() => constantPath.some((item) => item === pathname), [pathname, constantPath]);
  useEffect(() => {
    if (isConstantPath && refBottom.current) {
      refBottom.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      const index = constantPath.findIndex((item) => item === pathname);
      if (index === 2) {
        if (!isTransferSong) setIsTransferSong(true);
        setNavItem(0);
        return;
      }
      if (isTransferSong) setIsTransferSong(false);
      setNavItem(index);
    }
    // eslint-disable-next-line
  }, [isConstantPath, refBottom, pathname, constantPath]);
  useEffect(() => {
    const getAudio = async () => {
      try {
        const files = await listAll(ref(firebaseStorage, 'audio/'));
        const data = await Promise.all(
          files.items.map(async (item) => {
            const url = await getDownloadURL(item);
            const title = item.name;
            const audio = new Audio(url); // Tạo một đối tượng Audio từ URL
            audio.load(); // Load âm thanh
            let duration;
            await new Promise((resolve) => {
              audio.oncanplaythrough = () => {
                const durationInSeconds = Math.floor(audio.duration);
                resolve(durationInSeconds);
              };
            }).then((res) => {
              duration = res;
            });
            return {
              url: url,
              title: title.trim(),
              encodeId: uuid(),
              duration: duration,
              fileUploadAudio: true,
              thumbnailM: songDefault,
            };
          })
        );
        setStateLibrary((prev) => ({ ...prev, listAudioUpload: data }));
      } catch (error) {
        console.error(error);
      }
    };
    getAudio();
  }, [stateLibrary.reRender]);
  console.log(stateLibrary.listAudioUpload);
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
  const handleNavItem = (itemPath, pathLink) => {
    setNavItem(itemPath);
    if (pathLink) handleNavigate(path.LIBRARY_MUSIC + pathLink);
  };
  const handleUpdateAudio = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      if (file.name.endsWith('.mp3')) {
        const audioRef = ref(firebaseStorage, `audio/${file?.name}`);
        const uploadTask = uploadBytesResumable(audioRef, file);
        await toast.promise(uploadTask, {
          pending: 'Đang tải lên tệp...',
          success: 'Tệp đã được tải lên thành công!',
          error: 'Đã xảy ra lỗi khi tải lên tệp.',
        });
        setStateLibrary((prev) => ({ ...prev, reRender: !prev.reRender }));
        event.target.files = null;
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải lên tệp: ' + error.message);
    }
  };
  const dataRenderPlaylist = useMemo(() => {
    return [].concat(currentUser?.createPlaylist || [], currentUser?.followPlayList || []);
  }, [currentUser]);
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
                    // onNavigatePlayList={() => handleNavigatePlayList(null, playlist.artist ? playlist.link : playlist?.link.split('.')[0])}
                    onNavigatePlayList={() => handleNavigate(playlist.artist ? playlist.link : playlist?.link.split('.')[0])}
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
                <div className={cx('list-btn')}>
                  <Button
                    content='Yêu thích'
                    className='genre-select'
                    onClick={() => {
                      if (!isTransferSong) return;
                      setIsTransferSong(false);
                    }}
                    style={{ background: !isTransferSong && themeApp?.primaryColor }}
                  />
                  <Button
                    content='Đã tải lên'
                    className='genre-select'
                    onClick={() => {
                      if (isTransferSong) return;
                      setIsTransferSong(true);
                    }}
                    style={{ background: isTransferSong && themeApp?.primaryColor }}
                  />
                </div>
                {!isTransferSong && (
                  <>
                    <SingerListSong playListData={{ isPlaylistUser: true }} />
                    {(currentUser?.loveMusic || []).map((song, _index, arr) => (
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
                <input type='file' name='file' id='up__file' accept='audio/*' multiple style={{ display: 'none' }} onChange={handleUpdateAudio} />
                {isTransferSong && (
                  <div className={cx('wrapper__upload')}>
                    {stateLibrary.listAudioUpload.length ? (
                      <div className={cx('files')}>
                        {stateLibrary.listAudioUpload.map((song, _index, arr) => (
                          <CardAlbumSong
                            currentSong={currentSong}
                            key={song.encodeId}
                            song={song}
                            onPlaySong={() => onPlaySong(song, arr, 'Nhạc tải lên')}
                            onAddLikeSong={(e) => onAddLikeSong(e, song)}
                            onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
                            isPlay={isPlay}
                            currentUser={currentUser}
                            theme={themeApp}
                            songDefault={songDefault}
                            // fileUpload={true}
                            hiddenIconMusic={true}
                            // chartIndex={}
                            onActiveSong={(e) => onActiveSong(e, song, true, song?.title)}
                          />
                        ))}
                        <div className={cx('wrapper__label')} style={{ marginTop: '20px' }}>
                          <label htmlFor='up__file' className={cx('label__file')} style={{ background: themeApp?.primaryColor }}>
                            Tải lên ngay
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className={cx('no-file')}>
                        <div className={cx('image')}></div>
                        <h4 className={cx('text')}>Chưa có bài hát tải lên trong thư viện cá nhân</h4>
                        <div className={cx('wrapper__label')}>
                          <label htmlFor='up__file' className={cx('label__file')} style={{ background: themeApp?.primaryColor }}>
                            Tải lên ngay
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {navItem === 1 && (
              <div className={cx('menu__album')}>
                {(currentUser?.followAlbum || []).map((album) => (
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
    </section>
  );
};

export default LibraryMusic;
