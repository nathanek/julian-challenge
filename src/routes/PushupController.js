import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../firebase/UserAuth';  
import PushupCounter from '../comps/PushupCounter';
import NavBar from '../comps/NavBar';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import {app} from '../firebase/Database';
import {useNavigate} from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import {useEffect} from 'react'; 
import SignUpPage from '../comps/SignUpPage';

export default function PageController(){
    
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
    const replace  = useNavigate();
    
    useEffect(() => {
    
    replace({
        goTo: '/login',
        when: !user,
        onPaths: ['/*'], // glob pattern matching goodness
        otherwiseGoTo: '/dashboard', // this will only trigger if when === false AND path requirements fail
    })
    }, [user])

    return (
        <Routes>
            <Route exact path='/login' element={<Login/>}/>
            <Route exact path='/dashboard' element={<PushupCounter/>}/>
            <Route exact path='/signup' element={<SignUpPage/>}/>
            
            //<Route exact path='*' element={<Login/>}/>
        </Routes>
    )
} 