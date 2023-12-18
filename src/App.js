import { useContext } from 'react';
import { AuthProvider } from '~/AuthProvider';
import { Scrollbar } from 'react-scrollbars-custom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerQueue, Sidebar, Header, MusicBar } from '~/layout';
import { router } from '~/router';
import { AddSuccess } from './components';
import { backgroundDefault } from '~/asset';
import 'react-loading-skeleton/dist/skeleton.css';
import 'tippy.js/dist/tippy.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './App.scss';

function App() {
  const { themeApp } = useContext(AuthProvider);
  const thumbStyles = {
    width: '100%',
    backgroundColor: 'hsla(0,0%,100%,0.3)',
    zIndex: '10',
    position: 'relative',
    borderRadius: '5px',
  };
  return (
    <Router>
      <main id='app' style={{ backgroundImage: `url(${(themeApp && themeApp.backgroundApp) || backgroundDefault})` }}>
        <Header />
        <Sidebar />
        <Scrollbar
          style={{ height: 'auto' }}
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
                  style={{ ...restProps.style, height: 'calc(100vh - 90px)', right: '0' }}
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
        <AddSuccess />
      </main>
    </Router>
  );
}

export default App;
