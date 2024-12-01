import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../css/SignUp.css"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/users/login', {
        email,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        //alert('התחברת בהצלחה!');
        const userData = {
          id: data.user.user_id,
          username: data.user.username,
          email: data.user.email,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/home');
      } else {
        alert(`שגיאה בהתחברות: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        alert(`שגיאת שרת: ${error.response.data.error}`);
      } else {
        alert('אירעה שגיאה בשרת.');
      }
    }
  };

  return (
    <div className="form-container">
    <form className='signupform' onSubmit={handleSubmit}>
      <h1>כניסה</h1>
      
        <label>אימייל:</label>
        <input
          type="email"
          placeholder="הכנס כתובת אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>סיסמה:</label>
        <input
          type="password"
          placeholder="הכנס סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">התחבר</button>
      
      <p className='signlogin'>
        אין לך חשבון? <a href="/signup">צור חשבון חדש</a>
      </p>
      </form>
    </div>
  );
};

export default Login;
