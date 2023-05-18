import { useState, useEffect } from 'react';
import Photo from './Photo';
var decay = require('decay');


function Photos() {
    const [photos, setPhotos] = useState([]);

    useEffect(function () {
        const getPhotos = async function () {
            const res = await fetch("http://localhost:3001/photos", { credentials: 'include' });
            const data = await res.json();

            // Get current time
            // Function to calculate hot score
            const hotScore = (photo) => {
                const photoTime = new Date(photo.date).getTime() / 1000; // Convert milliseconds to seconds
                return decay.hackerHot(photo.likes, photoTime); // Compute the hot score
            };

            // Sort photos by hot score in descending order (most likes first)
            const sortedPhotos = data.sort((a, b) => hotScore(b) - hotScore(a));

            setPhotos(sortedPhotos);
        }
        getPhotos();
    }, []);

    return (
        <div>
            <h3>Photos:</h3>
            <ul>
                {photos.map(photo => (<Photo photo={photo} key={photo._id}></Photo>))}
            </ul>
        </div>
    );
}

export default Photos;
