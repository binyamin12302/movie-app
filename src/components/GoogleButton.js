import { signInWithPopup } from 'firebase/auth';
import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import DispatchContext from "../DispatchContext.js";
import { auth, provider } from "../firebase/Firebase.js";

function GoogleButton() {
    const history = useHistory();
    const appDispatch = useContext(DispatchContext);

    const signInWithGoogle = async () => {
        appDispatch({ type: "notificationLoading" })
        try {
            await signInWithPopup(
                auth,
                provider
            )
            history.push("/");
            appDispatch({ type: "notificationResult", value: "You have successfully logged in.", typeMessage: `${toast.TYPE.SUCCESS}` })
        } catch (error) {
            console.log(error);
            appDispatch({ type: "notificationResult", value: error.message.split(':')[1], typeMessage: `${toast.TYPE.ERROR}` })
        }
    }

    return (
        <>
            <button type="button" className="login-with-google-btn" onClick={signInWithGoogle} >
                Sign in with Google
            </button>
        </>
    )
}

export default GoogleButton
