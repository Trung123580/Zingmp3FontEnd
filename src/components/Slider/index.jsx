import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Navigation } from 'swiper/modules';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames/bind';
import style from './Slider.module.scss';
const cx = classNames.bind(style);
const Slider = ({ banner, onNavigatePlayList }) => {
  return (
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
      {banner?.items.map((slide) => (
        <SwiperSlide key={uuid()}>
          <img src={slide.banner} className={cx('img-banner')} alt='error' onClick={() => onNavigatePlayList(slide.type, slide.link.split('.')[0])} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
