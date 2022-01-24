import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="footer">
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
        Copyright &copy; 2021 &nbsp;
        <Link to="/">MovieApp</Link>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
