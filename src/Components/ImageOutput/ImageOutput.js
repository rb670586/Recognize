import React from 'react';
import './ImageOutput.css';

const ImageOutput = ({ imageUrl, box }) => {
	return (
		<div className='center ma'>
			<div className= 'absolute mt2'>
				<img id='inputimage' src={imageUrl} alt='' width='500px' height='auto'/>
				<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div> {/*Div is empty because it is just the border for the bounding box */}
			</div>
		</div>
		);
}

export default ImageOutput;