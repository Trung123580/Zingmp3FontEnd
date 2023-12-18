import ReactDOM from 'react-dom/client';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Provider } from 'react-redux';
import { AppProvider } from '~/AuthProvider';
import store from '~/store';
import App from '~/App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <AppProvider>
      <SkeletonTheme baseColor='rgba(0,0,0,0.05)' highlightColor='rgba(255, 255, 255, 0.1)'>
        <App />
      </SkeletonTheme>
    </AppProvider>
  </Provider>
);
