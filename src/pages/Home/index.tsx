import React from 'react';
import {FiLogIn} from 'react-icons/fi';
import {Link} from 'react-router-dom';

import './style.css';

import logo from '../../assets/logo.svg';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="E-collect"/>
        </header>

        <main>
          <h1>Your place to collect recyclable items</h1>
          <p>We help people to find collect point efficiently</p>
          <Link to="/create-point">
            <span><FiLogIn /></span>
            <strong>Register a collect point</strong>
          </Link>
        </main>
        

      </div>
    </div>
  )
}

export default Home;