import { useContext } from 'react';
import { Typography, Modal, Box, Avatar } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Scrollbar } from 'react-scrollbars-custom';
import { AuthProvider } from '~/AuthProvider';
import { modalSongErr } from '~/asset';

const BaseModal = (props) => {
  const { name, thumbnail, desc, onClose, open, reverseModal } = props;
  // reverseModal === true => description artist
  // reverseModal === false => song Error
  const { titleModal } = useContext(AuthProvider);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: [380, 400, 480],
    bgcolor: '#605C52',
    borderRadius: '8px',
    boxShadow: 24,
    p: 3,
    outline: 'none',
  };
  if (reverseModal) {
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
            <Avatar alt='Remy Sharp' src={thumbnail} sx={{ width: 110, height: 110 }} />
            <Typography variant='h3' fontSize={24} fontWeight={700} letterSpacing={0.3} color='white'>
              {name}
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
          <img src={modalSongErr} alt='' style={{ objectFit: 'cover', width: '100%' }} />
          <Typography variant='h3' fontSize={24} fontWeight={700} letterSpacing={0.3} color='white'>
            {titleModal}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default BaseModal;
