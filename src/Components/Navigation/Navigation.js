import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => { //Destructuring onRouteChange fromr App.js in order to change the state when the Sign Out button is pressed
		if(isSignedIn) {
			return (
				<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
					<p onClick={() => onRouteChange('signout')} className='f3 link dim black underline pa3 pointer'>Sign Out</p> {/* Similiar to the onClick in Signin.js this changes the state to 'signout' when clicked, returning to the signin form */}
				</nav> 
			)			
		} else {
			return (
				<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
					<p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p> {/* Route changes to signin because the user will have clicked the Sign In button */}
					<p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p> {/* Route changes to register because the user will have clicked the Register button */}
				</nav>
			);
		}
}

export default Navigation;