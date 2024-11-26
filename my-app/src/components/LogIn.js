import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // לוגיקה להתחברות (ניתן להוסיף בקשה לשרת כאן)
    onLogin();
    navigate('/home');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>כניסה</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">התחבר</button>
      </form>
      <p>
        אין לך חשבון? <a href="/signup">צור חשבון חדש</a>
      </p>
    </div>
  );
};

export default Login;
