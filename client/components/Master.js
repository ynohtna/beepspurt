import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

@provide
class Master extends React.Component {
  static propTypes = {
    // TODO: rendererState
    masterState: PropTypes.any,
    sendSocket: PropTypes.func.isRequired
  };

  stateChange(state) {
    console.log('Master stateChange request', state);
    this.props.sendSocket('/renderer/STATE', state);
  }

  render() {
    console.log('Master', this.props.masterState);
    const { state } = this.props.masterState;
    const activeOff = (state === 'off') ? 'active' : null;
    const activeRun = (state === 'run') ? 'active' : null;
    const activePause = (state === 'pause') ? 'active' : null;
    return (
      <span className='master'>
        <button className={activeOff}
                onClick={() => this.stateChange('off')}
        >
          off
        </button>
        <button className={activeRun}
                onClick={() => this.stateChange('run')}
        >
          run
        </button>
        <button className={activePause}
                onClick={() => this.stateChange('pause')}
        >
          pause
        </button>
      </span>
    );
  }
}
export default Master;
