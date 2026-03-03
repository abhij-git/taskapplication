import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { WS_URL } from '../config';
import {
  addHighRiskAlert,
  addTransaction,
  fetchInitialData,
} from '../features/transactionsSlice';
import { logout } from '../features/authSlice';
import TransactionTable from './TransactionTable';
import RiskChart from './RiskChart';
import HighRiskAlerts from './HighRiskAlerts';

let socket;

function Dashboard() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { items, trend, highRiskAlerts, status, error } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (!token) return;

    dispatch(fetchInitialData());

    socket = io(WS_URL, {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('Connected to transaction stream');
    });

    socket.on('transaction', (payload) => {
      dispatch(addTransaction(payload));
    });

    socket.on('highRisk', (payload) => {
      dispatch(addHighRiskAlert(payload));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from transaction stream');
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">E‑commerce Fraud Monitor</h1>
          <p className="app-subtitle">
            Live transaction stream with AI‑based risk scoring.
          </p>
        </div>
        <div className="header-right">
          <div className="user-pill">
            <span className="user-email">{user?.email}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        {status === 'loading' && (
          <div className="banner info">Loading initial data…</div>
        )}
        {error && <div className="banner error">{error}</div>}

        <section className="grid-layout">
          <div className="grid-main">
            <TransactionTable transactions={items} />
          </div>
          <aside className="grid-side">
            <RiskChart trend={trend} />
            <HighRiskAlerts alerts={highRiskAlerts} />
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

