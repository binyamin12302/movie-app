import { getAuth, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import { callRef } from '../firebase/Firebase';
import StateContext from "../StateContext";

function Profile() {
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const auth = getAuth();

    const [state, setState] = useImmer({
        name: "",
        email: "",
        newPassword: "",
        repeatPassword: ""
    })


    const handleImageSelected = async (img) => {
        appDispatch({ type: "userProfile", value: null })
        try {
            await uploadBytes(callRef(auth.currentUser?.uid), img)
            const url = await getDownloadURL(callRef(auth.currentUser?.uid))
            await updateProfile(auth?.currentUser, { photoURL: url })
            appDispatch({ type: "userProfile", value: url })
        } catch (error) {
            console.log(error.message, "error")
        }
    }


    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            handleImageSelected(e.target.files[0])
        }
    }


    const saveChangesInformation = async () => {
        if (state.newPassword !== state.repeatPassword)
            return appState.notification("The repeat password does not match", `${toast.TYPE.ERROR}`);

        if (state.newPassword === "" && state.repeatPassword === "" && state.email === "" && state.name === "")
            return appState.notification("The fields are empty", `${toast.TYPE.ERROR}`);

        appState.notificationLoading();
        try {
            state.name !== "" && await updateProfile(auth?.currentUser, { displayName: state.name })
            state.newPassword !== "" && await updatePassword(auth?.currentUser, state.newPassword)
            state.email !== "" && await updateEmail(auth?.currentUser, state.email)
            appState.notification("The changes have been saved", `${toast.TYPE.SUCCESS}`)
            setState(draft => {
                draft.email = "";
                draft.newPassword = "";
                draft.repeatPassword = "";
                draft.name = "";
            })
        } catch (error) {
            console.log(error)
            appState.notification(error.message.split(':')[1], `${toast.TYPE.ERROR}`)
        }
    }

    return (
        <div className='edit-profile wrap-form'>
            <div className='column-one'>
                <div className='profile-image'>
                    {appState.userProfile ?
                        <img src={appState.userProfile} alt='Avatar' className='con-image' /> :
                        <div className="con-image"></div>
                    }
                    <input accept="image/*,image/heif,image/heic" type="file"
                        name="photo"
                        className='custom-file-input'
                        onChange={handleImageChange} />
                </div>
            </div>
            <div className="vl"></div>
            <div className='column-two'>
                <div className='fields'>
                    <h1 className='tc'>Personal info</h1>
                    <label >Email</label>
                    <input
                        type="text"
                        placeholder={`${auth.currentUser?.email || ""}`}
                        value={state.email}
                        onChange={(e) => {
                            setState(draft => {
                                draft.email = e.target.value;
                            });
                        }}
                    />
                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={state.newPassword}
                        autoComplete="new-password"
                        onChange={(e) => {
                            setState(draft => {
                                draft.newPassword = e.target.value;
                            });
                        }}
                    />
                    <label >Repeat password</label>
                    <input
                        type="password"
                        value={state.repeatPassword}
                        placeholder="Repeat password"
                        onChange={(e) => {
                            setState(draft => {
                                draft.repeatPassword = e.target.value;
                            });
                        }}
                    />
                    <label >Name</label>
                    <input
                        type="text"
                        value={state.name}
                        placeholder={`${auth.currentUser?.displayName || ""}`}
                        onChange={(e) => {
                            setState(draft => {
                                draft.name = e.target.value;
                            });
                        }}
                    />
                    <button className='btn' onClick={saveChangesInformation}>Save changes</button>
                </div>
            </div>
        </div>
    )
}

export default Profile;
