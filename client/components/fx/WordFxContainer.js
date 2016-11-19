import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

import ArenaSend from './ArenaSend';
import CompassSpin from './CompassSpin';
import ZoomScale from './ZoomScale';

/*
   FX:

   Arena OSC Send
   Photo Filename
   Background Mode
   Zoom Scale
   Alpha Scale
   Compass Spin
   Line Mask
*/

const FxToggler = ({ open, toggle }) => (
  <h2>
    <a onClick={() => toggle() }>
      { open ? 'Word FX\u25bf' : 'Word FX\u25b9' }
    </a>
  </h2>
);
FxToggler.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

@provide
class WordFxContainer extends React.Component {
  static propTypes = {
    fxPanelIsOpen: PropTypes.bool.isRequired,
    toggleFxPanelState: PropTypes.func.isRequired
  };

  renderCompass() {
    return window.DeviceOrientationEvent ? <CompassSpin /> : '';
  }

  renderOpen() {
    const {
      fxPanelIsOpen,
      toggleFxPanelState
    } = this.props;
    return (
      <section className='fx-container'>
        <FxToggler open={fxPanelIsOpen} toggle={toggleFxPanelState} />
        <ArenaSend />
        <ZoomScale />
        { this.renderCompass() }
      </section>
    );
  }

  renderClosed() {
    const {
      fxPanelIsOpen,
      toggleFxPanelState
    } = this.props;
    return (
      <section className='fx-container'>
        <FxToggler open={fxPanelIsOpen} toggle={toggleFxPanelState} />
      </section>
    );
  }

  render() {
    const {
      fxPanelIsOpen
    } = this.props;
    return fxPanelIsOpen ? this.renderOpen() : this.renderClosed();
  }
}

export default WordFxContainer;
