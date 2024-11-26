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
      const response = await axios.post('http://localhost:3001/signup', {username, email, password});
    //   const response = await fetch('http://localhost:3001/signup', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ username, email, password }),
    //   });

      const data = await response.json();

      if (response.ok) {
        alert('הרשמה בוצעה בהצלחה!');
        setUserName('');
        setEmail('');
        setPassword('');
      } else {
        alert(`שגיאה בהרשמה: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('אירעה שגיאה בשרת.');
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
      </form>
    </div>
  );
};

export default SignUp;
