import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import style from './NewMusic.module.scss';
import TitlePage from '~/utils/TitlePage';
import { newReleaseChart } from '~/api';
import { AuthProvider } from '~/AuthProvider';
import { CardAlbumSong } from '~/components';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { isScrollTop } from '~/store/actions/dispatch';
const cx = classNames.bind(style);
const NewMusic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSong, setDataSong] = useState(null);
  const { currentSong, isPlay } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onPlaySong, onAddLikeSong, onRemoveLikeSong, onActiveSong } = handle;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const response = await newReleaseChart();
      if (response?.data?.err === 0) {
        setIsLoading(true);
        setDataSong(response.data?.data);
        // mount se scrollTop = 0
        dispatch(isScrollTop(true));
      }
    })();
    return () => {
      dispatch(isScrollTop(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  const handleFirstPlaySong = () => onPlaySong(dataSong?.items[0], dataSong?.items, '#zingchart');
  if (!isLoading) {
    return (
      <div className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={4} height={200} />
      </div>
    );
  }
  return (
    <section className={cx('container')}>
      <TitlePage content='BXH nhạc mới' onClick={handleFirstPlaySong} />
      <div className={cx('menu')}>
        {dataSong?.items?.map((song, index, arr) => (
          <CardAlbumSong
            key={song?.encodeId}
            song={song}
            onActiveSong={(e) => onActiveSong(e, song)}
            currentSong={currentSong}
            currentUser={currentUser}
            onNavigateArtist={handleNavigate}
            onNavigate={() => handleNavigate(song.album.link.split('.')[0])}
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
      </div>
    </section>
  );
};

export default NewMusic;
