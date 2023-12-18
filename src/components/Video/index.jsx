import { useEffect, useState } from 'react';
import { apiVideoArtist } from '~/api';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import Button from '~/utils/Button';
import classNames from 'classnames/bind';
import style from './Video.module.scss';
import { getDataVideo } from '~/store/actions/dispatch';
import { TbWindowMinimize } from 'react-icons/tb';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';
import path from '~/router/path';
const cx = classNames.bind(style);
const Video = () => {
  const { dataVideo } = useSelector((state) => state.app);
  const [isLoading, setIsLoading] = useState(false);
  const { videoId, titleVideo, name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(dataVideo);
  //   if (!dataVideo?.type) {
  //     return null;
  //   }
  useEffect(() => {
    (async () => {
      const response = await apiVideoArtist(videoId);
      if (response.data.err === 0) {
        setIsLoading(true);
        dispatch(getDataVideo(response));
      }
    })();
  }, [videoId]);
  const handleNavigate = (url) => {
    const index = url
      .split('/')
      .filter((item) => item !== 'nghe-si')
      .findLastIndex((item) => item);
    if (!(url.split('/').filter((item) => item !== 'nghe-si')[index] === name)) {
      navigate(
        url
          .split('/')
          .filter((item) => item !== 'nghe-si')
          .join('/')
      );
    }
  };
  if (!isLoading) {
    return (
      <div className={cx('video-modal-loading')}>
        <div className={cx('container')} style={{ marginTop: '0' }}>
          <CardFullSkeletonBanner />
          <BoxSkeleton card={5} height={200} />
        </div>
      </div>
    );
  }
  return (
    <>
      {videoId && titleVideo && isLoading && (
        <section className={cx('video-modal')}>
          <Scrollbar
            wrapperProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <span {...restProps} ref={elementRef} style={{ inset: '0 0 10px 0' }} />;
              },
            }}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '4px' }} />;
              },
            }}
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                return (
                  <div
                    {...restProps}
                    ref={elementRef}
                    className='tHuMbY'
                    style={{
                      width: '100%',
                      backgroundColor: 'hsla(0,0%,100%,0.3)',
                      zIndex: '50',
                      position: 'relative',
                      borderRadius: '5px',
                    }}
                  />
                );
              },
            }}>
            <div className={cx('wrapper-video')}>
              <div className={cx('header')}>
                <div className={cx('header-left')}>
                  <div className={cx('avatar')}>
                    <img src={dataVideo.artist.thumbnail} alt={dataVideo.artist.name} />
                  </div>
                  <div className={cx('name')}>
                    <h2>{dataVideo.title}</h2>
                    <div className={cx('artists')}>
                      {dataVideo?.artists?.map(({ name, id, link, spotlight }, index, arr) => (
                        <span key={id} onClick={() => handleNavigate(path.DETAILS_ARTIST.replace('/:name', link))}>
                          {name}
                          {spotlight && <StarRateRoundedIcon />}
                          {`${index === arr.length - 1 ? '' : ','}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={cx('action-video')}></div>
                </div>
                <div className={cx('header-right')}>
                  <Button icon={<TbWindowMinimize />} className='video-btn' />
                  <Button icon={<CloseRoundedIcon />} className='video-btn' onClick={() => navigate(-1)} />
                </div>
              </div>
              <div className={cx('content')}>
                <div className={cx('video-player')}>
                  <video src=''></video>
                </div>
                <div className={cx('queue-player')}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, harum accusantium. Provident, sapiente vitae eveniet neque suscipit
                  sequi repudiandae similique! Deleniti quibusdam aspernatur et vel! Repudiandae quam quibusdam rem pariatur? Facere enim repudiandae
                  recusandae amet a perferendis repellendus vel vitae obcaecati saepe temporibus nobis asperiores suscipit in laboriosam iusto
                  deleniti ducimus animi aliquid, odit quia facilis id earum dolore! Nobis. Deserunt veritatis natus sit nesciunt veniam eveniet
                  incidunt, illo perspiciatis quos laboriosam iusto magnam amet repudiandae id repellendus modi necessitatibus eum aperiam. Rem
                  mollitia numquam aliquam perspiciatis aliquid quam eum. Rerum sapiente assumenda maxime, eum qui sint rem illo animi neque ullam
                  quis ipsam laudantium sequi dignissimos? Laudantium veniam accusantium mollitia inventore odio, aut incidunt totam doloribus tempore
                  sequi excepturi. Asperiores iusto, atque explicabo qui consectetur quisquam eius assumenda doloribus necessitatibus quis labore
                  sapiente! Distinctio quisquam, consectetur neque quas iste quis ratione aliquid nihil, sit itaque eum animi quibusdam reiciendis.
                </div>
              </div>
            </div>
          </Scrollbar>
        </section>
      )}
    </>
  );
};

export default Video;
