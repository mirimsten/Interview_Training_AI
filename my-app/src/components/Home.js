import React, { useState, useEffect } from 'react';
//import { Navigate, BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css'
//import { createInterview } from '../../../server/models/interviewModel';
//import { getUserByEmail } from '../../../server/models/userModel';
function Home() {
  const [user, setUser] = useState(null); // State to store user details
  //const [userId, setUserId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const[jobId, setJobId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [allFeedbacks, setAllFeedbacks] = useState([]); // New state to store all individual feedbacks
  const [loading, setLoading] = useState(false); // Loading state
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [jobOptions, setJobOptions] = useState([]);

// const user = JSON.parse(localStorage.getItem('user'));
// const userEmail = user ? user.email : ''; // שליפה פשוטה של המייל
// console.log("User email from localStorage:", userEmail);

  // Fetch user details from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
         setUser(savedUser);
         console.log("המשתמש שנשמר:" + JSON.stringify(savedUser));
       }

  }, []);

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getJobTitles');
        setJobOptions(response.data.jobTitles.map(job => job.skill_name));
        setJobId(response.data.jobTitles.map(job => job.skill_id));
      } catch (error) {
        console.error("Error fetching job titles:", error);
      }
    };

    fetchJobTitles();
  }, []);


// const getUserByEmail = async (e) =>{
//   e.preventDefault();
//     setLoading(true);
//     //const user_email = user.email;
//     const user_email = JSON.stringify(user.email);
//     let cleanedEmail = user_email.replace(/^"|"$/g, '');
//      console.log(cleanedEmail);
//     try {
//       const response = await axios.get('http://localhost:3001/users/getUserByEmail', {
//         params: { email: cleanedEmail }, // השתמש ב-"params" במקום ב-"body" עבור קריאות GET
//       });
//       const userId = response.data.user_id; // הנחה שהתוצאה היא מערך
//       console.log("vhh"+ userId);
//       return userId;
//     } 
//     catch(error){
//       console.error("Error fetching questions:", error);
//     }finally {
//       setLoading(false);
//     }
// };

const createInterview = async (e) =>{
  e.preventDefault();
    setLoading(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const userId = JSON.stringify(user.id);
      console.log("Current date being sent:", currentDate);
      console.log("User ID being sent:", userId);

      const response = await axios.post('http://localhost:3001/interviews/createInterview', {
        userId,
        jobId,
        interview_date: currentDate,
      });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setLoading(false); // לעצור את ההטענה בכל מקרה
    }
}

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/questions/getQuestions', { jobTitle });
      setQuestions(response.data.questions);
      //setUserId(getUserByEmail(e));
      //console.log("userId is!!:", userId);
      const newInterview = createInterview(e);
      //לשלוח פה את השאלות לטבלת השאלות אבל צריך id של המשתמש ושל הראיון
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setFeedback('');
      setAllFeedbacks([]); // Reset all feedback when new questions are loaded
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userAnswer = e.target.answer.value;
    const prompt = `השאלה: ${questions[currentQuestionIndex]}. התשובה שלך: ${userAnswer}. תן את חוות דעתך על התשובה האם היא נכונה ומה צריך לשפר בה תשתדל שתשובתך תהיה באורך 5 שורות מקסימום`;
    try {
      const response = await axios.post('http://localhost:3001/getFeedback', { prompt });
      setFeedback(response.data.feedback);
      setAllFeedbacks([...allFeedbacks, response.data.feedback]); // Collect all feedback
    } catch (error) {
      console.error("Error getting feedback:", error);
    } finally {
      setUserAnswers([...userAnswers, userAnswer]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      e.target.reset();
      setLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    setLoading(true);
    const overallFeedbackPrompt = `הנה כל המשובים על תשובות המועמד: \n${allFeedbacks.join("\n")}\nבהתבסס על המשובים, תן לי משוב כללי על הראיון.`;
    try {
      const response = await axios.post('http://localhost:3001/getFeedback', { prompt: overallFeedbackPrompt });
      setFeedback(response.data.feedback); // Display overall feedback
      setShowFinalFeedback(true)
    } catch (error) {
      console.error("Error getting overall feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestartInterview = () => {
    setJobTitle('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setFeedback('');
    setAllFeedbacks([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>מערכת הכנה לראיונות עבודה</h1>
      {/* Only show job selection if no questions are loaded */}
      {!questions.length && (
        <form onSubmit={handleGenerateQuestions} style={{ marginBottom: '20px' }}>
          <label>
            <span>בחר תפקיד:</span>
            <select
              value={jobTitle}
              onChange={(e) => {
                setJobTitle(e.target.value);
              }}
              style={{ marginLeft: '10px', padding: '5px' }}
              disabled={loading}
            >
              <option value="" disabled>בחר תפקיד</option>
              {jobOptions.map((job, index) => (
                <option key={index} value={job}>{job}</option>
              ))}
            </select>
          </label>
          <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }} disabled={loading}>
            {loading ? 'טוען...' : 'בקש שאלות'}
          </button>
        </form>
      )}

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
              disabled={loading}
            ></textarea>
            <button type="submit" style={{ padding: '5px 20px' }} disabled={loading}>
              {loading ? 'טוען...' : 'שלח תשובה'}
            </button>
          </form>
          {feedback && (
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
              <strong>משוב:</strong>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      ) : questions.length > 0 && currentQuestionIndex === questions.length ? (
        <div>
          <p>סיימת את כל השאלות! כל הכבוד!</p>
          <button onClick={handleFinishInterview} style={{ padding: '5px 20px', marginTop: '10px' }}>
            קבל משוב כללי על הראיון
          </button>
          <button onClick={handleRestartInterview} style={{ padding: '5px 20px', marginTop: '10px', marginLeft: '10px' }}>
            בחר ראיון נוסף
          </button>
          {showFinalFeedback && (<p>{feedback}</p>)}
        </div>
      ) : null}

      {/* Show loading spinner */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Home;
