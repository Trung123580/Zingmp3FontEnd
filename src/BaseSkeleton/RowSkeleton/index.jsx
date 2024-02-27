import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames/bind';
import style from '../BaseSkeleton.module.scss';
const cx = classNames.bind(style);
const RowSkeleton = () => {
  return (
    <div className={cx('row')}>
      <Skeleton borderRadius={4} style={{ width: '100%', height: '100%', display: 'inline-block' }} />
    </div>
  );
};

export default RowSkeleton;
