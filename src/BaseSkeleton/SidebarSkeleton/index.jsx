import Skeleton from 'react-loading-skeleton';
import classNames from 'classnames/bind';
import style from '../BaseSkeleton.module.scss';
const cx = classNames.bind(style);
function SidebarSkeleton() {
  return (
    <div className={cx('slider-skeleton')}>
      <Skeleton circle width={24} height={24} />
      <Skeleton height={20} width={150} borderRadius={4} className={cx('hide-table-mobile')} />
      {/*   // count={3} so dong hien thi */}
    </div>
  );
}

export default SidebarSkeleton;
