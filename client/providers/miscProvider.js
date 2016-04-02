/*
// CLIENT PROVIDER!
const RENDERER_STATE = '/renderer/MERGE_STATE';

const defaultRendererState = {
  state: 'unknown'
};

const reducers = {
  hooper: (state = defaultRendererState, action) => {
//    console.warn('\n\nRENDERER REDUCER\n\n', action, state);
    switch (action.type) {
      case RENDERER_STATE: {
        const s = {
          ...state,
          ...action.payload
        };
        console.error('RENDERER_STATE', state, action);
        console.log(s);
        return s;
      }
      default:
        return state;
    }
  }
};

export default {
  reducers
};
*/
