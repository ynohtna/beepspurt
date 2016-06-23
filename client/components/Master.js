import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

const nullClass = '';

@provide
class Master extends React.Component {
  static propTypes = {
    masterState: PropTypes.any,
    sendSocket: PropTypes.func.isRequired,
    invertedOutput: PropTypes.bool.isRequired,
    invertOutput: PropTypes.func.isRequired
  };

  stateChange(state) {
    this.props.sendSocket('/renderer/STATE', state);
  }

  invert() {
    const { invertOutput, invertedOutput, sendSocket } = this.props;
    invertOutput();

    const colours = [[255, 255, 255, 255],
                     [0, 0, 0, 255]];
    const i = invertedOutput | 0;
    sendSocket('/renderer/CLEAR_COLOUR', colours[i]);
    sendSocket('/spurter/COLOUR', colours[1 - i]);
  }

  render() {
    const { invertedOutput, masterState } = this.props;
    const { state } = masterState;

    const activeOff = (state === 'off') ? 'active' : nullClass;
    const activeRun = (state === 'run') ? 'active' : nullClass;
    const activePause = (state === 'pause') ? 'active' : nullClass;
    const activeInvert = invertedOutput ? 'active' : nullClass;

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
        <button className={`inverter ${activeInvert}`}
                onClick={() => this.invert()}
        >
          invert
        </button>
      </span>
    );
  }
}
export default Master;
