import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Navigation } from 'swiper/modules';
import { getHome, isScrollTop } from '~/store/actions/dispatch';
import { apiHome } from '~/api';
import { CardAlbum, CardRank, CardSong, Slider, ChartCard, LineChart } from '~/components';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { listBtnNewRelease } from '~/utils/constant';
import { AuthProvider } from '~/AuthProvider';
import TitlePath from '~/utils/TitlePath';
import classNames from 'classnames/bind';
import style from './Home.module.scss';
import Button from '~/utils/Button';
import path from '~/router/path';
const cx = classNames.bind(style);
const Home = () => {
  const [activeBtn, setActiveBtn] = useState(1);
  const [menuGenre, setMenuGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { banner, newRelease, allAlbum, newReleaseChart, chartData, weekChart, remainingAlbum, currentSong, isPlay } = useSelector(
    (state) => state.app
  );
  const { currentUser } = useSelector((state) => state.auth);
  const { themeApp, handle, selectedChart, activeIdAlbum } = useContext(AuthProvider);
  const { onPlaySong, onAddPlayList, onRemovePlayList, onCloseModal, onActiveSong, onPlayMusicInPlaylist } = handle;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiHome();
        if (response.data?.err === 0) {
          setIsLoading(true);
          dispatch(getHome(response));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getData();
    return () => {
      onCloseModal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (newRelease) setMenuGenre(newRelease.items.all);
  }, [newRelease]);
  const handleTypeActive = (number, type) => {
    setActiveBtn(number);
    setMenuGenre(newRelease.items[type]);
  };
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
    dispatch(isScrollTop(false));
  };
  const handleNavigatePlayList = (type, idPlayList) => {
    if (type === 1) return; // lam modal phat bai hat
    navigate(idPlayList);
  };
  return (
    <div className={cx('container')}>
      {isLoading ? (
        <>
          <Slider banner={banner} onNavigatePlayList={handleNavigatePlayList} />
          <TitlePath themeApp={themeApp} content='Mới Phát Hành' show={true} onClick={() => handleNavigate(path.NEW_RELEASE)} />
          <div className={cx('list-btn')}>
            {listBtnNewRelease.map(({ content, id, active, type }) => (
              <Button
                key={id}
                content={content}
                className='genre-select'
                style={{ background: activeBtn === active && themeApp?.primaryColor }}
                onClick={() => handleTypeActive(active, type)}
              />
            ))}
          </div>
          <div className={cx('menu')}>
            {!!menuGenre.length &&
              menuGenre.map((card, index, array) => {
                if (index <= 11) {
                  return (
                    <CardSong
                      key={uuid()}
                      onActiveSong={(e) => onActiveSong(e, card, false)}
                      isPlay={isPlay}
                      currentSong={currentSong}
                      currentUser={currentUser}
                      onNavigateArtist={handleNavigate}
                      card={card}
                      onPlaySong={() => onPlaySong(card, array, newRelease?.title)}
                    />
                  );
                }
                return null;
              })}
          </div>
          {!!allAlbum.length &&
            allAlbum.map((album) => {
              return (
                <section className={cx('wrapper-album')} key={uuid()}>
                  <TitlePath content={album?.title} />
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
                    {album?.items.map((album) => (
                      <SwiperSlide key={album.encodeId}>
                        <CardAlbum
                          onNavigatePlayList={() => handleNavigate(album.link.split('.')[0])}
                          onNavigateArtist={handleNavigate}
                          data={album}
                          onAddPlayList={(e) => onAddPlayList(e, album)}
                          onRemovePlayList={(e) => onRemovePlayList(e, album.encodeId)}
                          currentUser={currentUser}
                          themeApp={themeApp}
                          isPlay={isPlay}
                          onPlayMusicInPlaylist={onPlayMusicInPlaylist}
                          activeIdAlbum={activeIdAlbum}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              );
            })}
          {!!newReleaseChart && (
            <section className={cx('wrapper-ranks')}>
              <TitlePath themeApp={themeApp} content={newReleaseChart.title} show={true} onClick={() => handleNavigate(path.NEW_MUSIC)} />
              <Swiper
                className={cx('slider')}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                spaceBetween={30}
                navigation={true}
                keyboard={true}
                rewind={true}
                noSwiping={true}
                modules={[Autoplay, Navigation, Keyboard]}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  993: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  1023: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                }}>
                {newReleaseChart?.items.map((rank, index, arr) => (
                  <SwiperSlide key={uuid()}>
                    <CardRank
                      data={rank}
                      index={index}
                      onNavigateArtist={handleNavigate}
                      onPlaySong={() => onPlaySong(rank, arr, newReleaseChart?.title)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}
          <section className={cx('chart')}>
            <div className={cx('logo-zingChart')}>
              <Link to={path.ZING_CHART}>#zingchart</Link>
            </div>
            <div className={cx('main')}>
              <div className={cx('chart-left')}>
                {chartData?.items.map((item, index, arr) => {
                  if (index < 3) {
                    return (
                      <ChartCard
                        active={selectedChart?.encodeId === item.encodeId}
                        key={uuid()}
                        onNavigateArtist={handleNavigate}
                        data={item}
                        index={index + 1}
                        totalScore={chartData?.chart?.totalScore}
                        onPlaySong={() => onPlaySong(item, arr, '#zingchart')}
                      />
                    );
                  }
                  return null;
                })}
                <div className={cx('wrapper-btn')}>
                  <Button content='Xem Thêm' className='outline' onClick={() => handleNavigate(path.ZING_CHART)} />
                </div>
              </div>
              <div className={cx('chart-right')}>
                <LineChart chartData={chartData} />
              </div>
            </div>
          </section>
          <section className={cx('zing-chart')}>
            {!!weekChart &&
              weekChart.items.map(({ banner }) => (
                <div className={cx('zing-item')} key={uuid()}>
                  <img src={banner} alt='' />
                </div>
              ))}
          </section>
          {!!remainingAlbum &&
            remainingAlbum.map((album) => (
              <section id={cx('wrapper-ranks')} key={uuid()}>
                <TitlePath
                  themeApp={themeApp}
                  content={album?.title}
                  show={album?.sectionId === 'hAlbum' ? false : true}
                  onClick={() => handleNavigate(path.TOP_100)}
                />
                <Swiper
                  className={cx('slider')}
                  autoplay={{
                    delay: 7000,
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
                  {album?.items.map((album) => (
                    <SwiperSlide key={album.encodeId}>
                      <CardAlbum
                        onNavigatePlayList={() => handleNavigate(album?.link.split('.')[0])}
                        onNavigateArtist={handleNavigate}
                        data={album}
                        currentUser={currentUser}
                        noTitle={true}
                        onAddPlayList={(e) => onAddPlayList(e, album)}
                        onRemovePlayList={(e) => onRemovePlayList(e, album?.encodeId)}
                        themeApp={themeApp}
                        isPlay={isPlay}
                        onPlayMusicInPlaylist={onPlayMusicInPlaylist}
                        activeIdAlbum={activeIdAlbum}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            ))}
        </>
      ) : (
        <>
          <CardFullSkeletonBanner />
          <BoxSkeleton card={4} height={200} />
        </>
      )}
    </div>
  );
};

export default Home;
