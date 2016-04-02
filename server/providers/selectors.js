// FIXME: Reference from serverSaga or, better, collated actions module.
const SERVER_SEND = '/server/SEND';

const selectors = [{
  selector: state => state.rendererState.state,
  memo: state => `${state}`,
  action: state => ({
    type: SERVER_SEND,
    addr: '/renderer/STATE',
    args: {
      state
    }
  })
}];
export default selectors;
