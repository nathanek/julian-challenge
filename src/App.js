import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './firebase/UserAuth';  
import PushupCounter from './comps/PushupCounter';
import PageController from './routes/PushupController';
import NavBar from './comps/NavBar';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import {app} from './firebase/Database';
import {useNavigate} from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import {useEffect} from 'react'; 

function App() {
  const userExists = false;
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);
  auth.onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // ...

    } else {
      // User is signed out.
      // ...
      
    }
  });

  return (
    <div className="wrapper">
      <h1>Julian Pushup Challenge!</h1>
      <BrowserRouter>
        <NavBar/>
        <PageController/>
      </BrowserRouter>
    </div>
  );
}

export default App;
          