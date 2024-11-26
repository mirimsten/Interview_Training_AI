import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
//import '../LogIn.css'

const LogIn = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [needNewpassword, setNeedNewpassword] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: ""
  });


  const searchUser = async () => {
    let resData = [];
    try {

      setIsFetching(true);
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        }),
      });

      if (!response.ok) {
        throw new Error('login faild');
      }

      resData = await response.json();
      console.log(resData);



      setFetchError(null);
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsFetching(false);
      return resData;
    }
  }

  const resetUser = () => {
    setUser({
      id: "",
      email: "",
      password: ""
    })
    setIsBlocked(false)
  }

  const handleOnChange = (event, type) => {
    setUser({
      ...user,
      [type]: event.target.value
    })
  }

  const handlenewPassword = async () => {
    try {
      setIsFetching(true);
      const response = await fetch('http://localhost:8080/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          password: user.password
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create new password');
      }
      console.log('The password created successfully');
      setFetchError(null);
      setNeedNewpassword(false);
      resetUser();
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsFetching(false);
    }
  }
  const handleSubmit = async () => {

    let retData = await searchUser();
    if (retData == "password not valid") {
      setNeedNewpassword(true);
    } else {
      console.log(retData);
      // console.log(users);
      if (retData.token != "") {
        setUser({
          ...user,
          id: retData._id
        });
        const currentDate = new Date();
        const userToStorage = {
          id: retData._id,
          userName: retData.userName,
          email: retData.email,
          address: retData.address,
          phone: retData.phone,
          isAdmin: retData.isAdmin,
          isBlocked: retData.isBlocked,
          token: retData.token
        }
        localStorage.setItem('usersInLS', JSON.stringify([userToStorage]));
        setIsExist(true);
      } else {
        setIsNewUser(true);
        resetUser();
      }
    }

  }

  if (!needNewpassword && isExist) {
    return (
      <Navigate to={`../users/${user.id}/home`} />
    )
  }
  else if (fetchError) {
    return (
      <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>
    )
  }
  else if (isFetching) {
    return (
      <div className="ring">Loading
        <span></span>
      </div>
    )
  }
  else {
    return (
      <div className='login'>
        <div className='login-background'></div>
        <form >
          <label>Enter an email:</label>
          <input
            type="email"
            name="email"
            onChange={(event) => handleOnChange(event, 'email')}
            required
          />

          <label>Enter a password:</label>
          <input
            type="text"
            name="password"
            onChange={(event) => handleOnChange(event, 'password')}
            required
          />

          {isNewUser && <p>User does not exist</p>}
          {needNewpassword && <><p>Password is no longer valid please enter a new password</p>
          <label>Enter a new password:</label>
          <input
            type="text"
            name="password"
            onChange={(event) => handleOnChange(event, 'password')}
            required
          /></>}
          {needNewpassword && <button type="button" className='newPassword' onClick={handlenewPassword}>update</button>}

          {!needNewpassword && <button type="button" className='submit' onClick={handleSubmit}>login</button>}
          <p><i>don't have an account? click to <Link to="/register" >SIGN UP!</Link></i></p>
        </form>
      </div>
    )
  }


}

export default LogIn