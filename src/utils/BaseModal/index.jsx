import { useContext, useEffect, useState } from 'react';
import { Typography, Modal, Box, Avatar } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Scrollbar } from 'react-scrollbars-custom';
import { apiLyricSong } from '~/api';
import { AuthProvider } from '~/AuthProvider';
import { loading, modalSongErr } from '~/asset';
import Button from '../Button';
import { useForm } from 'react-hook-form';
import classNames from 'classnames/bind';
import { v4 as uuid } from 'uuid';
import style from './BaseModal.module.scss';
const cx = classNames.bind(style);
const BaseModal = (props) => {
  const [stateLyricSong, setStateLyricSong] = useState({
    data: [],
    isLoading: true,
  });
  const { onClose, open, reverseModal } = props;

  // reverseModal === true => description artist
  // reverseModal === false => song Error
  // isModalPlaylist === true && reverseModal === true => CreateAndEditPlaylist
  const { titleModal, themeApp, handle, isModalPlaylist, isModalDeleteShow, thumbnailM, desc, modalLyricSong } = useContext(AuthProvider);
  const { onCreatePlaylistAndEditName, onDeletePlaylist } = handle;
  const [isDisableButton, setIsDisableButton] = useState(true);
  const { handleSubmit, register, reset } = useForm();
  const handleSubmitForm = ({ name }) => {
    onCreatePlaylistAndEditName(name);
    reset(); // clear value
  };
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: [380, 400, 480],
    bgcolor: '#363636',
    borderRadius: '8px',
    boxShadow: 24,
    p: 3,
    outline: 'none',
  };
  useEffect(() => {
    if (!modalLyricSong?.isModalShowLyric) return;
    if (!stateLyricSong.isLoading) setStateLyricSong((prev) => ({ ...prev, isLoading: true, data: [] }));
    const getLyricSong = async () => {
      try {
        const response = await apiLyricSong(modalLyricSong?.encodeId);
        if (response.data?.err === 0) {
          setStateLyricSong((prev) => ({
            ...prev,
            data: response.data?.data?.sentences?.map((item) => `${item.words.map((it) => it.data).join(' ')}`) || [],
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getLyricSong();
    // eslint-disable-next-line
  }, [modalLyricSong?.isModalShowLyric]);
  const handleChangeInput = (e) => {
    if (e.target.value === '') {
      setIsDisableButton(true);
      return;
    }
    if (isDisableButton) setIsDisableButton(false);
  };
  if (modalLyricSong?.isModalShowLyric) {
    return (
      <Modal keepMounted open={open} onClose={onClose} aria-labelledby='keep-mounted-modal-title' aria-describedby='keep-mounted-modal-description'>
        <Box sx={style}>
          <Typography style={{ fontSize: '1.8rem', color: 'white', fontWeight: 700 }}>Lời Bài Hát </Typography>
          {stateLyricSong.isLoading ? (
            <Box sx={{ maxHeight: '300px', height: '300px', mt: 1 }}>
              <Box sx={{ height: 'calc(100% - 35px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={loading} alt='' style={{ width: 'calc(100% - 50%)' }} />
              </Box>
            </Box>
          ) : (
            <Box sx={{ maxHeight: '300px', height: '300px', mt: 1 }}>
              <Scrollbar
                style={{ height: 'calc(100% - 35px)' }}
                wrapperProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return <span {...restProps} ref={elementRef} style={{ inset: '0 0 10px 0' }} />;
                  },
                }}
                trackYProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '6px' }} />;
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
                          backgroundColor: '#49463f',
                          zIndex: '50',
                          position: 'relative',
                          borderRadius: '5px',
                        }}
                      />
                    );
                  },
                }}>
                <Box
                  sx={{
                    padding: '5px',
                    border: '1px solid hsla(0, 0%, 100%, 0.1)',
                    color: 'white',
                    backgroundColor: 'hsla(0, 0%, 100%, .03)',
                  }}>
                  <Typography id='keep-mounted-modal-description' sx={{ fontSize: '1.4rem' }} variant='inherit'>
                    <ul
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        padding: '12px 14px',
                      }}>
                      {stateLyricSong.data.map((item) => (
                        <li key={uuid()}>{item}</li>
                      ))}
                    </ul>
                  </Typography>
                </Box>
              </Scrollbar>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: '15px' }}>
                <Button content={'Đóng'} className='genre-select' style={{ fontSize: '1.3rem', padding: '9px 24px' }} onClick={onClose} />
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    );
  }
  if (isModalDeleteShow) {
    return (
      <Modal keepMounted open={open} onClose={onClose} aria-labelledby='keep-mounted-modal-title' aria-describedby='keep-mounted-modal-description'>
        <Box sx={{ ...style, padding: 0 }}>
          <Box sx={{ m: '20px' }}>
            <Box>
              <Typography
                variant='h3'
                sx={{
                  fontSize: '1.8rem',
                  color: '#fff',
                  mb: '10px',
                  fontWeight: 700,
                }}>
                Xóa Playlist
              </Typography>
              <p style={{ color: '#fff' }}>{titleModal}</p>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', mt: '15px' }}>
              <Button content='không' className='btn__playlist' onClick={onClose} />
              <Button
                content='có'
                className='btn__playlist'
                onClick={onDeletePlaylist}
                style={{ backgroundColor: themeApp && themeApp?.primaryColor }}
              />
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
  if (isModalPlaylist && reverseModal) {
    return (
      <Modal
        disableAutoFocus={true}
        keepMounted
        open={open}
        onClose={onClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'>
        <Box sx={style}>
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              cursor: 'pointer',
            }}>
            <CloseRoundedIcon fontSize='large' sx={{ color: 'white' }} />
          </div>
          <Box>
            <form id={cx('form')} onSubmit={handleSubmit(handleSubmitForm)}>
              <Typography variant='h3' fontSize={20} color='white' fontWeight={700}>
                {titleModal}
              </Typography>
              <input
                {...register('name', {
                  required: true,
                  onChange: handleChangeInput,
                  // value: 'oke',
                  // onBlur: () => reset(),
                })}
                // onChange:,
                className={cx('text__playlist')}
                type='text'
                placeholder='Nhập tên playlist'
                autoComplete='off'
              />
              <Button
                content='Tạo mới'
                disabled={isDisableButton}
                className='create__playlist'
                style={{ backgroundColor: themeApp?.primaryColor, borderColor: themeApp?.primaryColor }}
              />
            </form>
          </Box>
        </Box>
      </Modal>
    );
  }
  if (!reverseModal) {
    return (
      <Modal
        keepMounted
        open={open}
        onClose={() => {
          onClose();
          reset();
        }}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'>
        <Box sx={style}>
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              cursor: 'pointer',
            }}>
            <CloseRoundedIcon fontSize='large' sx={{ color: 'white' }} />
          </div>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px 0' }}>
            <img src={modalSongErr} alt='' style={{ objectFit: 'cover', width: '100%' }} />
            <Typography
              variant='h3'
              fontSize={24}
              fontWeight={700}
              letterSpacing={0.3}
              color='white'
              textTransform={'capitalize'}
              textAlign={'center'}>
              {titleModal}
            </Typography>
          </Box>
        </Box>
      </Modal>
    );
  }
  return (
    <Modal keepMounted open={open} onClose={onClose} aria-labelledby='keep-mounted-modal-title' aria-describedby='keep-mounted-modal-description'>
      <Box sx={style}>
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            cursor: 'pointer',
          }}>
          <CloseRoundedIcon fontSize='large' />
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px 0' }}>
          <Avatar alt='Remy Sharp' src={thumbnailM} sx={{ width: 110, height: 110 }} />
          <Typography variant='h3' fontSize={24} fontWeight={700} letterSpacing={0.3} color='white'>
            {titleModal}
          </Typography>
        </Box>
        <Box sx={{ maxHeight: '218px', height: '218px', mt: 3 }}>
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
                return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '6px' }} />;
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
                      backgroundColor: '#49463f',
                      zIndex: '50',
                      position: 'relative',
                      borderRadius: '5px',
                    }}
                  />
                );
              },
            }}>
            <Box sx={{ padding: '5px' }}>
              <Typography
                id='keep-mounted-modal-description'
                sx={{ fontSize: '1.4rem', color: 'hsla(0,0%,100%,0.5)' }}
                variant='inherit'
                dangerouslySetInnerHTML={{ __html: desc }}
              />
            </Box>
          </Scrollbar>
        </Box>
      </Box>
    </Modal>
  );
};

export default BaseModal;
