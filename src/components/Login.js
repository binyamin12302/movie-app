import { signInWithEmailAndPassword } from "@firebase/auth";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import { auth } from "../firebase/Firebase.js";
import StateContext from "../StateContext";
import GoogleButton from "./GoogleButton.js";

function Login() {
  const appState = useContext(StateContext);

  const splitLetters = (word) =>
    word
      .split("")
      .map(
        (letter, idx) => (<span key={idx} style={{ transitionDelay: `${idx * 50}ms` }}>{letter}</span>)
      );


  const [state, setState] = useImmer({
    loginEmail: '',
    loginPassword: ''
  })


  const login = async (e) => {
    e.preventDefault();
    appState.notificationLoading();
    try {
      await signInWithEmailAndPassword(
        auth,
        state.loginEmail,
        state.loginPassword
      );
      appState.notification("You have successfully logged in.", `${toast.TYPE.SUCCESS}`)
    } catch (error) {
      appState.notification(error.message.split(':')[1], `${toast.TYPE.ERROR}`)
    }
  };

  return (
    <div id="login-page">
      <div className="wrap-form">
        <form id="form" onSubmit={login}>
          <i className="fas fa-user"></i>
          <h1>Please Login</h1>
          <div className="form-control">
            <input type="email" required onChange={(e) => {
              setState(draft => {
                draft.loginEmail = e.target.value;
              });
            }} />
            <label>{splitLetters("Email")}</label>
          </div>
          <div className="form-control">
            <input type="password" autoComplete="new-password" required onChange={(e) => {
              setState(draft => {
                draft.loginPassword = e.target.value;
              });
            }} />
            <label>{splitLetters("Password")}</label>
          </div>
          <button className="btn">Login</button>
          <GoogleButton />
          <p className="text">
            Don't have an account? &nbsp;
            <Link className="nav-link " to="/register">
              Register.
            </Link>&nbsp;
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
