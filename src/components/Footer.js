import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
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
          {/* @TODO: Why are you putting {""} in many places in the code? if you want to put a space, you can also able to do that with &nbsp; (same as copy). */}
          Copyright &copy; 2021 {""} 
          <Link to="/">MovieApp</Link>. All rights reserved.
        </p>
      </footer>
    </>
  );
}

export default Footer;
