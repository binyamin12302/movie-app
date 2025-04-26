import React from "react";
import { useHistory, useLocation } from "react-router-dom";

function HeaderLoggedOut() {
  const history = useHistory();
  const location = useLocation();

  const isOnLoginPage = location.pathname === "/login";
  const buttonText = isOnLoginPage ? "Register" : "Login";

  function handleClick() {
    if (isOnLoginPage) {
      history.push("/register");
    } else {
      history.push("/login");
    }
  }

  function goHome() {
    history.push("/");
  }

  return (
    <div className="navigation">
      <button className="home-btn" onClick={goHome}>
        Home
      </button>
      <button className="login-btn" type="button" onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  );
}

export default HeaderLoggedOut;
