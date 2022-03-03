import { signOut } from "@firebase/auth";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Bounce, toast } from 'react-toastify';
import DispatchContext from "../DispatchContext.js";
import { auth } from "../firebase/Firebase";


function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const history = useHistory();

  const logout = async () => {
    appDispatch({ type: "notificationLoading" })
    history.push('/')
    await signOut(auth);
    appDispatch({ type: "notificationResult", value: "You have successfully logged out.", typeMessage: `${toast.TYPE.SUCCESS}`, transition: Bounce, autoClose: 2000 })
  }

  return (
    <button className="logout-btn" type="button" onClick={logout}>
      Logout
    </button>
  );
}

export default HeaderLoggedIn;
