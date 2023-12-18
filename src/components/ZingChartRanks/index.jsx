import classNames from 'classnames/bind';
import style from './ZingChartRanks.module.scss';
import { useSelector } from 'react-redux';
import { useContext, useState } from 'react';
import { CardAlbumSong } from '~/components';
import { navChart } from '~/utils/constant';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { Scrollbar } from 'react-scrollbars-custom';
import { AuthProvider } from '~/AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
const cx = classNames.bind(style);
const ZingChartRanks = () => {
  const { country } = useParams();
  const [active, setActive] = useState(() => {
    if (country) return country;
    return 'vn';
  });
  const { chartData, isPlay, currentSong, currentUser } = useSelector((state) => state.app);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onAddLikeSong, onRemoveLikeSong, onPlaySong } = handle;
  const navigate = useNavigate();
  console.log(country);
  const handleNavigate = (type, url) => {
    if (type === 1) return; // lam modal phat bai hat
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  if (!chartData) {
    return (
      <div className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={5} height={200} />
      </div>
    );
  }
  return (
    <section className={cx('container')}>
      <div className={cx('wrapper-ranks')}>
        <h2>Bảng Xếp Hạng Tuần</h2>
        <nav className={cx('nav')}>
          <ul className={cx('list')}>
            {navChart.map(({ path, name, id }) => (
              <li key={id} className={cx({ active: active === path })} onClick={() => setActive(path)}>
                {name}
              </li>
            ))}
          </ul>
        </nav>
        <div className={cx('menu')}>
          <Scrollbar
            wrapperProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <span {...restProps} ref={elementRef} style={{ inset: '0 0 10px 0' }} />;
              },
            }}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '4px' }} />;
              },
            }}
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    className='tHuMbY'
                    style={{
                      width: '100%',
                      backgroundColor: 'hsla(0,0%,100%,0.3)',
                      zIndex: '50',
                      position: 'relative',
                      borderRadius: '5px',
                    }}
                  />
                );
              },
            }}>
            {Object.values(chartData?.weekChart).map((item) => {
              if (item.country === active) {
                return item.items.map((song, index, arr) => {
                  return (
                    <CardAlbumSong
                      key={song?.encodeId}
                      song={song}
                      currentSong={currentSong}
                      currentUser={currentUser}
                      onNavigateArtist={handleNavigate}
                      onNavigate={() => handleNavigate(null, song.album.link.split('.')[0])}
                      isPlay={isPlay}
                      theme={themeApp}
                      onAddLikeSong={(e) => onAddLikeSong(e, song)}
                      onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
                      onPlaySong={() => onPlaySong(song, arr, '#zingchart')}
                      index={index + 1}
                      status={song?.rakingStatus}
                      chartIndex={true}
                    />
                  );
                });
              }
              return null;
            })}
          </Scrollbar>
        </div>
      </div>
    </section>
  );
};

export default ZingChartRanks;
