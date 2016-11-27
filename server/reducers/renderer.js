const defaultRendererState = {
  frame: 0,
  width: 800,
  height: 600,
  state: 'run', // 'pause', 'off'
  foreground: [255, 255, 255, 255],
  background: [0, 0, 0, 255],
  clearColour: [0, 0, 0, 0],
  invert: false
};

const validStates = {
  run: true,
  pause: true,
  off: true
};

const rendererState = (state = defaultRendererState, action) => {
  switch (action.type) {
    case '/renderer/STATE':
//      console.log('**** /renderer/STATE', action);
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
    case '/renderer/FOREGROUND':
      return {
        ...state,
        foreground: action.payload
      };
    case '/renderer/BACKGROUND':
      return {
        ...state,
        background: action.payload
      };
    case '/renderer/CLEAR_COLOUR':
      return {
        ...state,
        clearColour: action.payload
      };
    case '/renderer/INVERT':
      return {
        ...state,
        invert: action.payload
      };
    case '/renderer/REQUEST':
      return {
        ...state,
        [`req_${action.payload}`]: state.frame
      };
    default:
      return state;
  }
};

export default rendererState;
