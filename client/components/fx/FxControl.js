import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button, TextButton, CheckBox } from '../Inputs';
import { shallowEqual } from '../../utils';

@provide
class FxControl extends React.Component {
  static propTypes = {
    zoomScale: PropTypes.number.isRequired,
    saveFxDefault: PropTypes.func.isRequired,
    resetFxDefault: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired
  };
  static checkedProps = ['zoomScale'];

  state = {
    autoSend: false,
    sending: false
  };

  componentWillReceiveProps(nextProps) {
    let send = false;
    if (this.state.autoSend) {
      for (const k of this.constructor.checkedProps) {
        const equal = shallowEqual(this.props[k], nextProps[k]);
        if (!equal) {
          send = true;
          break;
        }
      }
    }
    if (send) {
      this.transmitMessage(nextProps);
    }
  }

  componentWillUnmount() {
    this.cancelTimer();
  }

  cancelTimer = () => {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  };

  resetIndicator = () => {
    this.setState({ sending: false });
    this._timer = null;
  };

  transmitMessage = (props) => {
    // Send messages. TODO: Bundled message transmissions.
    const { zoomScale } = { ...this.props, ...props };
    this.props.sendSocket('/spurter/ZOOM_SCALE', zoomScale);

    this.cancelTimer();
    this.setState({ sending: true });
    this._timer = setTimeout(this.resetIndicator, 66);
  };

  toggleAutoSend = () => {
    const autoSend = !this.state.autoSend;
    if (autoSend) {	// Transmit current state when enabling auto-send.
      this.transmitMessage();
    }
    this.setState({ autoSend });
  };

  saveDefault = () => {
    this.props.saveFxDefault();
  };

  resetDefault = () => {
    this.props.resetFxDefault();
  };

  render() {
    const { autoSend, sending } = this.state;
    const checkedClassName = autoSend ? 'checked' : 'unchecked';
    const sendingClassName = sending ? 'sending' : 'inactive';

    return (
      <div className='fx-control'>
        <div className='fat'>
          <CheckBox className={`auto-send ${checkedClassName}`}
                    checked={autoSend}
                    onChange={this.toggleAutoSend}>
            auto-send
          </CheckBox>
          <span className={`sender ${sendingClassName}`} />
          <Button className='round-button transmit'
                  onClick={this.transmitMessage}>
            {'\u21e1 send \u21e1'}
          </Button>
        </div>

        <div className='fat'>
          <Button className='round-button save-edit'>
            {'\u27a6 edit'}
          </Button>
          <Button className='round-button save-active'>
            {'\u27a6 active'}
          </Button>
        </div>

        <div>
          <TextButton onClick={this.saveDefault}>
            def-save
          </TextButton>
          <TextButton onClick={this.resetDefault}>
            def-reset
          </TextButton>
        </div>
      </div>
    );
  }
}
export default FxControl;
