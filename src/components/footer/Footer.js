import React from "react";
import './Footer.css';
import { Link } from "react-router-dom";

function Footer() {
    return (
        <>
            <footer>
                <p>
                    <Link to="/" className="link-footer">
                        Home
                    </Link>
                    <span> | </span>
                    <Link className="link-footer" to="/about-us">
                        About Us
                    </Link>
                    <span> | </span>
                    <Link className="link-footer" to="/terms">
                        Terms
                    </Link>
                </p>
                <p className="copyright-footer">
                    Copyright &copy; 2021 {""}
                    <a href="/">
                        MovieApp
                    </a>
                    . All rights reserved.
                </p>

            </footer>
        </>
    );
}

export default Footer;
