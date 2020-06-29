import axios from 'axios';
import {
  DELETE_SCREAM,
  LIKE_SCREAM,
  POST_SCREAM,
  SET_SCREAM,
  SET_SCREAMS,
  SUBMIT_COMMENT,
  UNLIKE_SCREAM,
} from '../types';

// Get all screams
export const getScreams = () => dispatch => {
  dispatch({type: LOADING_DATA});
  axios
    .get('/screams')
    .then(res => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch({
        type: SET_SCREAMS,
        payload: [],
      });
    });
};
export const getScream = screamId => dispatch => {
  axios
    .get(`/scream/${screamId}`)
    .then(res => {
      dispatch({
        type: SET_SCREAM,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};
// Post a scream
export const postScream = newScream => dispatch => {
  axios
    .post('/scream', newScream)
    .then(res => {
      dispatch({
        type: POST_SCREAM,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};
// Like a scream
export const likeScream = screamId => dispatch => {
  axios
    .get(`/scream/${screamId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_SCREAM,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};
// Unlike a scream
export const unlikeScream = screamId => dispatch => {
  axios
    .get(`/scream/${screamId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_SCREAM,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};
// Submit a comment
export const submitComment = (screamId, commentData) => dispatch => {
  axios
    .post(`/scream/${screamId}/comment`, commentData)
    .then(res => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
    })
    .catch(err => console.log(err));
};
export const deleteScream = (screamId, history) => dispatch => {
  axios
    .delete(`/scream/${screamId}`)
    .then(() => {
      dispatch({type: DELETE_SCREAM, payload: screamId});
      history.push('/');
    })
    .catch(err => console.log(err));
};

export const getUserData = userHandle => dispatch => {
  axios
    .get(`/user/${userHandle}`)
    .then(res => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data.screams,
      });
    })
    .catch(() => {
      dispatch({
        type: SET_SCREAMS,
        payload: null,
      });
    });
};
