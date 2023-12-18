import { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Navigation } from 'swiper/modules';
import { getHome } from '~/store/actions/dispatch';
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
  const [meneGenre, setMenuGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { banner, newRelease, allAlbum, newReleaseChart, chartData, weekChart, remainingAlbum } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const { currentSong, isPlay } = useSelector((state) => state.app);
  const { themeApp, handle, selectedChart } = useContext(AuthProvider);
  const { onPlaySong, onAddPlayList, onRemovePlayList } = handle;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(allAlbum);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (newRelease) setMenuGenre(newRelease.items.all);
  }, [newRelease]);
  // useEffect(() => {}, [currentSong, isPlay]);
  const handleTypeActive = (number, type) => {
    setActiveBtn(number);
    if (type === 'all') setMenuGenre(newRelease.items[type]);
    if (type === 'others') setMenuGenre(newRelease.items[type]);
    if (type === 'vPop') setMenuGenre(newRelease.items[type]);
  };
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
  return (
    <div className={cx('container')}>
      {isLoading ? (
        <>
          <Slider banner={banner} onNavigatePlayList={handleNavigatePlayList} />
          <TitlePath content='Mới Phát Hành' show={true} onClick={() => handleNavigate(path.NEW_RELEASE + path.SONG)} />
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
            {!!meneGenre.length &&
              meneGenre.map((card, index, array) => {
                if (index <= 11) {
                  return (
                    <CardSong
                      key={uuid()}
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
            allAlbum.map(({ title, items }) => {
              return (
                <section id={cx('wrapper-album')} key={uuid()}>
                  <TitlePath content={title} />
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
                      993: {
                        slidesPerView: 5,
                      },
                    }}>
                    {/* { thumbnailM, sortDescription, encodeId, link, title } */}
                    {items.map((album) => (
                      <SwiperSlide key={album.encodeId}>
                        <CardAlbum
                          onNavigatePlayList={() => handleNavigatePlayList(null, album.link.split('.')[0])}
                          onNavigateArtist={handleNavigate}
                          data={album}
                          onAddPlayList={(e) => onAddPlayList(e, album)}
                          onRemovePlayList={(e) => onRemovePlayList(e, album.encodeId)}
                          currentUser={currentUser}
                          themeApp={themeApp}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              );
            })}
          {!!newReleaseChart && (
            <section className={cx('wrapper-ranks')}>
              <TitlePath content={newReleaseChart.title} show={true} onClick={() => handleNavigate(path.NEW_MUSIC)} />
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
                    slidesPerView: 3,
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
              <div className={cx('ranks')}></div>
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
            remainingAlbum.map(({ title, items, sectionId }) => (
              <section id={cx('wrapper-ranks')} key={uuid()}>
                <TitlePath content={title} show={sectionId === 'hAlbum' ? false : true} onClick={() => handleNavigate(path.TOP_100)} />
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
                    993: {
                      slidesPerView: 5,
                    },
                  }}>
                  {items.map((album) => (
                    <SwiperSlide key={album.encodeId}>
                      <CardAlbum
                        onNavigatePlayList={() => handleNavigatePlayList(null, album.link.split('.')[0])}
                        onNavigateArtist={handleNavigate}
                        data={album}
                        currentUser={currentUser}
                        noTitle={true}
                        onAddPlayList={(e) => onAddPlayList(e, album)}
                        onRemovePlayList={(e) => onRemovePlayList(e, album.encodeId)}
                        themeApp={themeApp}
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
          <BoxSkeleton card={5} height={200} />
        </>
      )}
      {/* convert ve 1 arr de map no ra ung ? : neu dung thi map cac components neu sai map Skeleton */}
    </div>
  );
};

export default Home;
