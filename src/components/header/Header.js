import { React } from 'react';
import './Header.css';
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function Header({ text }) {

    const history = useHistory();

    function handleClick(e) {
        return e.target.innerText === 'Login' ? history.push("/login") : history.push("/register");
    }

    return (
        <>
            <header>
                <div className="main-header">
                    <div className='container'>
                        <h1 className="logo-header">MoiveApp</h1>
                        <div id="navigation">
                            {/* <input type="text" id="search" className="search" placeholder="Search" /> */}
                            <button className="home-btn" type='button'>
                                <Link to='/' className='nav-link' >
                                    Home
                                </Link>
                            </button>
                            <button className='login-btn' type='button' onClick={handleClick} >
                                {text || 'Login'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header