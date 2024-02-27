import { memo } from 'react';
import { BoxSkeleton } from '~/BaseSkeleton';
import { CardVideo } from '~/components';
import classNames from 'classnames/bind';
import style from './ListMvArtists.module.scss';
const cx = classNames.bind(style);
const ListMvArtists = ({ item, onNavigateArtist, onNavigate, onOpenVideo, isLoadingListMV, path }) => {
  const mapItem = item?.filteredMvArtists || item;
  return (
    <div className={cx('menu__video')} style={{ display: isLoadingListMV && 'grid' }}>
      {isLoadingListMV ? (
        mapItem.map((data) => {
          return (
            <CardVideo
              key={data.encodeId}
              data={data}
              onNavigateArtist={onNavigateArtist}
              onNavigate={() => onNavigate(path.DETAILS_ARTIST.replace('/:name', data.artist.link))}
              onOpenVideo={() => onOpenVideo(data.link)}
            />
          );
        })
      ) : (
        <BoxSkeleton card={4} height={100} />
      )}
    </div>
  );
};

export default memo(ListMvArtists);
