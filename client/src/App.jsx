import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';
import ProfileUpload from './pages/ProfileUpload';
import UserProfile from './pages/UserProfile';
import Feed from './pages/Feed';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Unprotected routes */}
          <Route path="/" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* Protected routes */}
          <Route 
            path="/feed" 
            element={
              <PrivateRoute>
                <Feed />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <PrivateRoute>
                <EditPost />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile/upload" 
            element={
              <PrivateRoute>
                <ProfileUpload />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}

export default App;
