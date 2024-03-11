import { useContext, useEffect, useRef } from 'react';
import { AuthProvider } from '~/AuthProvider';
import { Scrollbar } from 'react-scrollbars-custom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerQueue, Sidebar, Header, MusicBar } from '~/layout';
import { router } from '~/router';
import { LyricSong, PortalModal } from './components';
import { backgroundDefault } from '~/asset';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import 'tippy.js/dist/tippy.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './App.scss';
import { ToastContainer } from 'react-toastify';

import { useSelector } from 'react-redux';
import BaseModal from './utils/BaseModal';

function App() {
  const { themeApp, isShowPortal, coords, handle, isOpenLyricSong, isOpenModal, currentModal } = useContext(AuthProvider);
  const { isScrollTop } = useSelector((state) => state.auth);
  const { onActiveSong, onCloseModal } = handle;
  const refScroll = useRef(null);
  const thumbStyles = {
    width: '100%',
    backgroundColor: 'hsla(0,0%,100%,0.3)',
    zIndex: '10',
    position: 'relative',
    borderRadius: '5px',
  };
  useEffect(() => {
    if (!coords?.isShowPortal) return;
    const handleClickOutside = () => {
      onActiveSong(null, null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (refScroll.current && isScrollTop) {
      refScroll.current.scrollTop = 0;
    }
  }, [refScroll, isScrollTop]);
  return (
    <Router>
      <main id='app' style={{ backgroundImage: `url(${(themeApp && themeApp.backgroundApp) || backgroundDefault})` }}>
        <Header />
        <Sidebar />
        <Scrollbar
          ref={refScroll}
          onScroll={() => {
            if (coords?.isShowPortal) {
              onActiveSong(null, null);
            }
          }}
          disableTrackYMousewheelScrolling
          trackXProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return <span {...restProps} ref={elementRef} className='TrackX' style={{ display: 'none' }} />;
            },
          }}
          thumbXProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return <span {...restProps} ref={elementRef} className='ThUmBX' style={{ display: 'none' }} />;
            },
          }}
          trackYProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return (
                <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '4px', height: 'calc(100vh - 20px)' }} />
              );
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
                    ...thumbStyles,
                  }}
                />
              );
            },
          }}
          wrapperProps={{
            renderer: (props) => {
              const { elementRef, ...restProps } = props;
              return (
                <div
                  {...restProps}
                  ref={elementRef}
                  style={{ ...restProps.style, height: 'calc(100vh - 90px)' }}
                  className='MyAwesomeScrollbarsWrapper'
                  id='myScrollbar'
                />
              );
            },
          }}>
          <Routes>
            {router.map(({ id, path, component: Component, insideRoute }) => (
              <Route path={path} element={<Component />} key={id}>
                {!!insideRoute &&
                  insideRoute.map(({ id, path: pathInside, component: ComponentInside }) => {
                    return <Route key={id} path={pathInside} element={<ComponentInside />} />;
                  })}
              </Route>
            ))}
          </Routes>
        </Scrollbar>
        <MusicBar />
        <PlayerQueue />
        {isShowPortal && <PortalModal />}
        {isOpenLyricSong && <LyricSong />}
        <BaseModal reverseModal={currentModal} open={isOpenModal} onClose={onCloseModal} />
        <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
          bodyClassName='toast-message'
          // transition={0.3}
        />
      </main>
    </Router>
  );
}

export default App;
