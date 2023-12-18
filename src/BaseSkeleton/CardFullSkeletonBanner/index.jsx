import { v4 as uuid } from 'uuid';
import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames/bind';
import style from '../BaseSkeleton.module.scss';
const cx = classNames.bind(style);
const CardFullSkeletonBanner = () => {
  return (
    <div className={cx('banner-skeleton')}>
      <Skeleton key={uuid()} height={240} />
    </div>
  );
};

export default CardFullSkeletonBanner;
