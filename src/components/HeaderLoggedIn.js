import { signOut } from "@firebase/auth";
import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Bounce, toast } from 'react-toastify';
import DispatchContext from "../DispatchContext.js";
import { auth } from "../firebase/Firebase";


function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const history = useHistory();

  const logout = async () => {
    appDispatch({ type: "notificationLoading" })
    await signOut(auth)
    history.push("/");
    appDispatch({ type: "notificationResult", value: "You have successfully logged out.", typeMessage: `${toast.TYPE.SUCCESS}`, transition: Bounce, autoClose: 2000 })
  }

  return (
    <>
      <div>
        <i className="far fa-user user-icon"></i>
      </div>
      <Link to='/'> 
      {/* @TODO: The link is uneccessry here because you already redirect the user on "logout" function. and also I think is not a good practice to put button inside a link. */}
        <button className="login-btn" type="button" onClick={logout}>
          Logout
        </button>
      </Link>
    </>
  );
}

export default HeaderLoggedIn;
