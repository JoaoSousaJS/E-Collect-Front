import React from 'react';
import './style.css';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi'

import logo from '../../assets/logo.svg'

const CreatePoint = () => {
  return (
      <div id="page-create-point">
        <header>
          <img src={logo} alt="e-collect"/>

          <Link to="/">
            <FiArrowLeft />
            Back to home
          </Link>
        </header>

        <form>
          <h1>Create collect point</h1>

          <fieldset>
            <legend>
              <h2>Details</h2>
            </legend>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Address</h2>
            </legend>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Collect items</h2>
            </legend>
          </fieldset>
        </form>
      </div>
    )
}

export default CreatePoint;