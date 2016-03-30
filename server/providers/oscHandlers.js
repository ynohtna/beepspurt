/* eslint-disable no-console */
// Mapping of OSC addresses to Redux actions.
// Return a falsey value to inhibit a put.
// TODO: Support returning arrays of actions for multi-dispatch.
import parseCSSColor from './csscolorparser';

const oscHandlers = {
  '/vars/CLEAR_COLOUR': msg => {
    const action = { type: '/renderer/CLEAR_COLOUR', payload: [0, 0, 0, 0] };
    const input = msg.args[0];
    console.log('CLEAR_COLOUR input:', input);
    const colour = parseCSSColor(input);
    if (colour) {
      action.payload = colour;
      console.log('CLEAR_COLOUR output:', colour);
    }
    return action;
  },
  '/vars/COLOUR': msg => {
    const action = { type: '/vars/COLOUR', payload: [255, 255, 255, 255] };
    const input = msg.args[0];
    console.log('COLOUR input:', input);
    const colour = parseCSSColor(input);
    if (colour) {
      action.payload = colour;
      console.log('COLOUR output:', colour);
      return action;
    }
    return null;
  }
};

export default oscHandlers;
