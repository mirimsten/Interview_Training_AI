// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState('');

  const jobOptions = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Cybersecurity Specialist',
    'Cloud Engineer',
    'QA Automation Engineer',
    'Embedded Software Engineer',
    'Game Developer',
    'Blockchain Developer',
    'Product Manager',
    'UI/UX Designer',
  ];

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/getQuestions', { jobTitle });
      setQuestions(response.data.questions);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setFeedback('');
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    const userAnswer = e.target.answer.value;

    const prompt = `השאלה: ${questions[currentQuestionIndex]}. התשובה שלך: ${userAnswer}. האם התשובה נכונה?`;
    try {
      const response = await axios.post('http://localhost:3001/getFeedback', { prompt });
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error getting feedback:", error);
    }

    // Update state for the next question
    setUserAnswers([...userAnswers, userAnswer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    e.target.reset(); // Clear the answer input field
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>מערכת הכנה לראיונות עבודה</h1>
      {/* Dropdown for job titles */}
      <form onSubmit={handleGenerateQuestions} style={{ marginBottom: '20px' }}>
        <label>
          <span>בחר תפקיד:</span>
          <select
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="" disabled>בחר תפקיד</option>
            {jobOptions.map((job, index) => (
              <option key={index} value={job}>{job}</option>
            ))}
          </select>
        </label>
        <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }}>
          בקש שאלות
        </button>
      </form>

      {/* Display questions and answer form */}
      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <div>
          <h2>שאלה {currentQuestionIndex + 1} מתוך {questions.length}:</h2>
          <p>{questions[currentQuestionIndex]}</p>
          <form onSubmit={handleSubmitAnswer} style={{ marginTop: '10px' }}>
            <textarea
              name="answer"
              placeholder="כתוב את התשובה שלך כאן..."
              style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px' }}
            ></textarea>
            <button type="submit" style={{ padding: '5px 20px' }}>שלח תשובה</button>
          </form>
          {feedback && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
              <strong>משוב:</strong>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      ) : questions.length > 0 ? (
        <p>סיימת את כל השאלות! כל הכבוד!</p>
      ) : null}
    </div>
  );
}

export default App;

