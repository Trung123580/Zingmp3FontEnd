import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './Top100.module.scss';
import { apiTop100 } from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import { Autoplay, Keyboard } from 'swiper/modules';
import { isScrollTop } from '~/store/actions/dispatch';
import BannerTop100 from './BannerTop100';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import TitlePath from '~/utils/TitlePath';
import { v4 as uuid } from 'uuid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CardAlbum } from '~/components';
import { AuthProvider } from '~/AuthProvider';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
const Top100 = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onAddPlayList, onRemovePlayList } = handle;
  const [stateTop100, setStateTop100] = useState({
    data: [],
    isLoading: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const getApiTop100 = async () => {
      const response = await apiTop100();
      if (response?.data?.err === 0) {
        setStateTop100((prev) => ({ ...prev, data: response.data.data, isLoading: true }));
        dispatch(isScrollTop(true));
      }
    };
    getApiTop100();
    return () => {
      dispatch(isScrollTop(true));
    };
    // eslint-disable-next-line
  }, []);
  // navigate
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
  console.log(stateTop100.data);
  if (!stateTop100.isLoading) {
    return (
      <div className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={4} height={200} />
      </div>
    );
  }
  return (
    <section className={cx('container')}>
      <div id={cx('top-100')}>
        <div className={cx('banner')}>
          <BannerTop100 />
        </div>
        {stateTop100.data?.map((album) => (
          <section id={cx('wrapper-album')} key={uuid()}>
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
                    onNavigatePlayList={() => handleNavigatePlayList(null, album.link.split('.')[0])}
                    onNavigateArtist={handleNavigate}
                    data={album}
                    onAddPlayList={(e) => onAddPlayList(e, album)}
                    onRemovePlayList={(e) => onRemovePlayList(e, album.encodeId)}
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
    </section>
  );
};

export default Top100;
