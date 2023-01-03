import './locales/i18n';
// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CollapseDrawerProvider } from './context/CollapseDrawerContext';
import { SettingsProvider } from './context/SettingsContext';

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <SettingsProvider>
      <CollapseDrawerProvider>
        <Router>
          <App />
        </Router>
      </CollapseDrawerProvider>
    </SettingsProvider>
  </HelmetProvider>
);

// If you want to enable client cache, register instead.
serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
