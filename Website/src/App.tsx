import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import BroadcastPage from './pages/BroadcastPage';
import JourneysPage from './pages/JourneysPage';
import ManageRoutePage from './pages/ManageRoutePage';
import CancelSeatPage from './pages/CancelSeatPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/broadcast" element={<BroadcastPage />} />
        <Route path="/journeys" element={<JourneysPage />} />
        <Route path="/manage/:id" element={<ManageRoutePage />} />
        <Route path="/cancel/:id" element={<CancelSeatPage />} />
        <Route path="/confirmed/:id" element={<ConfirmationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
