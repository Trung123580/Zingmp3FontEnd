import classNames from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import { v4 as uuid } from 'uuid';
import style from '../BaseSkeleton.module.scss';
const cx = classNames.bind(style);
function BoxSkeleton({ card, height }) {
  return (
    <div
      className={cx('wrapper-album-skeleton')}
      style={{
        gridTemplateColumns: ` repeat(${Array(card).fill(0).length}, 1fr)`,
      }}>
      {Array(card)
        .fill(0)
        .map(() => (
          <div className={cx('card')} key={uuid()}>
            <Skeleton height={30} />
            <Skeleton height={height} />
          </div>
        ))}
    </div>
  );
}

export default BoxSkeleton;
