import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import EditProject from './pages/EditProject';
import CreateTicket from './pages/CreateTicket';
import AdminPanel from './pages/AdminPanel';
import TicketDetails from './pages/TicketDetails';
import Settings from './pages/Settings';
import Documentation from './pages/Documentation';
import NotificationManager from './components/NotificationManager';

function App() {
  return (
    <>
      <NotificationManager />
      <Routes>
      {/* Public Routes - Blocked if logged in */}
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/docs" element={<Documentation />} />
      
      {/* Protected Routes - Only accessible if logged in */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} />
        <Route path="/projects/edit/:projectId" element={<EditProject />} />
        <Route path="/projects/:projectId/new-ticket" element={<CreateTicket />} />
        <Route path="/ticket/:ticketId" element={<TicketDetails />} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
