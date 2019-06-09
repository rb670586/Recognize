import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import ImageOutput from './Components/ImageOutput/ImageOutput.js';
import Signin from './Components/Signin/Signin.js';
import Rank from './Components/Rank/Rank.js';
import Register from './Components/Register/Register.js';
import Particles from 'react-particles-js';
import './App.css';
import 'tachyons';

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin', //keeps track of where we are on the page. The default value is signin so the user automatically goes to the signin page
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }
loadUser = (data) => {
  this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
  }})
}
  // componentDidMount () {
  //   fetch('http://localhost:3001')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width, //since clarifaiFace is a percentage, you multiply that percentage by the width of the picture to get the boundary
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)

  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3001/imageURL', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
      .then(response => response.json())
  .then(response => {
    if (response) {
      fetch('http://localhost:3001/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count})) //Object.assign prevents the user from being changed to undefined when the user enters a new image to detect
      })
    }
    this.displayFaceBox(this.calculateFaceLocation(response)) //calculateFaceLocation takes the response, returns object on line 32. That returned object is going into displayFaceBox
  }) 
  .catch(err => console.log(err));
   
 }

onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState) //if route is equal to 'signout' then the isSignedIn property must be false because the user is not signed in
  } else if (route === 'home') {
    this.setState({isSignedIn: true}) //if route is equal to 'home' then the isSignedIn property must be true because the user is signed in
  }
  this.setState({route: route}); //this makes the onRouteChange dynamic instead of statically linking to 'home'
}

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state //destructuring in order to remove the 'this.state' from the code below
    return (
      <div className='App'>
        <Particles className='particles'
          params={{
            "particles": {
              "number": {
                "value": 125
                },
              "size": {
                "value": 3
                }
              }
           }}
          />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          {route === "home"
            ? <div> {/* The ? and : are ternary operators, a concise way of doing if/else statements. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator */}
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries}/> 
                <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}
                />
                <ImageOutput box={box} imageUrl={imageUrl}/>
              </div> 
            : (
                route === 'signin' 
                ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> //This function changes the route to something other than 'signin', thus changing the state and the page the user is directed to 
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )        
          }
      </div>
      );
    }
}

export default App;