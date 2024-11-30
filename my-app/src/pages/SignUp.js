import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../css/SignUp.css"
const SignUp = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/users/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        const user = response.data.user;
        alert('הרשמה בוצעה בהצלחה!');
        setUserName('');
        setEmail('');
        setPassword('');
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      } else {
        alert(`שגיאה בהרשמה: ${response.data.error}`);
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
    <div id="form">
      <h1>הרשמה</h1>
      <form onSubmit={handleSubmit}>
        <label>שם משתמש:</label>
        <input
          type="text"
          placeholder="הכנס שם משתמש"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
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
        <button type="submit">הרשם</button>
        <p>
          כבר קיים אצלנו? <a href="/login">התחבר</a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
