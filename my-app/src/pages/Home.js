import React, { useState, useEffect } from 'react';
//import { Navigate, BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import '../css/home.css'
//import '../App.css'
//import { createInterview } from '../../../server/models/interviewModel';
//import { getUserByEmail } from '../../../server/models/userModel';
function Home() {
  const [user, setUser] = useState(null); // State to store user details
  const [interviewId, setInterviewId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobId, setJobId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [allFeedbacks, setAllFeedbacks] = useState([]); // New state to store all individual feedbacks
  const [loading, setLoading] = useState(false); // Loading state
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [jobOptions, setJobOptions] = useState([]);
  const [createdQuestions, setCreatedQuestions] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
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
        //setJobOptions(response.data.jobTitles.map(job => job.skill_name));
        setJobOptions(response.data.jobTitles);
        console.log("jjjj:", response.data.jobTitles);        //setJobId(response.data.jobTitles.map(job => job.skill_id));
        //setJobId(response.data.jobTitles[0].skill_id);
      } catch (error) {
        console.error("Error fetching job titles:", error);
      }
    };

    fetchJobTitles();
  }, []);

  useEffect(() => {
    if (questions.length > 0 && interviewId) {
      createQuestion(); // קריאה לפונקציה רק כאשר יש ערכים ב-questions
    }
  }, [questions, interviewId]);

  useEffect(() => {
    if (createdQuestions.length > 0) {
      const currentQuestion = createdQuestions[currentQuestionIndex];
      if (currentQuestion) {
        const questionId = currentQuestion.questionId;
        console.log("questionId of current question:", questionId);
      }
    }
  }, [createdQuestions]);   // effect זה יופעל כל פעם שה-state של createdQuestions משתנה


  const createQuestion = async () => {
    setLoading(true);
    const questionsList = questions;
    try {
      const userId = JSON.stringify(user.id);
      console.log("client sent id: " + userId);
      for (const question of questionsList) {
        const response = await axios.post('http://localhost:3001/questions/createQuestion', {
          jobId,
          userId,
          interviewId,
          question // השאלה הנוכחית
        });
        console.log("Response data:", response.data);
        if (response.data && response.data.questionId) {
          const { questionId, questionText } = response.data.questionId;
          // console.log("Created question ID:", questionId);
          // console.log("Created question Text:", questionText);
          setCreatedQuestions((prev) => [
            ...prev,
            {
              questionId: questionId,
              questionText: questionText
            },
          ]);
        } else {
          console.error("questionId is missing in the response");
        }
      }
      console.log("All created questions:", createdQuestions);
    }

    catch (error) {
      console.error("Error creating Question:", error);
    } finally {
      setLoading(false); // לעצור את ההטענה בכל מקרה
    }
  }

  const createAnswer = async (userAnswer, questionId) => {
    setLoading(true);
    try {
      const userId = JSON.stringify(user.id);
      //const questionId = createdQuestions[currentQuestionIndex].questionId;
      const response = await axios.post('http://localhost:3001/answers/createAnswer', {
        userId,
        questionId,
        userAnswer
      });

    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setLoading(false); // לעצור את ההטענה בכל מקרה
    }
  }

  const createInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const userId = JSON.stringify(user.id);
      console.log("interview userID" + userId)
      const response = await axios.post('http://localhost:3001/interviews/createInterview', {
        userId,
        jobId,
        interview_date: currentDate,
        feedback: null
      });
      const newInterviewId = response.data.interviewId;
      console.log('Created interview ID:', newInterviewId);
      setInterviewId(newInterviewId);
      return newInterviewId;

    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setLoading(false); // לעצור את ההטענה בכל מקרה
    }
  }
  const createFeedback = async (feedback1) => {
    try {
      const response = await axios.post('http://localhost:3001/feedback/saveFeedback', {
        interviewId,
        feedback1,
        rating: null
      });
      console.log('Feedback saved successfully');
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };
  // const fetchPreviousInterviews = async () => {
  //   try {
  //       const response = await axios.get(`http://localhost:3001/interviews/getPreviousInterviews/${user.id}`);
  //       setPreviousInterviews(response.data);
  //   } catch (error) {
  //       console.error("Error fetching previous interviews:", error);
  //   }
  // };

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/questions/getQuestions', { jobTitle });
      setQuestions(response.data.questions);
      // console.log("Response from API:", response.data.questions);
      console.log("Questions list:", questions);
      const newInterviewId = await createInterview(e);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setFeedback('');
      setAllFeedbacks([]);
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
    //createAnswer(userAnswer, currentQuestionIndex);
    const currentQuestion = createdQuestions[currentQuestionIndex];
    if (currentQuestion) {
      const questionId = currentQuestion.questionId; // השאלה הנכונה לפי ה-index
      // שולחים את ה-`userAnswer` עם ה-`questionId`
      await createAnswer(userAnswer, questionId);
    }

    const prompt = `The question: ${questions[currentQuestionIndex]}. your answer: ${userAnswer}. Give your opinion on the answer, whether it is correct and what needs to be improved. Try to keep your answer to a maximum of 5 lines in length.`;
    try {
      const response = await axios.post('http://localhost:3001/feedback/getFeedback', { prompt });
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
    const overallFeedbackPrompt = `Here are all the feedbacks to the candidate's answers: \n${allFeedbacks.join("\n")}\nBased on the feedbacks, give me general feedback on the interview..`;
    try {
      const response = await axios.post('http://localhost:3001/feedback/getFeedback', { prompt: overallFeedbackPrompt });
      setFeedback(response.data.feedback);
      createFeedback(response.data.feedback);
      setShowFinalFeedback(true);
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

  const handleButtonClick = () => {
    setButtonClicked(true); // עדכון ה-state כאשר הכפתור נלחץ
    handleFinishInterview(); // קריאה לפונקציה שמספקת את המשוב הכללי
  };


  return (
    <div className="job-div" >
      <NavBar />

      {/* Only show job selection if no questions are loaded */}
      {!questions.length && (
        <form className='firstform' onSubmit={handleGenerateQuestions}>
          <label>
            <h1>:Choose a profession</h1>
            <select
              // value={jobTitle}
              value={jobId}
              onChange={(e) => {
                const selectedJobId = e.target.value;
                const selectedJobName = jobOptions.find(job => job.skill_id === parseInt(selectedJobId))?.skill_name || '';
                setJobTitle(selectedJobName);
                setJobId(selectedJobId);
              }}
              style={{ marginLeft: '10px', padding: '5px' }}
              disabled={loading}
            >
              <option value="" disabled>******</option>
              {jobOptions.map((job) => (
                <option key={job.skill_id} value={job.skill_id}>
                  {job.skill_name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit"  disabled={loading}>
            {loading ? 'Loding...' : 'Generate Questions'}
          </button>
        </form>
      )}

      {/* Display questions and answer form */}
      
      {questions.length > 0 && currentQuestionIndex < questions.length ? (
        <div className='allTest'> 
        <div className="chat-container">
          <h2>{jobTitle} Interview preparation</h2>
          <h3>question {currentQuestionIndex + 1} / {questions.length}</h3>
          <div className="question">
          <p className=''>{questions[currentQuestionIndex]}</p>
          </div>
          <form className='answerForm' onSubmit={handleSubmitAnswer} >
            <textarea
              name="answer"
              placeholder="Write your answer here..."
              style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px' }}
              disabled={loading}
            ></textarea>
            <button type="submit" style={{ padding: '5px 20px' }} disabled={loading}>
              {loading ? 'Loading..' : 'Send answer'}
            </button>
          </form>
          {feedback && (
            <div className="answer">
              <strong>feedback</strong>
              <p className='feedback'>{feedback}</p>
            </div>
          )}
        </div>
        </div>
      ) : questions.length > 0 && currentQuestionIndex === questions.length ? (
        <div className='finish'>
          <p className='wellDone'>You have completed all the questions! Well done!</p>
          {!buttonClicked && ( // אם הכפתור לא נלחץ, תציג אותו
            <button onClick={handleButtonClick} style={{ padding: '5px 20px', marginTop: '10px' }}>
              Get general feedback on the interview            </button>
          )}
          <button onClick={handleRestartInterview} >
          Start a new interview
          </button>
          {showFinalFeedback && (<p className='generalFeedback'>{feedback}</p>)}
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