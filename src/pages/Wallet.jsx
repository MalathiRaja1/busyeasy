import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getWalletBalance, getWalletTransactions } from '../services/api';

function Wallet() {
  const { t } = useTranslation();
  const { token } = useSelector(state => state.auth);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      Promise.all([getWalletBalance(), getWalletTransactions()])
        .then(([balRes, txRes]) => {
          setBalance(balRes.data.balance);
          setTransactions(txRes.data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (!token) {
    return <div className="orders-page"><p>{t('please_login_orders')} <Link to="/login">{t('login')}</Link></p></div>;
  }

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;

  return (
    <div className="wallet-page">
      <h2>{t('my_wallet')}</h2>

      <div className="wallet-balance-card">
        <span className="wallet-balance-label">{t('available_balance')}</span>
        <span className="wallet-balance-amount">₹{balance.toFixed(2)}</span>
      </div>

      <h3>{t('transaction_history')}</h3>
      {transactions.length === 0 ? (
        <p>{t('no_transactions')}</p>
      ) : (
        <div className="wallet-transactions">
          {transactions.map(tx => (
            <div key={tx.id} className="wallet-tx-item">
              <div className="wallet-tx-info">
                <span className="wallet-tx-type">{tx.type}</span>
                <span className="wallet-tx-desc">{tx.description}</span>
                <span className="wallet-tx-date">{new Date(tx.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={`wallet-tx-amount ${tx.amount > 0 ? 'credit' : 'debit'}`}>
                {tx.amount > 0 ? '+' : ''}₹{tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wallet;