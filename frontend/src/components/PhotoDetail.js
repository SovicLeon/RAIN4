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

    const res = await fetch(`http://localhost:3001/photos/${photoId}/comment`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description, photoId })
    });
    const data = await res.json();

    if (res.ok) {
      setPhoto((prevPhoto) => {
        const prevComments = Array.isArray(prevPhoto.comments) ? prevPhoto.comments : [];
        const newComment = {
          ...data,
          postedBy: {
            username: userContext.user.username,  // assuming you have username in userContext.user
          },
        };
        return {
          ...prevPhoto,
          comments: [newComment, ...prevComments]
        }        
      });
      setDescription(''); // Clear the description after successfully posting
    } else {
      // Handle error here
      console.log(data);
    }
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

  const handleReport = () => {
    axios
    .post(`http://localhost:3001/photos/${photoId}/report`, {}, { withCredentials: true })
    .catch((error) => console.log(error));
  };

  if (!photo) {
    return null; // Add a loading spinner or some placeholder here
  }

  let date = new Date(photo.date);
  let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

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
        <h5 className="card-title">Naslov: {photo.name}</h5>
        <h5 className="card-title">Objavil: {photo.postedBy.username}</h5>
        <h6 className="card-title">{formattedDate}</h6>
        <div className="d-flex align-items-center mb-2">
          <span className="me-2">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          {userContext.user &&
            <>
              <button
                className="btn btn-danger me-2"
                onClick={handleReport}
              >Report</button>
              <button
                className={`btn btn-${liked ? 'primary' : 'outline-primary'}`}
                onClick={handleLike}
              >
                {liked ? 'Liked' : 'Like'}
              </button>
            </>
          }
        </div>
        <form className="form-group" onSubmit={onSubmit}>
          {!userContext.user ? <Navigate replace to="/login" /> : ""}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Komentar:</label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              placeholder="Vnesite komentar"
              value={description}
              onChange={(e) => { setDescription(e.target.value) }}
            />
          </div>
          <button type="submit" className="btn btn-primary">Komentiraj</button>
        </form>
      </div>

      <div className="card-body">
        {photo.comments.map((comment, index) => (
          <div key={index}>
            <strong>{comment.postedBy.username}:</strong> {comment.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoDetail;
