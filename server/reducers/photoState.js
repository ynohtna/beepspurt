import { listPhotos } from '../renderers/photo';

const defaultPhotoState = {
  filename: 'hail-satan.jpg',
  fillmode: 'cover',	// none, fill, contain, cover, (unimpl: scale-down)
  list: []
};

const photoState = (state = defaultPhotoState, action) => {
  switch (action.type) {
    case '/photo/FILE':
      return {
        ...state,
        filename: action.payload || ''
      };
    case '/photo/FILL':
      return {
        ...state,
        fillmode: action.payload
      };
    case '/photo/LIST':
      return {
        ...state,
        list: listPhotos()
      };
    default:
      return state;
  }
};

export default photoState;
