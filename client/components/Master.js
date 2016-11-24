import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import Tapper from './Tapper';

const nullClass = '';

@provide
class Master extends React.Component {
  static propTypes = {
    masterState: PropTypes.any,
    sendSocket: PropTypes.func.isRequired,
    invertedOutput: PropTypes.bool.isRequired,
    invertOutput: PropTypes.func.isRequired,
    editorPanelIsOpen: PropTypes.bool.isRequired,
    toggleEditorPanelState: PropTypes.func.isRequired
  };

  stateChange(state) {
    this.props.sendSocket('/renderer/STATE', state);
  }

  invert = () => {
    const { invertOutput, invertedOutput, sendSocket } = this.props;
    invertOutput();

    const inverted = 1 - (invertedOutput | 0);
    sendSocket('/renderer/INVERT', inverted);
  }

  render() {
    const {
      invertedOutput,
      masterState,
      editorPanelIsOpen,
      toggleEditorPanelState
    } = this.props;
    const { state } = masterState;

    const activeOff = (state === 'off') ? 'active' : nullClass;
    const activeRun = (state === 'run') ? 'active' : nullClass;
    const activePause = (state === 'pause') ? 'active' : nullClass;
    const activeInvert = invertedOutput ? 'active' : nullClass;

    return (
      <span className='master'>
        <span className='rendererControls'>
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
        <button className={`inverter ${activeInvert}`}
                onClick={this.invert}
        >
          invert
        </button>
        <Tapper
            onPulse={this.invert}
        />
        <a className='hide-show-editor'
           onClick={toggleEditorPanelState}>
          {editorPanelIsOpen ? '\u2b45' : '\u2b46'}
        </a>
      </span>
    );
  }
}

export default Master;
