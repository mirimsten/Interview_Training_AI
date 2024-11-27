import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const  [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // שליחת הנתונים לשרת
      const response = await axios.post('http://localhost:3001/users/signup', {
        username,
        email,
        password,
      });

      // הנתונים מהשרת כבר זמינים ב-response.data
      const data = response.data;

      // בדיקת סטטוס התגובה (למרות ש-axios זורק שגיאה אם הסטטוס אינו 2xx)
      if (response.status === 201) {
        alert('הרשמה בוצעה בהצלחה!');
        setUserName('');
        setEmail('');
        setPassword('');
      } else {
        alert(`שגיאה בהרשמה: ${data.error}`);
      }
    } catch (error) {
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
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
      <label>Username</label>
        <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
        />
        </div>
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
        <button type="submit">הרשם</button>
        <p>
        כבר קיים אצלנו? <a href="/login">התחבר</a>
      </p>
      </form>
    </div>
  );
};

export default SignUp;
