import { getAuth, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import { callRef } from '../firebase/Firebase';
import StateContext from "../StateContext";

function Profile() {
    const appState = useContext(StateContext);
    const appDispatch = useContext(DispatchContext);
    const auth = getAuth();
    // const isMounted = React.useRef(true);

    const [state, setState] = useImmer({
        image: null,
        url: null,
        name: "",
        email: "",
        newPassword: "",
        repeatPassword: ""
    })

    useEffect(() => {
        let active = true;
        const handleSubmit = async () => {
            try {
                await uploadBytes(callRef(auth.currentUser?.uid), state.image)
                const url = await getDownloadURL(callRef(auth.currentUser?.uid))
                await updateProfile(auth?.currentUser, { photoURL: url })
                if (active) appDispatch({ type: "userProfile", value: url })
            } catch (error) {
                console.log(error.message, "error")
            }
        }

        if (state.image) {
            handleSubmit()
        }

        return () => {
            active = false
        }
    }, [appDispatch, state.image, auth.currentUser])


    function handleImageClick(e) {
        if (e.target.files[0]) {
            appDispatch({ type: "userProfile", value: null })
            setState(draft => {
                draft.image = e.target.files[0];
            });
        }
    }


    async function saveChangesInformation() {
        if (state.newPassword !== state.repeatPassword)
            return appDispatch({
                type: "notificationResult",
                value: "The repeat password does not match",
                typeMessage: `${toast.TYPE.ERROR}`
            })


        if (state.newPassword === "" && state.repeatPassword === "" && state.email === "" && state.name === "")
            return appDispatch({
                type: "notificationResult",
                value: "The fields are empty",
                typeMessage: `${toast.TYPE.ERROR}`
            })

        appDispatch({ type: "notificationLoading" })
        try {
            state.name !== "" && await updateProfile(auth?.currentUser, { displayName: state.name })
            state.newPassword !== "" && await updatePassword(auth?.currentUser, state.newPassword)
            state.email !== "" && await updateEmail(auth?.currentUser, state.email)
            appDispatch({
                type: "notificationResult",
                value: "The changes have been saved",
                typeMessage: `${toast.TYPE.SUCCESS}`,
                autoClose: 2000
            })
        } catch (error) {
            console.log(error)
            appDispatch({ type: "notificationResult", value: error.message.split(':')[1], typeMessage: `${toast.TYPE.ERROR}` })
        }
    }


    return (
        <div className='edit-profile wrap-form'>
            <div className='column-one'>
                <div className='profile-image'>
                    {appState.userProfile ? <img src={appState.userProfile} alt='Avatar' className='avatar-profile' /> :
                        <div className="avatar-profile profile-image-loading"></div>
                    }
                    <input accept="image/*,image/heif,image/heic" type="file" name="photo" className='custom-file-input' onChange={handleImageClick} />
                </div>
            </div>
            <div className="vl"></div>
            <div className='column-two'>
                <div className='fields'>
                    <h1 className='tc'>Personal info</h1>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        placeholder={`${auth.currentUser?.email || ""}`}
                        onChange={(e) => {
                            setState(draft => {
                                draft.email = e.target.value;
                            });
                        }}
                    />
                    <label htmlFor="email">New Password</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        autoComplete="new-password"
                        onChange={(e) => {
                            setState(draft => {
                                draft.newPassword = e.target.value;
                            });
                        }}
                    />
                    <label htmlFor="email">Repeat password</label>
                    <input
                        type="password"
                        placeholder="Repeat password"
                        onChange={(e) => {
                            setState(draft => {
                                draft.repeatPassword = e.target.value;
                            });
                        }}
                    />
                    <label htmlFor="email">Name</label>
                    <input
                        type="text"
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
