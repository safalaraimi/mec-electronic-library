import { createHashRouter } from 'react-router';
import LoginPage from './components/LoginPage';
import BookSearchPage from './components/BookSearchPage';
import BookDownloadPage from './components/BookDownloadPage';

export const router = createHashRouter([
  {
    path: '/',
    Component: BookSearchPage,
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/download/:bookId',
    Component: BookDownloadPage,
  },
]);
