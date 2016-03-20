// Mapping of OSC addresses to Redux actions.
// Return a falsey value to inhibit a put.
// TODO: Support returning arrays of actions for multi-dispatch.
const oscHandlers = {
  '/vars/CLEAR_COLOUR': msg => {
    const action = { type: '/renderer/CLEAR_COLOUR', payload: [0, 0, 0, 0] };
    switch (msg.args[0]) {
      case 'clear':
        action.payload = [0, 0, 0, 0];
        break;
      case 'black':
        action.payload = [0, 0, 0, 255];
        break;
      case 'gray':
      case 'grey':
        action.payload = [128, 128, 128, 128];
        break;
      case 'white':
        action.payload = [255, 255, 255, 255];
        break;
      default:
        action.payload = msg.args;
        break;
    }
    return action;
  }
};

export default oscHandlers;
