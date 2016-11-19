const defaultPhotoState = {
  filename: 'are-you-a-robot.jpg',
  fillmode: 'contain'	// none, fill, contain, cover, scale-down
};

const photoState = (state = defaultPhotoState, action) => {
  switch (action.type) {
    case '/photo/FILE':
      return {
        ...state,
        filename: action.payload
      };
    case '/photo/FILL':
      return {
        ...state,
        fillmode: action.payload
      };
    default:
      return state;
  }
};

export default photoState;
