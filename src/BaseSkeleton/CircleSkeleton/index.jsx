import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames/bind';
import style from '../BaseSkeleton.module.scss';
const cx = classNames.bind(style);
const CircleSkeleton = () => {
  return (
    <div className={cx('circle')}>
      <Skeleton borderRadius={4} circle style={{ width: '100%', height: '100%', display: 'inline-block' }} />
    </div>
  );
};

export default CircleSkeleton;
