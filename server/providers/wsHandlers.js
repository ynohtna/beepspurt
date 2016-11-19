// Mapping of received websocket messages
//   (with shape { addr: "", id: "", args: [] })
// to Redux action with transformed payload.
// Return a falsey value to inhibit dispatch.

const mungeArgs = args => ((args.length === 1) ? args[0] : args);

const dispatchHandler = ({ addr, id, args }) => ({ type: addr,
                                                   id,
                                                   payload: mungeArgs(args) });
// TODO: Coerce/validate args.
const wsHandlers = {
  '/renderer/STATE': dispatchHandler,
  '/renderer/FOREGROUND': dispatchHandler,
  '/renderer/BACKGROUND': dispatchHandler,
  '/renderer/INVERT': dispatchHandler,
  '/spurter/STATE': dispatchHandler,
  '/spurter/MERGE': dispatchHandler,
  '/spurter/MESSAGE': dispatchHandler,
  '/spurter/FONT_FAMILY': dispatchHandler,
  '/spurter/BOLD': dispatchHandler,
  '/spurter/ITALIC': dispatchHandler,
  '/spurter/HALIGN': dispatchHandler,
  '/spurter/VALIGN': dispatchHandler,
  '/ext/ARENA': dispatchHandler
  // TODO: Update with full set of server exposed reducer actions.
};

export default wsHandlers;
