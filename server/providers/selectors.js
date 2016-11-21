// FIXME: Reference from serverSaga or, better, collated actions module.
const SERVER_SEND = '/server/SEND';

// List of selected substate definitions that are checked upon an UPDATE_CLIENTS action
// and converted into server actions if they have changed.
const selectors = [
  { // rendererState state: 'run', 'pause', 'off'
    selector: state => state.rendererState.state,
    memo: state => `${state}`,
    action: state => ({
      type: SERVER_SEND,
      addr: '/renderer/STATE',
      args: {
        state
      }
    })
  },
  { // photoState list: [ files that can be shown by the photo layer ]
    selector: state => state.photoState.list,
    memo: state => `${state}`,
    action: state => ({
      type: SERVER_SEND,
      addr: '/photo/LIST',
      args: Array.isArray(state) ? state : [state]
    })
  }
];
export default selectors;
