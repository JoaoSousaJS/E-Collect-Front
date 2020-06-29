import React, {useEffect, useState, ChangeEvent} from 'react';
import './style.css';
import {Link} from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

import logo from '../../assets/logo.svg'

interface Item {
  id: number;
  image: string;
  title: string;
  image_url: string;
}

interface StateResponse {
  state_name: string;
}

interface CityResponse {
  city_name: string;
}

const config = {
  headers: {
    Authorization: "",
    Accept: "application/json"
  }
}

const CreatePoint = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState('0');

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
  
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect( () => {
    axios.get<StateResponse[]>('https://www.universal-tutorial.com/api/states/Australia', config).then(response => {
      const statesResponse = response.data.map(state => state.state_name);
      setStates(statesResponse);
      console.log('passou')
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    axios.get<CityResponse[]>(`https://www.universal-tutorial.com/api/cities/${selectedState}`, config)
    .then(response => {
      const citiesResponse = response.data.map(city => city.city_name);
      console.log(citiesResponse);
      setCities(citiesResponse);
      console.log('teste')
    })
  
  },[selectedState])

  function handleSelectState(event: ChangeEvent<HTMLSelectElement>) {
    const state = event.target.value;

    setSelectedState(state);
  }

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

            <div className="field">
              <label htmlFor="name">Name</label>
              <input 
                type="text"
                name="name"
                id="name"
              
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email"
                  name="email"
                  id="email"
                
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input 
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Address</h2>
              <span>Click on the map to select your address</span>
            </legend>

            <Map center={[-34.8570301, 138.6088232]} zoom={15}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              /> 

              <Marker position={[-34.8570301, 138.6088232]} /> 

            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="state">State</label>
                <select name="state" id="state" value={selectedState} onChange={handleSelectState}>
                  <option value="0"> Select an State</option>
                  {states.map(state => (
                    <option value={state} key={state}> {state}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">City</label>
                <select name="city" id="city">
                  <option value="0"> Pick a city</option>
                  {cities.map(city => (
                    <option value={city} key={city}> {city}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Items</h2>
              <span>Select one or more items below</span>
            </legend>

            <ul className="items-grid">
              {items.map(item =>(
              <li key={item.id}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
            </li>
              ))}
 
       
            </ul>
          </fieldset>

          <button type="submit">
            Create Collect point
          </button>
        </form>
      </div>
    )
}

export default CreatePoint;
