import { signInWithEmailAndPassword } from "@firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import DispatchContext from "../DispatchContext.js";
import { auth } from "../firebase/Firebase.js";
import GoogleButton from "./GoogleButton.js";

function Login() {
  const history = useHistory();
  const appDispatch = useContext(DispatchContext);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  useEffect(() => {
    const labels = document.querySelectorAll(".form-control label");

    labels.forEach((label) => {
      label.innerHTML = label.innerText
        .split("")
        .map(
          (letter, idx) =>
            `<span style="transition-delay:${idx * 50}ms">${letter}</span>`
        )
        .join("");
    });

  }, []);


  const login = async (e) => {
    e.preventDefault();

    appDispatch({ type: "notificationLoading" })

    try {

      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      history.push("/");

      appDispatch({ type: "notificationResult", value: "You have successfully logged in.", typeMessage: `${toast.TYPE.SUCCESS}`, autoClose: 3000 })

    } catch (error) {
      appDispatch({ type: "notificationResult", value: error.message.split(':')[1], typeMessage: `${toast.TYPE.ERROR}` })
    }

  };



  return (
    <>
      <div id="login-page">
        <div className="wrap-form">
          <form id="form" onSubmit={login}>
            <i className="fas fa-user"></i>
            <h1>Please Login</h1>
            <div className="form-control">
              <input type="text " required onChange={(e) => {
                setLoginEmail(e.target.value);
              }} />
              <label>Email</label>
            </div>
            <div className="form-control">
              <input type="password" required autoComplete="new-password" onChange={(e) => {
                setLoginPassword(e.target.value);
              }} />
              <label>Password</label>
            </div>
            <button className="btn">Login</button>
            <GoogleButton />
            <p className="text">
              Don't have an account?{" "}
              <Link className="nav-link " to="/register">
                Register.
              </Link>{" "}
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
