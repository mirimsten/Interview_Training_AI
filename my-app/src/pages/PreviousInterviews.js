import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/home.css'

const PreviousInterviews = () => {
    const [interviews, setInterviews] = useState([]); // אחסון הראיונות
    const [error, setError] = useState(null); // טיפול בשגיאות
    const [skills, setSkills] = useState({}); // אחסון שם המיומנויות לפי skill_id
    const navigate = useNavigate(); // מאפשר ניווט לדפים אחרים

    useEffect(() => {
        const user = localStorage.getItem('user');
        console.log("prev: "+ user);

        if (user) {
            const userId = JSON.parse(user).id;
            console.log(userId);

            // קריאה ל-API לקבלת הראיונות של המשתמש המחובר
            axios
                .get(`http://localhost:3001/interviews/getPreviousInterviews/${userId}`)
                .then((response) => {
                    const fetchedInterviews = response.data;
                    setInterviews(fetchedInterviews);

                    // השגת כל ה-skill_id הייחודיים
                    const skillIds = [
                        ...new Set(fetchedInterviews.map((interview) => interview.skill_id)),
                    ];

                    // קריאה ל-API לכל skill_id כדי לקבל את ה-skill_name
                    Promise.all(
                        skillIds.map((skillId) =>
                            axios
                                .get(`http://localhost:3001/skills/${skillId}`)
                                .then((res) => ({ skillId, skillName: res.data.skillName }))
                        )
                    )
                        .then((skillsData) => {
                            // בניית מילון של skill_id -> skill_name
                            const skillsMap = {};
                            skillsData.forEach(({ skillId, skillName }) => {
                                skillsMap[skillId] = skillName;
                            });
                            setSkills(skillsMap);
                        })
                        .catch((error) => {
                            console.error("Error fetching skill names:", error);
                            setError("Failed to fetch skill names.");
                        });
                })
                .catch((error) => {
                    console.error("Error fetching previous interviews:", error);
                    setError("Failed to fetch interviews. Please try again later.");
                });
        } else {
            setError("User not logged in.");
        }
    }, []); // הרצת הפונקציה פעם אחת בלבד בעת טעינת הקומפוננטה

    // פונקציה לחזרה אחורה
    const handleGoBack = () => {
        navigate(-1); // חזרה לדף הקודם
    };

    if (error) {
        return <div>{error}</div>; // תצוגת שגיאה אם יש בעיה
    }

    return (
        <div className='PreviousInervies'>
            <button className='backButton' onClick={handleGoBack}>Back </button>
            <h1>Previous interviews</h1>
            {interviews.length === 0 ? (
                <p>There are no previous interviews</p>            ) : (
                <ul>
                    {interviews.map((interview) => (
                        <li key={interview.interviewId}>
                            <h3>
                            profession:{" "}
                                {skills[interview.skill_id] || "Loading.."}
                            </h3>
                            <p >date: {new Date(interview.interview_date).toLocaleDateString()}</p>
                            <p>feedback: {interview.feedback || "there is no feedback"}</p>
                        </li>
                    ))}
                </ul>
            )}
            {/* כפתור חזרה */}
        </div>
    );
};

export default PreviousInterviews;
