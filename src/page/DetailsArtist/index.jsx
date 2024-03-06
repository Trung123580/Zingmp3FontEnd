import { useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { AuthProvider } from '~/AuthProvider';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames/bind';
import { getArtistInfo, isScrollTop } from '~/store/actions/dispatch';
import { CardSong, CardVideo, CardAlbum, CardArtists } from '~/components';
import BaseModal from '~/utils/BaseModal';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { apiGetArtist } from '~/api';
import path from '~/router/path';
import TitlePath from '~/utils/TitlePath';
import Button from '~/utils/Button';
import style from './DetailsArtist.module.scss';
import { BsPersonAdd, BsCheck2 } from 'react-icons/bs';
const cx = classNames.bind(style);
const DetailsArtist = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { currentSong, isPlay, artistInfo, artistTopSection, singleEP, artistVideo, artistPlaylist, listArtist } = useSelector((state) => state.app);
  const { themeApp, handle, isOpenModal, currentModal } = useContext(AuthProvider);
  const [isLoading, setIsLoading] = useState(false);
  const { name, panel, videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    onAddLikeSong,
    onRemoveLikeSong,
    onPlaySong,
    onAddAlbum,
    onRemoveAlbum,
    onOpenModal,
    onCloseModal,
    onActiveSong,
    onAddArtist,
    onRemoveArtist,
  } = handle;
  useEffect(() => {
    (async () => {
      setIsLoading(false);
      try {
        const response = await apiGetArtist(name);
        if (response.data?.err === 0) {
          setIsLoading(true);
          dispatch(getArtistInfo(response));
          // mount se scrollTop = 0
          dispatch(isScrollTop(true));
        }
      } catch (error) {
        console.error(error);
      }
    })();
    return () => {
      dispatch(isScrollTop(false));
      if (isOpenModal) onCloseModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
  const formatFollowCount = useMemo(() => {
    if (!artistInfo?.totalFollow) {
      return 0;
    }
    const formattedCount = artistInfo.totalFollow.toLocaleString('en-US');
    return formattedCount.split(',').join('.');
  }, [artistInfo]);
  const handleNavigateVideo = (url) => {
    const pathLink = path.DETAILS_ARTIST.replace(':name', name) + path.OPEN_VIDEO;
    navigate(pathLink.replace('/video-clip/:titleVideo/:videoId', url.split('.')[0]));
  };
  const handleNavigate = (url) => {
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
  const handleNavigatePanel = (url) => {
    const link = url
      .split('/')
      .filter((item) => item !== 'nghe-si')
      .join('/');
    const pathLink = path.DETAILS_ARTIST + path.DETAILS_ARTIST_PANEL;
    navigate(pathLink.replace('/:name/:panel', link));
    dispatch(isScrollTop(false));
  };
  const isFollowArtist = currentUser?.followArtist.some((item) => item?.id === artistInfo?.id);
  if (panel) {
    return (
      <div className={cx('container')}>
        <Outlet />
      </div>
    );
  }
  if (videoId) {
    return <Outlet />;
  }
  if (!isLoading) {
    return (
      <div className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={4} height={200} />
      </div>
    );
  }
  return (
    <>
      <div className={cx('container')} style={{ padding: '0' }}>
        <div className={cx('banner')}>
          <div className={cx('img')}>
            <img src={artistInfo?.cover} alt='' />
          </div>
          <div className={cx('information')}>
            <div className={cx('avatar')}>
              <img src={artistInfo?.thumbnailM} alt='' />
            </div>
            <div className={cx('content')}>
              <h2>{artistInfo?.name}</h2>
              <div className={cx('bottom')}>
                <span className={cx('follow')}>{formatFollowCount} người quan tâm</span>
                <Button
                  content={isFollowArtist ? 'Đã quan tâm' : 'quan tâm'}
                  onClick={(e) => (isFollowArtist ? onRemoveArtist(e, artistInfo.id) : onAddArtist(e, artistInfo))}
                  icon={isFollowArtist ? <BsCheck2 fontSize='16px' /> : <BsPersonAdd fontSize='16px' />}
                  className='add-artist'
                  style={{ borderColor: themeApp?.primaryColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={cx('artist')}>
        <div className={cx('container')} style={{ marginTop: '0' }}>
          <div className={cx('new-release')}>
            <div className={cx('title')}>
              {!!artistTopSection?.topAlbum && (
                <div className={cx('title-left')}>
                  <TitlePath content='Mới phát hành' style={{ marginTop: '0' }} />
                </div>
              )}
              <div className={cx('title-right')}>
                <TitlePath
                  content={artistTopSection?.title}
                  show={true}
                  style={{ marginTop: '0' }}
                  onClick={() => handleNavigatePanel(artistTopSection.link)}
                />
              </div>
            </div>
            <div className={cx('content')}>
              {!!artistTopSection?.topAlbum && (
                <div className={cx('left')}>
                  <div className={cx('card-new')} onClick={() => handleNavigate(artistTopSection?.topAlbum?.link.split('.')[0])}>
                    <div className={cx('avatar')}>
                      <img src={artistTopSection?.topAlbum?.thumbnailM} alt='' />
                    </div>
                    <div className={cx('info')}>
                      <span className={cx('note')}>{artistTopSection?.topAlbum?.textType}</span>
                      <div className={cx('wrapper-name')}>
                        <h3>{artistTopSection?.topAlbum?.title}</h3>
                        <div className={cx('artists')}>
                          {artistTopSection?.topAlbum?.artists?.map(({ id, name, link }, index, arr) => (
                            <span key={id} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', link))}>
                              {name + `${index === arr.length - 1 ? '' : ','}`}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={cx('note')}>{artistTopSection?.topAlbum?.releaseDate}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className={cx('right')}>
                <div
                  className={cx('menu-song', {
                    response: !!artistTopSection?.topAlbum,
                  })}>
                  {artistTopSection?.items?.map((song, index, arr) => {
                    if (index < 6) {
                      return (
                        <CardSong
                          card={song}
                          key={song.encodeId}
                          onActiveSong={(e) => onActiveSong(e, song)}
                          isPlay={isPlay}
                          isHiddenTime={true}
                          currentSong={currentSong}
                          currentUser={currentUser}
                          onRemoveLikeSong={(e) => onRemoveLikeSong(e, song.encodeId)}
                          onAddLikeSong={(e) => onAddLikeSong(e, song)}
                          onPlaySong={() => onPlaySong(song, arr, null)}
                          className='edit'
                          isIconLove={true}
                          style={{ borderBottom: '1px solid hsla(0,0%,100%,0.05)' }}
                          onNavigateArtist={handleNavigate}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={cx('middle')}>
            <div className={cx('wrapper-album')}>
              {singleEP?.map((section) => (
                <section id={cx('wrapper-album')} key={uuid()}>
                  <TitlePath content={section.title} show={section?.link} onClick={() => handleNavigatePanel(section?.link)} />
                  <Swiper
                    className={cx('slider')}
                    autoplay={{
                      delay: 7000,
                      pauseOnMouseEnter: true,
                      disableOnInteraction: false,
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
                    {section?.items.map((album) => (
                      <SwiperSlide key={album.encodeId}>
                        <CardAlbum
                          onNavigatePlayList={() => handleNavigate(album.link.split('.')[0])}
                          data={album}
                          onAddPlayList={(e) => onAddAlbum(e, album)}
                          onRemovePlayList={(e) => onRemoveAlbum(e, album.encodeId)}
                          onNavigateArtist={handleNavigate}
                          currentUser={currentUser}
                          themeApp={themeApp}
                          noTitle={true}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              ))}
            </div>
            {artistVideo?.items && (
              <section id={cx('wrapper-album')} key={uuid()}>
                <TitlePath content={artistVideo?.title} show={true} onClick={() => handleNavigatePanel(artistVideo?.link)} />
                <Swiper
                  className={cx('slider')}
                  autoplay={{
                    delay: 8000,
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false,
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
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    993: {
                      slidesPerView: 4,
                    },
                  }}>
                  {artistVideo?.items?.map((data) => (
                    <SwiperSlide key={data.encodeId}>
                      <CardVideo
                        data={data}
                        onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', data.artist.link))}
                        onNavigateArtist={handleNavigate}
                        // onOpenVideo={() => onOpenVideo({ type: true, videoId: data.encodeId })}
                        onOpenVideo={() => handleNavigateVideo(data.link)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            )}
            <div className={cx('wrapper-album')}>
              {artistPlaylist?.map((section) => (
                <section id={cx('wrapper-album')} key={uuid()}>
                  <TitlePath content={section.title} show={section?.link} onClick={() => handleNavigatePanel(section?.link)} />
                  <Swiper
                    className={cx('slider')}
                    autoplay={{
                      delay: 10000,
                      pauseOnMouseEnter: true,
                      disableOnInteraction: false,
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
                    {section?.items.map((album) => (
                      <SwiperSlide key={album.encodeId}>
                        <CardAlbum
                          onNavigatePlayList={() => handleNavigate(album.link.split('.')[0])}
                          data={album}
                          onAddPlayList={(e) => onAddAlbum(e, album)}
                          onRemovePlayList={(e) => onRemoveAlbum(e, album.encodeId)}
                          currentUser={currentUser}
                          onNavigateArtist={handleNavigate}
                          themeApp={themeApp}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              ))}
            </div>
            <div className={cx('menu-artists')}>
              <TitlePath content={listArtist?.title} />
              <div className={cx('  ')}>
                {listArtist?.items.map((artist, index) => {
                  if (index < 5) {
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
                  }
                  return null;
                })}
              </div>
            </div>
            <div className={cx('artist-biography')}>
              <TitlePath content={`Về ${artistInfo?.name}`} />
              <div className={cx('artist-content')}>
                <div className={cx('avatar')}>
                  <img src={artistInfo?.thumbnailM} alt='' />
                </div>
                <div className={cx('description')}>
                  <div className={cx('text')}>
                    <p>{artistInfo?.biography.split('<br>').join('')}</p>
                    <span onClick={() => onOpenModal({ name: null, type: false }, true)}>xem thêm</span>
                  </div>
                  <div className={cx('follow')}>
                    <h4>{formatFollowCount}</h4>
                    <span>Người quan tâm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BaseModal
        reverseModal={currentModal}
        name={artistInfo?.name}
        thumbnail={artistInfo?.thumbnailM}
        desc={artistInfo?.biography}
        open={isOpenModal}
        onClose={onCloseModal}
      />
    </>
  );
};

export default DetailsArtist;
