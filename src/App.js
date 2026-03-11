import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BudgetProvider, BudgetContext } from './contexts/BudgetContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(BudgetContext);
  return state.user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BudgetProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </BudgetProvider>
  );
}
export default App;