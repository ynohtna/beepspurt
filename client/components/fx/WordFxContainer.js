import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import FxControl from './FxControl';
import FxSummaries from './FxSummaries';
import ArenaSend from './ArenaSend';
import CompassSpin from './CompassSpin';
import PhotoLayer from './PhotoLayer';
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
   Colour/Background colour
*/

const FxToggler = ({ open, toggle }) => (
  <h2 className={open ? 'open' : 'closed'}>
    <a onClick={() => toggle() }>
      { open ? 'Word FX \u25bf' : 'Word FX \u25b9' }
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
        <FxControl />
        <ZoomScale />
        <PhotoLayer />
        <ArenaSend />
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
        <FxSummaries />
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
