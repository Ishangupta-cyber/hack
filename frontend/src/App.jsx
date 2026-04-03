import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Heatmap from './pages/Heatmap';
import Insights from './pages/Insights';
import Complaints from './pages/Complaints';
import Eligibility from './pages/Eligibility';
import Simulation from './pages/Simulation';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
  return children;
};

/** Only allows Authority users; redirects Citizens to /eligibility */
const AdminOnly = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role !== 'Authority') return <Navigate to="/eligibility" replace />;
  return children;
};

/** Only allows Citizen users; redirects Authority to /dashboard */
const CitizenOnly = ({ children }) => {
  const role = localStorage.getItem('role');
  if (role !== 'Citizen') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page — portal selection */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth — role-specific routes */}
          <Route path="/login/:portalType" element={<Login />} />
          <Route path="/signup/:portalType" element={<Signup />} />

          {/* Protected App Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Authority-only routes */}
            <Route path="dashboard" element={<AdminOnly><Dashboard /></AdminOnly>} />
            <Route path="heatmap" element={<AdminOnly><Heatmap /></AdminOnly>} />
            <Route path="insights" element={<AdminOnly><Insights /></AdminOnly>} />
            <Route path="simulation" element={<AdminOnly><Simulation /></AdminOnly>} />

            {/* Citizen-only routes */}
            <Route path="eligibility" element={<CitizenOnly><Eligibility /></CitizenOnly>} />

            {/* Shared routes (both roles) */}
            <Route path="complaints" element={<Complaints />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
