import { useContext } from 'react';
import { SearchProvider } from '../ContextSearch';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import classNames from 'classnames/bind';
import style from './AllSearch.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { modalSongErr } from '~/asset';
import { Autoplay, Keyboard } from 'swiper/modules';
import TitlePath from '~/utils/TitlePath';
// import Tippy from '@tippyjs/react';
import { CardAlbum, CardArtists, CardSong, CardVideo } from '~/components';
import { AuthProvider } from '~/AuthProvider';
import { useSelector } from 'react-redux';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate, useParams } from 'react-router-dom';
import path from '~/router/path';
const cx = classNames.bind(style);
const AllSearch = () => {
  const { stateSearch } = useContext(SearchProvider);
  const { currentUser } = useSelector((state) => state.auth);
  const { currentSong, isPlay, currentPlayList } = useSelector((state) => state.app);
  const { themeApp, handle, activeIdAlbum } = useContext(AuthProvider);
  const {
    onPlaySong,
    onAddPlayList,
    onRemovePlayList,
    onActiveSong,
    onPlayMusicInPlaylist,
    onAddLikeSong,
    onRemoveLikeSong,
    onAddArtist,
    onRemoveArtist,
  } = handle;
  const { isLoading, isError, searchData } = stateSearch;
  const navigate = useNavigate();
  const { keyWord } = useParams();

  const findArtist = (searchData?.artists || []).find((item) => item.id === searchData?.top?.id);
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
    //  dispatch(isScrollTop(false));
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
  console.log(searchData);
  return (
    <div className={cx('allSearch')}>
      {searchData?.top && (
        <>
          <div className={cx('highlight')}>
            <TitlePath content={'Nổi Bật'} style={{ marginTop: '0' }} />
            <div className={cx('highlight__list')}>
              <div className={cx('card__top')} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', searchData?.top?.link))}>
                {/* path.DETAILS_ARTIST.replace('/:name */}
                <div className={cx('avatar')}>
                  <img loading='lazy' src={searchData?.top?.thumbnail} alt='' />
                </div>
                <div className={cx('info')}>
                  <span className={cx('note')}>nghệ sĩ</span>
                  <h3 className={cx('name')}>{searchData?.top?.name}</h3>
                  <div className={cx('artists')}>
                    {findArtist?.totalFollow >= 1000 ? `${Math.round(findArtist?.totalFollow / 1000)}K` : findArtist?.totalFollow} follow
                  </div>
                </div>
              </div>
              {(searchData?.songs || []).map((song, index, array) => {
                if (index < 2) {
                  return (
                    <CardSong
                      card={song}
                      key={song.encodeId}
                      currentSong={currentSong}
                      currentUser={currentUser}
                      isIconLove={true}
                      isPlay={isPlay}
                      onNavigateArtist={handleNavigate}
                      onActiveSong={(e) => onActiveSong(e, song, false)}
                      onPlaySong={() => onPlaySong(song, array, 'Nổi bật')}
                      onAddLikeSong={(e) => onAddLikeSong(e, song)}
                      onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
                      // isSearch={true}
                      // isHiddenTime={true}
                      isSearch={true}
                      className={'isSearch'}
                    />
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className={cx('playlist')}>
            <div className={cx('header')}>
              <div className={cx('left')}>
                <div className={cx('avatar')} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', searchData?.top?.link))}>
                  <img src={searchData?.top?.thumbnail} alt='' />
                </div>
                <div className={cx('text')}>
                  <h4 className={cx('note')}>playlist nổi bật</h4>
                  <h3 className={cx('name')} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', searchData?.top?.link))}>
                    {searchData?.top?.name}
                  </h3>
                </div>
              </div>
              <div className={cx('right')} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', searchData?.top?.link))}>
                <span>tất cả</span>
                <ArrowForwardIosIcon />
              </div>
            </div>
            <div className={cx('content')}>
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
                  {(searchData?.playlists || []).map((playlist) => (
                    <SwiperSlide key={playlist?.encodeId}>
                      <CardAlbum
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
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </>
      )}
      <div className={cx('songs')}>
        <TitlePath content='Bài hát' show={true} onClick={() => handleNavigate(path.SEARCH + path.SEARCH_SONG.replace('/:keyWord', `/${keyWord}`))} />
        <div className={cx('list__songs')}>
          {(searchData?.songs || []).map((song, _index, array) => (
            <CardSong
              card={song}
              key={song?.encodeId}
              currentSong={currentSong}
              currentUser={currentUser}
              isIconLove={true}
              isPlay={isPlay}
              onNavigateArtist={handleNavigate}
              onActiveSong={(e) => onActiveSong(e, song, false)}
              onPlaySong={() => onPlaySong(song, array, currentPlayList?.title)}
              onAddLikeSong={(e) => onAddLikeSong(e, song)}
              onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
            />
          ))}
        </div>
      </div>
      <div className={cx('playlist')}>
        <TitlePath
          content='Playlist/Album'
          show={true}
          onClick={() => handleNavigate(path.SEARCH + path.SEARCH_PLAYLIST.replace('/:keyWord', `/${keyWord}`))}
        />
        <div className={cx('content')}>
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
              {(searchData?.playlists || []).map((playlist) => (
                <SwiperSlide key={playlist?.encodeId}>
                  <CardAlbum
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
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className={cx('mvs')}>
        <TitlePath content='MV' show={true} onClick={() => handleNavigate(path.SEARCH + path.MV.replace('/:keyWord', `/${keyWord}`))} />
        <div className={cx('content')}>
          <div className={cx('list__mv')}>
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
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                480: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1023: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}>
              {(searchData?.videos || []).map((data) => (
                <SwiperSlide key={data?.encodeId}>
                  <CardVideo
                    data={data}
                    onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', data?.artist?.link))}
                    onNavigateArtist={handleNavigate}
                    onOpenVideo={() => handleNavigateVideo(data.link, data.name)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className={cx('artists')}>
        <TitlePath content={'Nghệ sĩ/OA'} />
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
    </div>
  );
};

export default AllSearch;
