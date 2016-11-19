import React, { PropTypes } from 'react';
import CheckBox from '../Inputs';
import provide from 'react-redux-provide';

const fix2 = n => ((n === null) ?
                   'null'
                 : (Number(n) >= 0.0 ? '+' : '') + Number(n).toFixed(2));

/*
   Calibrate
   Engage/disengage transmission
 */

class CompassSpin extends React.Component {
  state = {
    enabled: false,
    absolute: false,
    alpha: NaN,
    beta: 0,
    gamma: 0
  };

  componentWillMount() {
    if (this.state.enabled) {
      this.startListening();
    }
  }

  componentWillUnmount() {
    this.stopListening();
  }

  startListening() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this, true);
      this.listening = true;
      this.first = true;
    }
  }

  stopListening() {
    if (this.listening) {
      window.removeEventListener('deviceorientation', this, true);
      this.listening = false;
    }
  }

  handleEvent = e => {
    const {
      absolute, // in reference to Earth's coordinate frame?
      alpha,	// rotation around z axis, 0 to 360 degrees.
      beta,		// motion around x axis, -180 to 180 degrees.
      gamma		// motion around y axis, -90 to 90 degrees.
    } = e;
    if (this.state.enabled || this.first) {
      this.setState({ absolute, alpha, beta, gamma });
      this.first = false;
    }
  };

  onToggleEnable = () => {
    const enabled = !this.state.enabled;
    if (enabled) {
      this.startListening();
    } else {
      this.stopListening();
    }
    this.setState({ enabled });
  };

  render() {
    const { enabled, absolute, alpha, beta, gamma } = this.state;
    return (
      <h3 className='compass-spin'>
        { 'Compass: '}
        { fix2(alpha) } { fix2(beta) } { fix2(gamma) }
        { absolute ? '\u2641' : '' }
        <input type='checkbox'
               checked={enabled}
               onChange={this.onToggleEnable} />
      </h3>
    );
  }
}

export default CompassSpin;
