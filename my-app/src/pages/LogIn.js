import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // שליחת הנתונים לשרת
      const response = await axios.post('http://localhost:3001/users/login', {
        email,
        password,
      });

      // הנתונים מהשרת כבר זמינים ב-response.data
      const data = response.data;

      // אם התחברות הצליחה
      if (response.status === 200) {
        alert('התחברת בהצלחה!');
      localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home'); // נווט לדף הבית או הדף הרצוי
      } else {
        alert(`שגיאה בהתחברות: ${data.error}`);
      }
    } 
    catch (error) {
      // טיפול בשגיאות
      console.error('Error:', error);

      // בדיקת שגיאה מהשרת
      if (error.response) {
        alert(`שגיאת שרת: ${error.response.data.error}`);
      } else {
        alert('אירעה שגיאה בשרת.');
      }
    }
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
