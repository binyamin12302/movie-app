import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import StateContext from "../StateContext";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";

function Header() {
  const appState = useContext(StateContext);
  const history = useHistory();

  const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />;

  return (
    <header>
      <div id="header">
        <div className="container">
          <h2 className="logo-header" onClick={() => history.push("/")}>MoiveApp</h2>
          {headerContent}
        </div>
      </div>
    </header>
  );
}



export default Header;
