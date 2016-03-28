const defaultRendererState = {
  frame: -1,
  width: 800,
  height: 600,
  clearColour: [0, 0, 0, 0],
  beatInterval: 1000,
  state: 'on'
};

const renderer = (state = defaultRendererState, action) => {
  switch (action.type) {
    case '/renderer/FRAME_BOUNDS':
      return {
        ...state,
        width: action.payload.width,
        height: action.payload.height
      };
    case '/renderer/FRAME_ADVANCE':
      return {
        ...state,
        frame: state.frame + 1
      };
    case '/renderer/CLEAR_COLOUR':
      return {
        ...state,
        clearColour: action.payload
      };
    default:
      return state;
  }
};

export default renderer;
