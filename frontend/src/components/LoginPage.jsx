import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">E‑commerce Fraud Monitor</h1>
        <p className="app-subtitle">
          Sign in to view real‑time transactions and risk insights.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="error-banner">{error}</div>}

          <button
            type="submit"
            className="primary-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="demo-info">
            <p>Demo users:</p>
            <ul>
              <li>admin@example.com / Admin123!</li>
              <li>analyst@example.com / Analyst123!</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

