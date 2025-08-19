import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

// fonts, variables
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/quickstarts/dist/quickstarts.css';

import './i18n/i18n';
import AppProps from './AppProps';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <AppProps showCardFooters={false} />
        }
      />
    </Routes>
  </BrowserRouter>,
);
