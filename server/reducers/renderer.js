const defaultRendererState = {
  frame: 0,
  width: 800,
  height: 600,
  clearColour: [0, 0, 0, 1],
  beatInterval: 1000,
  state: 'run' // 'pause', 'off'
};

const validStates = {
  play: true,
  pause: true,
  off: true
};

const rendererState = (state = defaultRendererState, action) => {
  switch (action.type) {
    case '/renderer/STATE':
      return (action.payload in validStates) ? {
        ...state,
        state: action.payload
      } : state;
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

export default rendererState;
