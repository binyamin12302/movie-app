import {
  getAuth,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import { callRef } from "../firebase/Firebase";
import StateContext from "../StateContext";

function Profile() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const auth = getAuth();
  const isGoogleUser = auth.currentUser?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  const [isAuthReady, setIsAuthReady] = useState(false);

  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const [state, setState] = useImmer({
    name: "",
    email: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleImageSelected = async (img) => {
    if (!auth.currentUser)
      return appState.notification("No user logged in.", toast.TYPE.ERROR);
    appDispatch({ type: "userProfile", value: null });

    try {
      await uploadBytes(callRef(auth.currentUser.uid), img);
      const url = await getDownloadURL(callRef(auth.currentUser.uid));
      await updateProfile(auth.currentUser, { photoURL: url });
      await auth.currentUser.reload();
      appDispatch({ type: "userProfile", value: auth.currentUser.photoURL });
    } catch (error) {
      console.log(error.message, "error");
      appState.notification("Error uploading image.", toast.TYPE.ERROR);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      handleImageSelected(e.target.files[0]);
    }
  };

  const saveChangesInformation = async () => {
    if (!auth.currentUser)
      return appState.notification("No user logged in.", toast.TYPE.ERROR);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    appState.notificationLoading();

    if (state.newPassword !== state.repeatPassword)
      return appState.notification(
        "The repeat password does not match.",
        `${toast.TYPE.ERROR}`
      );

    if (
      state.newPassword === "" &&
      state.repeatPassword === "" &&
      state.email === "" &&
      state.name === ""
    )
      return appState.notification(
        "The fields are empty.",
        `${toast.TYPE.ERROR}`
      );

    if (state.email && !emailRegex.test(state.email)) {
      return appState.notification(
        "Please enter a valid email address.",
        toast.TYPE.ERROR
      );
    }

    if (state.newPassword && state.newPassword.length < 6) {
      return appState.notification(
        "Password must be at least 6 characters.",
        toast.TYPE.ERROR
      );
    }

    setIsSaving(true);
    try {
      if (state.name !== "")
        await updateProfile(auth.currentUser, { displayName: state.name });
      if (state.newPassword !== "")
        await updatePassword(auth.currentUser, state.newPassword);
      if (state.email !== "") await updateEmail(auth.currentUser, state.email);

      appState.notification(
        "The changes have been saved.",
        `${toast.TYPE.SUCCESS}`
      );

      setState((draft) => {
        draft.email = "";
        draft.newPassword = "";
        draft.repeatPassword = "";
        draft.name = "";
      });

      await auth.currentUser.reload();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        appState.notification(
          "This email is already in use.",
          toast.TYPE.ERROR
        );
      } else if (error.code === "auth/weak-password") {
        appState.notification("Password is too weak.", toast.TYPE.ERROR);
      } else {
        appState.notification(
          "An unexpected error occurred.",
          toast.TYPE.ERROR
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-profile wrap-form">
      <div className="column-one">
        {isAuthReady && (
          <div className="profile-image">
            {appState.userProfile ? (
              <img
                src={appState.userProfile}
                alt="Avatar"
                className="con-image"
              />
            ) : (
              <div className="con-image"></div>
            )}

            {!isGoogleUser ? (
              <input
                accept="image/*,image/heif,image/heic"
                type="file"
                name="photo"
                className="custom-file-input"
                onChange={handleImageChange}
              />
            ) : (
              <small
                style={{ marginTop: "10px", display: "block", color: "#888" }}
              >
                Changing profile picture is disabled for Google accounts.
              </small>
            )}
          </div>
        )}
      </div>
      <div className="vl"></div>
      <div className="column-two">
        <div className="fields">
          <h1 className="tc">Personal info</h1>
          <label>Email</label>
          <input
            type="text"
            placeholder={`${auth.currentUser?.email || ""}`}
            value={state.email}
            onChange={(e) => {
              setState((draft) => {
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
              setState((draft) => {
                draft.newPassword = e.target.value;
              });
            }}
          />
          <label>Repeat password</label>
          <input
            type="password"
            value={state.repeatPassword}
            placeholder="Repeat password"
            onChange={(e) => {
              setState((draft) => {
                draft.repeatPassword = e.target.value;
              });
            }}
          />
          <label>Name</label>
          <input
            type="text"
            value={state.name}
            placeholder={`${auth.currentUser?.displayName || "Anonymous"}`}
            onChange={(e) => {
              setState((draft) => {
                draft.name = e.target.value;
              });
            }}
          />
          <button
            className="btn"
            onClick={saveChangesInformation}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
