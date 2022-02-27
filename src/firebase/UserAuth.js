import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import {app} from '../firebase/Database';
import {useEffect, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {useNavigate} from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";



function Login() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const auth = getAuth(app);
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    const loginAttempt = (username, password) => {
        console.log(password);
        signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            if (user) {
                navigate('../dashboard');
            }
            // ...
        })
        .catch((error) => {
            console.log("didn't work")
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }

    const handleSignUpPage = () => {
      navigate('../signup')
    }

    return(
      <div>
        <label>
          <p>Username</p>
          <input type="text" onChange={event => setUsername(event.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={event => setPassword(event.target.value)} />
        </label>
        <div>
          <button onClick={() => loginAttempt(username,password)}> Submit</button>
        </div>
        <div>
          <button onClick={() => handleSignUpPage()}>Sign Up</button>
        </div>
      </div>
    )
  }

export default Login;