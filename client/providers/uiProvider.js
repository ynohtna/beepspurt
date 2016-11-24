const panels = [
  'Font',
  'Fx',
  'Manipulation'
];

const initialPanelStates = {
  Fx: true
};

// --------------------
const makeActionType = (panel, type) => `/ui/${panel}Panel/${type}`;

const panelActions = panels.reduce((out, panel) => ({
  ...out,
  [`open${panel}Panel`]: () => ({
    type: makeActionType(panel, 'STATE'),
    open: true
  }),
  [`close${panel}Panel`]: () => ({
    type: makeActionType(panel, 'STATE'),
    open: false
  }),
  [`set${panel}PanelState`]: open => ({
    type: makeActionType(panel, 'STATE'),
    open
  }),
  [`toggle${panel}PanelState`]: () => ({
    type: makeActionType(panel, 'TOGGLE')
  })
}), {});

const actions = {
  ...panelActions,
  toggleAutoEditUponActivation: () => ({ type: '/autoedit/TOGGLE' })
};

const reducePanelState = (panel, initiallyOpen = false) => (state = initiallyOpen, action) => {
  let newState = state;
  if (action.type === makeActionType(panel, 'STATE')) {
    newState = !!action.open;
  } else if (action.type === makeActionType(panel, 'TOGGLE')) {
    newState = !state;
  }
  return newState;
};

const panelReducers = panels.reduce((out, panel) => ({
  ...out,
  [`${panel.toLowerCase()}PanelIsOpen`]: reducePanelState(panel, initialPanelStates[panel])
}), {});

const reducers = {
  ...panelReducers,
  // TODO: Generic creator for toggleable boolean reducer & action.
  autoEditUponActivation: (state = false, action) => {
    switch (action.type) {
      case '/autoedit/TOGGLE':
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
