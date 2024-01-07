import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthProvider } from '~/AuthProvider';
import { useParams, useNavigate } from 'react-router-dom';
// import { getCurrentAlbum } from '~/store/actions/dispatch';
import moment from 'moment';
import { apiDetailsPlayList } from '~/api';
import { CardAlbumSong, CardArtists, SingerInfo, SingerListSong } from '~/components';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import classNames from 'classnames/bind';
import style from './Album.module.scss';
import TitlePath from '~/utils/TitlePath';
import path from '~/router/path';
const cx = classNames.bind(style);
const Album = () => {
  const [playListData, setPlayListData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { currentSong, isPlay } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onPlaySong, onAddLikeSong, onRemoveLikeSong, onAddPlayList, onRemovePlayList } = handle;
  const { pid } = useParams();
  console.log(playListData);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  useEffect(() => {
    const getDetailsPlayList = async () => {
      try {
        const response = await apiDetailsPlayList(pid);
        // console.log(response);
        if (response.data?.err === 0) {
          setPlayListData(response.data.data);
          setIsLoading(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDetailsPlayList();
  }, [pid]);
  // console.log(playListData);
  const handleNavigate = (type, url) => {
    if (type === 1) return; // lam modal phat bai hat
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  // console.log(playListData.song);
  return (
    <div className={cx('container')}>
      {isLoading ? (
        <div className={cx('album')}>
          <div className={cx('album-content')}>
            <SingerInfo
              playListData={playListData}
              onNavigateArtist={handleNavigate}
              theme={themeApp}
              onAddPlayList={(e) => onAddPlayList(e, playListData)}
              onRemovePlayList={(e) => onRemovePlayList(e, playListData?.encodeId)}
              currentUser={currentUser}
              onPlaySong={() => onPlaySong(playListData?.song?.items[0], playListData?.song, playListData?.title)}
            />
            <div className={cx('wrapper')}>
              <SingerListSong playListData={playListData} />
              {playListData.song.items.map((song, index, arr) => (
                <CardAlbumSong
                  song={song}
                  currentSong={currentSong}
                  currentUser={currentUser}
                  onNavigateArtist={handleNavigate}
                  onNavigate={(e) => {
                    e.stopPropagation();
                    handleNavigate(null, song.album.link.split('.')[0]);
                  }}
                  isPlay={isPlay}
                  theme={themeApp}
                  key={song.encodeId}
                  onAddLikeSong={(e) => onAddLikeSong(e, song)}
                  onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
                  onPlaySong={() => onPlaySong(song, arr, playListData?.title)}
                />
              ))}
              <div className={cx('bottom-info')}>
                <span>{playListData?.song.total} bài hát</span>
                <span>•</span>
                <span>{moment.unix(playListData?.song.totalDuration, 'seconds').format('h [giờ] m [phút]')}</span>
              </div>
            </div>
          </div>
          <div className={cx('menu-artists')}>
            <TitlePath content='Nghệ Sĩ Tham Gia' />
            <div className={cx('wrapper-artists')}>
              {playListData?.artists.map((artist) => (
                <CardArtists
                  key={artist.id}
                  data={artist}
                  themeApp={themeApp}
                  onNavigate={() => handleNavigate(null, path.DETAILS_ARTIST.replace('/:name', artist.link))}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <CardFullSkeletonBanner />
          <BoxSkeleton card={5} height={200} />
        </>
      )}
    </div>
  );
};

export default Album;
