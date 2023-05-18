import { useState } from 'react';
import axios from 'axios';
import { UserContext } from "../userContext";
import { useNavigate } from 'react-router-dom';

function Photo(props) {
  const [liked, setLiked] = useState(props.photo.userHasLiked);
  const [likesCount, setLikesCount] = useState(props.photo.likes);

  const navigate = useNavigate();

  // Add this function inside the Photo component
  const handleImageClick = () => {
    navigate(`/photos/${props.photo._id}`);
  };

  const handleLike = () => {
    if (liked) {
      // If already liked, remove the like
      axios
        .delete(`http://localhost:3001/photos/${props.photo._id}/like`, { data: {}, withCredentials: true })
        .then(() => {
          setLiked(false);
          setLikesCount((prevCount) => prevCount - 1);
        })
        .catch((error) => console.log(error));
    } else {
      // If not liked, add the like
      axios
        .post(`http://localhost:3001/photos/${props.photo._id}/like`, {}, { withCredentials: true })
        .then(() => {
          setLiked(true);
          setLikesCount((prevCount) => prevCount + 1);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="card bg-dark text-white mb-2">
      <img
        className="card-img pt-1 ps-5 pe-5"
        src={"http://localhost:3001/" + props.photo.path}
        alt={props.photo.name}
        width="50"
        height="400"
        onClick={handleImageClick}
      />
      <div className="card-img-title">
        <h5 className="card-title">{props.photo.name}</h5>
        <UserContext.Consumer>
          {context => (
            context.user ?
              <>
                <button
                  className={`btn btn-${liked ? 'primary' : 'outline-primary'}`}
                  onClick={handleLike}
                >
                  {liked ? 'Liked' : 'Like'}
                </button>
              </>
              :
              <></>
          )}
        </UserContext.Consumer>
        <span className="ms-2">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
      </div>
    </div>
  );
}

export default Photo;
