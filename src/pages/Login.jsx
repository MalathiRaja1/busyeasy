import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/authApi';
import { setAuth } from '../redux/authSlice';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../services/authApi';

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const res = await loginUser({ email, password });
    dispatch(setAuth(res.data));
    toast.success(t('toast_login_success'));
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await googleLogin(credentialResponse.credential);
    dispatch(setAuth(res.data));
    navigate('/');
  } catch (err) {
    setError('Google login failed');
  }
};
  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{t('login_title')}</h2>
        {error && <p className="auth-error">{error}</p>}
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
        <button type="submit">{t('login')}</button>
   <p>{t('dont_have_account')} <a href="/signup">{t('sign_up')}</a></p>

   <div className="social-login-divider">
  <span>OR</span>
</div>

<div className="google-login-wrapper">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => setError('Google login failed')}
  />
</div>
      </form>
    </div>
  );
}

export default Login;