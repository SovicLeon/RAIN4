import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../userContext";
import { useParams, Navigate } from 'react-router-dom';

function PhotoDetail() {
  const [photo, setPhoto] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const userContext = useContext(UserContext);
  const [description, setDescription] = useState('');
  const [uploaded, setCommented] = useState(false);
  const { photoId } = useParams();

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const response = await axios.get(`http://localhost:3001/photos/${photoId}`, { withCredentials: true });
        setPhoto(response.data);
        setLiked(response.data.userHasLiked);
        setLikesCount(response.data.likes);
      } catch (err) {
        console.log(err);
      }
    }
    fetchPhoto();
  }, [photoId]);

  async function onSubmit(e) {
    e.preventDefault();

    if (!description) {
      alert("Vnesite komentar!");
      return;
    }

    const formData = new FormData();
    formData.append('description', description);
    const res = await fetch(`http://localhost:3001/photos/${photoId}/comment`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const data = await res.json();

    setCommented(true);
  }

  const handleLike = () => {
    if (liked) {
      // If already liked, remove the like
      axios
        .delete(`http://localhost:3001/photos/${photoId}/like`, { data: {}, withCredentials: true })
        .then(() => {
          setLiked(false);
          setLikesCount((prevCount) => prevCount - 1);
        })
        .catch((error) => console.log(error));
    } else {
      // If not liked, add the like
      axios
        .post(`http://localhost:3001/photos/${photoId}/like`, {}, { withCredentials: true })
        .then(() => {
          setLiked(true);
          setLikesCount((prevCount) => prevCount + 1);
        })
        .catch((error) => console.log(error));
    }
  };

  if (!photo) {
    return null; // Add a loading spinner or some placeholder here
  }

  return (
    <div className="card bg-dark text-white mb-2">
      <img
        className="card-img pt-1 ps-5 pe-5"
        src={"http://localhost:3001/" + photo.path}
        alt={photo.name}
        width="50"
        height="400"
      />
      <div className="card-img-title">
        <h5 className="card-title">{photo.name}</h5>
          {userContext.user ?
            <>
              <button
                className={`btn btn-${liked ? 'primary' : 'outline-primary'}`}
                onClick={handleLike}
              >
                {liked ? 'Liked' : 'Like'}
              </button>
              <form className="form-group" onSubmit={onSubmit}>
                {!userContext.user ? <Navigate replace to="/login" /> : ""}
                {uploaded ? <Navigate replace to="/photos" /> : ""}
                <label>Komentar: </label>
                <input type="text" className="form-control" name="description" placeholder="Komentar" value={description} onChange={(e) => { setDescription(e.target.value) }} />
                <input className="btn btn-primary" type="submit" name="submit" value="Komentiraj" />
              </form>
            </>
            :
            <></>
          }
        <span className="ms-2">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
      </div>
    </div>
  );
}

export default PhotoDetail;
