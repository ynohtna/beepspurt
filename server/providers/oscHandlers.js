/* eslint-disable no-console */
// Mapping of OSC addresses to Redux actions with transformed payload.
// Return a falsey value to inhibit dispatch.
import parseCSSColor from './csscolorparser';

const parseColourMsg = name => msg => {
  const action = { type: `/renderer/${name}`, payload: [0, 0, 0, 0] };
  const input = msg.args[0];
  console.log(`${name} input: ${input}`);
  const colour = parseCSSColor(input);
  if (colour) {
    action.payload = colour;
    console.log(`${name} output:`, colour);
  }
  return action;
};

// TODO: Whitelist accepted OSC messages. Coerce/validate args.
const oscHandlers = {
  '/renderer/FOREGROUND': parseColourMsg('FOREGROUND'),
  '/renderer/BACKGROUND': parseColourMsg('BACKGROUND')
};

export default oscHandlers;
