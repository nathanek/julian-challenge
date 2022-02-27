import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {ref, set} from 'firebase/database';
import database from './Database';
async function createNewAccount() {
    try {
        const userAuth = await firebase.auth().createUserWithEmailAndPassword(email, password);
        var user = {
            uid: userAuth.uid,
            email: userAuth.email
        }
        writeUserData(user)

    } catch (error) {
        console.log(error.message)
    }
}

function writeUserData(user) {
    ref(database,'users/' + user.uid).set(user).catch(error => {
        console.log(error.message)
    });
}