import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../services/authApi';
import { setAuth } from '../redux/authSlice';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
const { t } = useTranslation();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const res = await registerUser({ fullName, email, password });
    dispatch(setAuth(res.data));
    toast.success(t('toast_signup_success'));
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed');
  }
};

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
       <h2>{t('create_account')}</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          type="text"
         placeholder={t('full_name')}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
         placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="social-login-divider">
  <span>OR</span>
</div>

<div className="google-login-wrapper">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => setError('Google login failed')}
  />
</div>
        <button type="submit">{t('sign_up')}</button>
       <p>{t('already_have_account')} <a href="/login">{t('login')}</a></p>
      </form>
    </div>
  );
}

export default Signup;