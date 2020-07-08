import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './style.css';
import {Link, useHistory } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import MyDropzone from '../../components/Dropzone/index';

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
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJqb2FvbG9sZXNAZ21haWwuY29tIiwiYXBpX3Rva2VuIjoiYnltNFRXWWg1ZHJMaUt3YmhFZlgwOUZDWW9QYnBFdDBQa2JvcXRGU2wwSFFVSFFaSS1IUk9QbDdOOUx6cktlWk5wcyJ9LCJleHAiOjE1OTQyODk1ODN9.uirmss3BafyuIBfnAhrh3R-jw47c6up4OnTTHJKM3nU",
    Accept: "application/json"
  }
}

const CreatePoint = () => {

  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const [selectedState, setSelectedState] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItem, setSelectedItem] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude,longitude} = position.coords;

      setInitialPosition([latitude, longitude]);
    })
  },[])


  useEffect(() => {
    api.get('items').then(response => {
      console.log(response.data)
      setItems(response.data);
  
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect( () => {
    axios.get<StateResponse[]>('https://www.universal-tutorial.com/api/states/Australia', config).then(response => {
      const statesResponse = response.data.map(state => state.state_name);
      setStates(statesResponse);
     
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    axios.get<CityResponse[]>(`https://www.universal-tutorial.com/api/cities/${selectedState}`, config)
    .then(response => {
      const citiesResponse = response.data.map(city => city.city_name);
     
      setCities(citiesResponse);
     
    })
  
  },[selectedState])

  function handleSelectState(event: ChangeEvent<HTMLSelectElement>) {
    const state = event.target.value;

    setSelectedState(state);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;

    setSelectedCity(city);
  }
  
  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    setFormData({...formData, [name]: value});
  }

  function handleSelectItem (id: number) {

    const alreadySelected = selectedItem.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItem.filter(item => item !== id);

      setSelectedItem(filteredItems);
    } else {
      setSelectedItem([...selectedItem, id]);
    }

    
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    
    
    const {name, email, whatsapp} = formData;
    const uf = selectedState;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItem;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    
    if(selectedFile) {
      data.append('image', selectedFile);
    }
 

    await api.post('point', data);

    alert('Collect point created')

    history.push('/');


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

        <form onSubmit={handleSubmit}>
          <h1>Create collect point</h1>

          <MyDropzone onFileUploaded={setSelectedFile}/>

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
                onChange={handleInputChange}
              
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}

                
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input 
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleInputChange}

                
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Address</h2>
              <span>Click on the map to select your address</span>
            </legend>

            <Map center={[-34.8570301, 138.6088232]} zoom={15} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              /> 

              <Marker position={selectedPosition} /> 

            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="state">State</label>
                <select name="uf" id="uf" value={selectedState} onChange={handleSelectState}>
                  <option value="0"> Select an State</option>
                  {states.map(state => (
                    <option value={state} key={state}> {state}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">City</label>
                <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
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
              <li 
                key={item.id} 
                onClick={() => handleSelectItem(item.id)}
                className={selectedItem.includes(item.id) ? 'selected' : ''}
              >
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