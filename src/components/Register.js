import { createUserWithEmailAndPassword } from "@firebase/auth";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import { auth } from "../firebase/Firebase.js";
import StateContext from "../StateContext";

function Register() {
  const appState = useContext(StateContext);

  const [state, setState] = useImmer({
    registerEmail: "",
    registerPassword: "",
    confirmPassword: "",
  })

  const register = async (e) => {
    e.preventDefault();


    if (state.registerPassword !== state.confirmPassword)
      return appState.notification("The password confirmation does not match", `${toast.TYPE.ERROR}`);
    try {
      
    appState.notificationLoading();
      await createUserWithEmailAndPassword(
        auth,
        state.registerEmail,
        state.registerPassword
      );

      appState.notification("Congrats! Welcome to your new account.", `${toast.TYPE.SUCCESS}`);
    } catch (error) {
      console.log(error)
      appState.notification(error.message.split(':')[1], `${toast.TYPE.ERROR}`);
    }
  };

  return (
    <div className="wrap-form">
      <form id="register-page" onSubmit={register} >
        <h1>Register</h1>
        <p>Please fill in this form to create an account.</p>
        <hr />
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Enter Email"
          name="email"
          id="email"
          required
          onChange={(e) => {
            setState(draft => {
              draft.registerEmail = e.target.value;
            });
          }}
        />
        <label htmlFor="psw">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          id="psw"
          required
          autoComplete="new-password"
          onChange={(e) => {
            setState(draft => {
              draft.registerPassword = e.target.value;
            });
          }}
        />
        <label htmlFor="psw-confirm">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm Password"
          name="psw-confirm"
          id="psw-confirm"
          required
          onChange={(e) => {
            setState(draft => {
              draft.confirmPassword = e.target.value;
            });
          }}
        />
        <hr />
        <p>
          By creating an account you agree to our &nbsp;
          <Link className="nav-link " to="terms/">
            Terms & Privacy
          </Link>
          .
        </p> &nbsp;
        <button type="submit" className="register-btn-form">
          &nbsp;
          Register &nbsp;
        </button>
        <p>
          Already have an account? &nbsp;
          <Link className="nav-link " to="login/">
            Login
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

export default Register;
