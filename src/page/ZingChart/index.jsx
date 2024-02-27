import { useEffect, useState, useContext } from 'react';
import { CardAlbumSong, LineChart } from '~/components';
import { chartHome } from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import style from './ZingChart.module.scss';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { AuthProvider } from '~/AuthProvider';
import { getChartHome } from '~/store/actions/dispatch';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Button from '~/utils/Button';
import path from '~/router/path';
const cx = classNames.bind(style);
const ZingChart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSong, setDataSong] = useState(null);
  const { currentSong, isPlay, chartData } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onPlaySong, onAddLikeSong, onRemoveLikeSong, onActiveSong } = handle;
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRanks = pathname.split('/').filter((item) => item !== '').length - 1;
  // console.log(dataSong);
  // console.log(chartData);
  useEffect(() => {
    (async () => {
      const response = await chartHome();
      // console.log(response);
      if (response.data?.err === 0) {
        setIsLoading(true);
        setDataSong({
          ...response.data?.data,
          RTChart: {
            ...response.data.data?.RTChart,
            items: response.data.data?.RTChart.items.filter((item, index) => index < 10),
          },
        });
        dispatch(getChartHome(response));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isRanks) {
    return <Outlet />;
  }
  if (!isLoading && !dataSong) {
    return (
      <div className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={5} height={200} />
      </div>
    );
  }
  const handleNavigate = (type, url) => {
    if (type === 1) return; // lam modal phat bai hat
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  const handleShowChartsRank = () => {
    setDataSong({ ...dataSong, RTChart: { ...chartData } });
  };
  const handleNavigateChartRanks = (country) => {
    navigate(`${path.ZING_CHART + path.ZING_CHART_RANKS.replace(':country', country)}`); // xoa /:country di de thay the
  };
  return (
    <section className={cx('container')}>
      <Outlet />
      <div className={cx('zing-chart')}>
        <div className='chart' style={{ height: '500px' }}>
          <LineChart chartData={chartData} />
        </div>
        <div className={cx('menu')}>
          {dataSong?.RTChart?.items?.map((song, index, arr) => (
            <CardAlbumSong
              key={song?.encodeId}
              song={song}
              onActiveSong={(e) => onActiveSong(e, song)}
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
              hiddenIconMusic={true}
            />
          ))}
          {dataSong.RTChart.items.length > 10 ? (
            ''
          ) : (
            <div className={cx('btn-chart')}>
              <Button content='Xem tất cả' onClick={handleShowChartsRank} className='show-charts' />
            </div>
          )}
        </div>
        <div className={cx('charts')}>
          <h2 onClick={() => handleNavigateChartRanks('vn')}>Bảng Xếp Hạng Tuần</h2>
          <div className={cx('wrapper-charts')}>
            {Object.values(dataSong.weekChart)
              .map((item) => ({
                ...item,
                title:
                  item.country === 'vn'
                    ? `#zingchart Tuần ${item.week}, ${item.year}`
                    : item.country === 'us'
                    ? 'Bảng Xếp Hạng Bài Hát Âu Mỹ'
                    : 'Bảng Xếp Hạng Bài Hát Hàn',
              }))
              .map(({ chartId, country, items, title }) => (
                <div key={chartId} className={cx('card')}>
                  <h3 className={cx('title')}>{country === 'vn' ? 'Việt Nam' : country === 'us' ? 'US-UK' : 'K-Pop'}</h3>
                  <div className={cx('list-song')}>
                    {items.map((song, index, arr) => {
                      if (index < 5) {
                        return (
                          <CardAlbumSong
                            key={song?.encodeId}
                            song={song}
                            onActiveSong={(e) => onActiveSong(e, song)}
                            currentSong={currentSong}
                            currentUser={currentUser}
                            onNavigateArtist={handleNavigate}
                            onNavigate={() => handleNavigate(null, song.album.link.split('.')[0])}
                            isPlay={isPlay}
                            theme={themeApp}
                            onAddLikeSong={(e) => onAddLikeSong(e, song)}
                            onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
                            onPlaySong={() => onPlaySong(song, arr, title)}
                            index={index + 1}
                            status={song?.rakingStatus}
                            chartIndex={true}
                            hiddenSongTitle={true}
                            hiddenIconMusic={true}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className={cx('btn-chart')}>
                    <Button content='Xem tất cả' className='show-charts' onClick={() => handleNavigateChartRanks(country)} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZingChart;
