import './App.css';
import { useSelector } from 'react-redux';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <LoginPage />;
  }

  return <Dashboard />;
}

export default App;

