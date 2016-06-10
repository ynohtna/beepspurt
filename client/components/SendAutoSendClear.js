import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button, CheckBox } from './Inputs';
import { shallowEqual } from '../utils';

@provide
class SendAutoSendClear extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    alignment: PropTypes.object.isRequired,
    styling: PropTypes.object.isRequired,
    clearMessage: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired
  };

  state = {
    autoSend: false,
    sending: false
  };

  componentWillReceiveProps(nextProps) {
    const checkedProps = ['message', 'alignment', 'styling'];
    let send = false;
    if (this.state.autoSend) {
      for (const k of checkedProps) {
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
    const { message, alignment, styling } = { ...this.props, ...props };
    const { fontFamily, bold, italic } = styling;
    const { halign, valign } = alignment;
    const msg = { message, fontFamily, bold, italic, halign, valign };
//    console.warn('sendSocket', msg);	// eslint-disable-line no-console
    this.props.sendSocket('/spurter/STATE', msg);

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

  render() {
    const { autoSend, sending } = this.state;
    const checkedClassName = autoSend ? 'checked' : 'unchecked';
    const sendingClassName = sending ? 'sending' : 'inactive';

    return (
      <div className='transmission-container'>

        <Button className='round-button send'
                onClick={this.transmitMessage}>
          send
        </Button>

        <div className={`sender ${sendingClassName}`} />

        <CheckBox className={`auto-send ${checkedClassName}`}
                  checked={autoSend}
                  onChange={this.toggleAutoSend}>
          auto-send
        </CheckBox>

        <a className='clear-link'
           onClick={this.props.clearMessage}>
          {'\u00d7\u00a0clear'}
        </a>
      </div>
    );
  }
}
export default SendAutoSendClear;
