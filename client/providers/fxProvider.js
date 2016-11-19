const SET_ZOOM_SCALE = '/fx/set/ZOOM_SCALE';
const MERGE_FX = '/fx/MERGE';

const actions = {
  setZoomScale: zoomScale => ({ type: SET_ZOOM_SCALE, zoomScale }),
  mergeFx: fx => ({ type: MERGE_FX, fx })
};

const reducers = {
  zoomScale: (state = 1.0, action) => {
    switch (action.type) {
      case SET_ZOOM_SCALE:
        return action.zoomScale;
      case MERGE_FX:
        return action.fx.zoomScale || state;
      default:
        return state;
    }
  }
};

export default {
  actions,
  reducers
};
