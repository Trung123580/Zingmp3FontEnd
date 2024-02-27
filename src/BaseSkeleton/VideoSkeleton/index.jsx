import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames/bind';
import style from '../BaseSkeleton.module.scss';
const cx = classNames.bind(style);
const VideoSkeleton = () => {
  return (
    <div className={cx('video')}>
      <Skeleton height='100%' width='100%' />;
    </div>
  );
};

export default VideoSkeleton;
