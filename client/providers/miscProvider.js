// CLIENT PROVIDER!
const INVERT_OUTPUT = '/misc/INVERT_OUTPUT';

const actions = {
  invertOutput: () => ({ type: INVERT_OUTPUT })
};

const reducers = {
  invertedOutput: (state = false, action) => {
    switch (action.type) {
      case INVERT_OUTPUT:
        return !state;
      default:
        return state;
    }
  }
};

export default {
  actions,
  reducers
};
