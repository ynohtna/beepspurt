const SAVE_FX_DEFAULT = '/fx/SAVE_DEFAULT';
const RESET_FX_DEFAULT = '/fx/RESET_DEFAULT';
const MERGE_FX = '/fx/MERGE';

const SET_ZOOM_SCALE = '/fx/set/ZOOM_SCALE';
const SET_PHOTO_FILL_MODE = '/photo/FILL_MODE';
const SET_PHOTO_ENABLE = '/photo/ENABLE';
const CHOOSE_PHOTO_FILE = '/photo/FILE';

const actions = {
  saveFxDefault: () => ({ type: SAVE_FX_DEFAULT }),
  resetFxDefault: () => ({ type: RESET_FX_DEFAULT }),
  mergeFx: fx => ({ type: MERGE_FX, fx }),
  setZoomScale: zoomScale => ({ type: SET_ZOOM_SCALE, zoomScale }),
  setPhotoFillMode: photoFillMode => ({ type: SET_PHOTO_FILL_MODE, photoFillMode }),
  setPhotoEnable: photoEnable => ({ type: SET_PHOTO_ENABLE, photoEnable }),
  choosePhotoFile: photoFile => ({ type: CHOOSE_PHOTO_FILE, photoFile })
};

const initialState = {
  zoomScale: 100, // percentage
//  photoList: [], // updated by server within socketSaga
  photoFillMode: 'contain',
  photoEnable: false,
  photoFile: ''
};

const savedDefault = window.localStorage &&
                     !window.location.hash.includes('noload') &&
                     window.localStorage.getItem('fxDefault') &&
                     JSON.parse(window.localStorage.getItem('fxDefault'));
let fxDefault = {
  ...initialState,
  ...(savedDefault ? savedDefault.data : null)
};

const reducers = {
  zoomScale: (state = fxDefault.zoomScale, action) => {
    switch (action.type) {
      case SET_ZOOM_SCALE:
        return action.zoomScale;
      case RESET_FX_DEFAULT:
        return fxDefault.zoomScale || state;
      case MERGE_FX:
        return action.fx.zoomScale || state;
      default:
        return state;
    }
  },
  photoFillMode: (state = fxDefault.photoFillMode, action) => {
    switch (action.type) {
      case SET_PHOTO_FILL_MODE:
        return action.photoFillMode;
      case RESET_FX_DEFAULT:
        return fxDefault.photoFillMode || state;
      case MERGE_FX:
        return action.fx.photoFillMode || state;
      default:
        return state;
    }
  },
  photoFile: (state = fxDefault.photoFile, action) => {
    switch (action.type) {
      case CHOOSE_PHOTO_FILE:
        return action.photoFile;
      case RESET_FX_DEFAULT:
        return fxDefault.photoFile || state;
      case MERGE_FX:
        return action.fx.photoFile || state;
      default:
        return state;
    }
  },
  photoEnable: (state = fxDefault.photoEnable, action) => {
    switch (action.type) {
      case SET_PHOTO_ENABLE:
        return action.photoEnable;
      case RESET_FX_DEFAULT:
        return fxDefault.photoEnable || state;
      case MERGE_FX:
        return action.fx.photoEnable || state;
      default:
        return state;
    }
  }
};

let lastSavedDefault = null;

const middleware = store => next => action => {
  const result = next(action);
  const state = store.getState();

  // Handle SAVE_FX_DEFAULT.
  if (action.type === SAVE_FX_DEFAULT) {
    fxDefault = { ...fxDefault, ...state };
    console.warn('>>>> new default FX:', fxDefault); // eslint-disable-line no-console
  }

  // Early out if fx default is unchanged.
  if (lastSavedDefault === fxDefault) {
    return result;
  }

  // Persist updated default fx.
  try {
    const fxDefaultState = JSON.stringify({ data: fxDefault });
    window.localStorage.setItem('fxDefault', fxDefaultState);
    console.warn('+ fxDefault persisted +', fxDefaultState); // eslint-disable-line no-console
    lastSavedDefault = fxDefault;
  } catch (e) {
    console.error('Failed to persist fxDefault: ', e); // eslint-disable-line no-console
  }

  return result;
};

export default {
  actions,
  reducers,
  middleware
};
