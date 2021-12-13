import React from "react";
import { useHistory, useLocation } from "react-router-dom";

function HeaderLoggedOut() {
  const history = useHistory();
  const location = useLocation();

  const currentText = location.pathname === "/login" ? "Register" : "Login"


  function handleClick(e) {
    let text = e.target.innerText;

    return text === "Login"
      ? history.push("/login")
      : history.push("/register")
  }

  return (
    <>
      <button className="login-btn" type="button" onClick={handleClick}>
        {currentText}
      </button>
    </> 
  );
}

export default HeaderLoggedOut;
