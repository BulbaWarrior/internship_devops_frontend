import React, { Component } from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Jumbotron,
  InputGroup,
  InputGroupAddon,
  Button,
  FormGroup,
  Input,
  Col
} from 'reactstrap';

import Weather from './Weather';

const API_URL=process.env.REACT_APP_BASE_URL

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
       weather: null,
       cityList: [],
       newCityName: ''
    };
  }

  // get a json array of city name strings
  getCityList = () => {
    fetch(`${API_URL}/api/cities`)
    .then(res => res.json())
    .then(res => {
      if (!res) return 'no data';
      var cityList = res.map(r => r.city_name);
      this.setState({ cityList });
    });
  };

  // new city name will be updated in the input field to be the target value
  handleInputChange = (e) => {
    this.setState({ newCityName: e.target.value });
  };

  // fetch an object that has a city property
  // after getting city list clear input field
  handleAddCity = () => {
    fetch(`${API_URL}/api/cities`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: this.state.newCityName })
    })
    .then(res => res.json())
    .then(res => {
      this.getCityList();
      this.setState({ newCityName: '' });
    });
  };

  // get weather for city selected
  // enqueue change to weather component state variable
  getWeather = (city) => {
    fetch(`${API_URL}/api/weather/${city}`)
    .then(res => res.json())
    .then(weather => {
      if (!weather) return 'no data';
      console.log(weather);
      this.setState({ weather });
    });
  }

  // event object target passed to getWeather method
  handleChangeCity = (e) => {
    this.getWeather(e.target.value);
  }

  // lifecycle method called by React when component is started
  // used to fetch data and initialise state
  componentDidMount () {
    this.getCityList();
  }

  render() {
    return (
      <Container fluid className="centered">
        <Navbar dark color="dark">
          <NavbarBrand href="/">OurWeather</NavbarBrand>
        </Navbar>
        <Row>
          <Col>
            <Jumbotron>
              <h1 className="display-3">OurWeather</h1>
              <p className="lead">The current weather for your favorite cities!</p>
              <InputGroup>
                <Input 
                  placeholder="New city name..."
                  value={this.state.newCityName}
                  onChange={this.handleInputChange}
                />
                <InputGroupAddon addonType="append">
                  <Button color="primary" onClick={this.handleAddCity}>Add City</Button>
                </InputGroupAddon>
                
              </InputGroup>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="display-5">Current Weather</h1>
            <FormGroup>
              <Input type="select" onChange={this.handleChangeCity}>
                { this.state.cityList.length === 0 && <option>No cities added yet.</option> }
                { this.state.cityList.length > 0 && <option>Select a city.</option> }
                { this.state.cityList.map((city, i) => <option key={i}>{city}</option>) }
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Weather data={this.state.weather}/>
      </Container>
    );
  }
}

export default App;
