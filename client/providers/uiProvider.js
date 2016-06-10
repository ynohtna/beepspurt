const panels = [
  'Font'
];

const makeActionType = (panel, type) => `/ui/${panel}Panel/${type}`;

const actions = panels.reduce((out, panel) => ({
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

const reducePanelState = (panel, initiallyOpen = false) => (state = initiallyOpen, action) => {
  let newState = state;
  if (action.type === makeActionType(panel, 'STATE')) {
    newState = !!action.open;
  } else if (action.type === makeActionType(panel, 'TOGGLE')) {
    newState = !state;
  }
  return newState;
};

const reducers = panels.reduce((out, panel) => ({
  ...out,
  [`${panel.toLowerCase()}PanelIsOpen`]: reducePanelState(panel)
}), {});

export default {
  actions,
  reducers
};
