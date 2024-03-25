import classNames from 'classnames/bind';
import style from './Mv.module.scss';
import TitlePath from '~/utils/TitlePath';
import { useContext } from 'react';
import { SearchProvider } from '../ContextSearch';
import { CardVideo } from '~/components';
import { modalSongErr } from '~/asset';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import path from '~/router/path';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
const Mv = () => {
  const { stateSearch } = useContext(SearchProvider);
  const { isLoading, isError, searchData } = stateSearch;
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
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
  return (
    <div className={cx('mv')}>
      <TitlePath content={'MV'} />
      <div className={cx('list')}>
        {(searchData?.videos || []).map((video) => (
          <CardVideo
            data={video}
            key={video?.encodeId}
            onNavigate={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', video?.artist?.link))}
            onNavigateArtist={handleNavigate}
            onOpenVideo={() => handleNavigateVideo(video?.link, video?.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default Mv;
