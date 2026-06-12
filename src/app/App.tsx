import { RouterProvider, createHashRouter, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import DashboardPage from "./components/dashboard/DashboardPage";
import BooksListPage from "./components/books/BooksListPage";
import AddBookPage from "./components/books/AddBookPage";
import EditBookPage from "./components/books/EditBookPage";
import BookDetailsPage from "./components/books/BookDetailsPage";
import DigitalLibraryPage from "./components/digital-library/DigitalLibraryPage";
import DigitalBookDetailsPage from "./components/digital-library/DigitalBookDetailsPage";

const router = createHashRouter([
  { path: "/login", Component: LoginPage },
  { path: "/signup", Component: SignUpPage },
  { path: "/forgot-password", Component: ForgotPasswordPage },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: "dashboard", Component: DashboardPage },
          { path: "books", Component: BooksListPage },
          { path: "books/add", Component: AddBookPage },
          { path: "books/:bookId", Component: BookDetailsPage },
          { path: "books/:bookId/edit", Component: EditBookPage },
          { path: "digital-library", Component: DigitalLibraryPage },
          { path: "digital-library/:bookId", Component: DigitalBookDetailsPage },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
