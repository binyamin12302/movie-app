import { signInWithPopup } from 'firebase/auth';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { auth, provider } from "../firebase/Firebase.js";
import StateContext from "../StateContext";

function GoogleButton() {
    const appState = useContext(StateContext);

    const signInWithGoogle = async () => {
        appState.notificationLoading();
        try {
            await signInWithPopup(
                auth,
                provider
            );
            appState.notification("You have successfully logged in.", `${toast.TYPE.SUCCESS}`)
        } catch (error) {
            console.log(error);
            appState.notification(error.message.split(':')[1], `${toast.TYPE.ERROR}`)
        }
    }

    return (
        <button type="button" className="login-with-google-btn" onClick={signInWithGoogle} >
            Sign in with Google
        </button>
    )
}

export default GoogleButton;
