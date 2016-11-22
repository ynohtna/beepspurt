import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button, TextButton, CheckBox } from '../Inputs';
import { shallowEqual } from '../../utils';
import fxDescription from './fxDescription';
import transmitFx from './transmitFx';

@provide
class FxControl extends React.Component {
  static propTypes = {
    zoomScale: PropTypes.number.isRequired,
    photoEnable: PropTypes.bool.isRequired,
    photoFillMode: PropTypes.string.isRequired,
    photoFile: PropTypes.string.isRequired,
    saveFxDefault: PropTypes.func.isRequired,
    resetFxDefault: PropTypes.func.isRequired,
    defaultFx: PropTypes.object.isRequired,
    saveFxToEditingWord: PropTypes.func.isRequired,
    saveFxToActivatedWord: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired
  };
  static checkedProps = ['zoomScale',
                         'photoEnable', 'photoFillMode', 'photoFile'];

  state = {
    autoSend: false,
    sending: false
  };

  extractProps = overrideProps => this.constructor.checkedProps.reduce((acc, val) => ({
    ...acc,
    [val]: (overrideProps && val in overrideProps) ? overrideProps[val] : this.props[val]
  }), {});

  transmitMessage = (props) => {
    transmitFx(this.props.sendSocket, { ...this.props, ...props });
    /*
       // Send messages. TODO: Bundled message transmissions.
       const {
       zoomScale,
       photoEnable, photoFillMode, photoFile
       } = ;
       this.props.sendSocket('/spurter/ZOOM_SCALE', zoomScale);

       if (photoEnable) {
       this.props.sendSocket('/photo/FILL', photoFillMode);
       this.props.sendSocket('/photo/FILE', photoFile);
       } else {
       this.props.sendSocket('/photo/FILE', '');
       }
     */
    this.cancelTimer();
    this.setState({ sending: true });
    this._timer = setTimeout(this.resetIndicator, 66);
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

  saveToEdit = () => {
    const fx = this.extractProps();
    this.props.saveFxToEditingWord(fx);
  };

  saveToActive = () => {
    const fx = this.extractProps();
    this.props.saveFxToActivatedWord(fx);
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
          <Button className='round-button save-edit'
                  onClick={this.saveToEdit}>
            {'\u27a6 edit'}
          </Button>
          <Button className='round-button save-active'
                  onClick={this.saveToActive}>
            {'\u27a6 active'}
          </Button>
        </div>

        <hr />

        <div>
          <TextButton onClick={this.saveDefault}>
            save to def
          </TextButton>
          <TextButton onClick={this.resetDefault}>
           reset from def
          </TextButton>
        </div>
        <div>
          <small>{fxDescription(this.props.defaultFx)}</small>
        </div>
      </div>
    );
  }
}
export default FxControl;
