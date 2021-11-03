import React from "react";
import "../css/Style.css";
import "../css/Mobile.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./header/Header";
import HomeGuest from "./home-guest/HomeGuest";
import Footer from "./footer/Footer";
import Login from "./login-page/Login";
import About from "./about/About";
import Terms from "./terms/Terms";
import Registar from "./register-page/Register";

function App() {

    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Header />
                        <HomeGuest />
                        <Footer />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/about-us">
                        <About />
                    </Route>
                    <Route path="/terms">
                        <Terms />
                    </Route>
                    <Route path="/register">
                        <Registar />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
