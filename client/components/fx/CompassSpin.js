import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { TextButton } from '../Inputs';

const fix2 = n => ((n === null) ?
                   'null'
                 : (Number(n) >= 0.0 ? '+' : '') + Number(n).toFixed(2));

/*
   Calibration
   Average over successive events to smooth & reduce bandwidth.
 */

class CompassSpin extends React.Component {
  state = {
    enabled: false,
    absolute: false,
    alpha: NaN,
    beta: 0,
    gamma: 0,
    samples: 0
  };
  static calibrationZero = {
    alpha: 0,
    beta: 0,
    gamma: 0
  };
  calibration = this.constructor.calibrationZero;

  componentWillMount() {
    if (this.state.enabled) {
      this.startListening();
    }
  }

  componentWillUnmount() {
    this.stopListening();
  }

  startListening() {
    if (!this.listening && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this, true);
      this.listening = true;
      this.accum_ = { ...this.constructor.calibrationZero };
      this.t_ = performance.now();
      this.s_ = 0;
    }
  }

  stopListening() {
    if (this.listening) {
      window.removeEventListener('deviceorientation', this, true);
      this.listening = false;
      // TODO: Update with final readings.
    }
  }

  handleEvent = e => {
    const {
      absolute, // in reference to Earth's coordinate frame?
      alpha,	// rotation around z axis, 0 to 360 degrees.
      beta,		// motion around x axis, -180 to 180 degrees.
      gamma		// motion around y axis, -90 to 90 degrees.
    } = e;
    let a = alpha - this.calibration.alpha;
    let b = beta - this.calibration.beta;
    let g = gamma - this.calibration.gamma;

    this.accum_.alpha += a;
    this.accum_.beta += b;
    this.accum_.gamma += g;
    this.s_ += 1;

    const now = performance.now();
    const interval = now - this.t_;
    if (interval > 75) {
      a = this.accum_.alpha / this.s_;
      b = this.accum_.beta / this.s_;
      g = this.accum_.gamma / this.s_;
      this.setState({ absolute, alpha: a, beta: b, gamma: g, samples: this.s_ });
      this.accum_ = { ...this.constructor.calibrationZero };
      this.t_ = now;
      this.s_ = 0;
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

  onCalibrate = () => {
    const { alpha, beta, gamma } = this.state;
    this.calibration = {
      alpha,
      beta,
      gamma
    };
//    console.log(this);
  };

  onResetCalibration = () => {
    this.calibration = this.constructor.calibrationZero;
//    console.log(this);
  };

  onZero = () => {
    this.setState({ alpha: 0, beta: 0, gamma: 0 });
  };

  render() {
    const { enabled, absolute, alpha, beta, gamma, samples } = this.state;
    const enableClass = enabled ? 'enabled' : 'disabled';
    return (
      <section className={`compass-spin ${enableClass}`}>
        <h4 className='clickable'
            onClick={this.onToggleEnable}>
          {'Compass:'}
        </h4>
        <span className='readings'>
          {`${fix2(alpha)} ${fix2(beta)} ${fix2(gamma)} ${absolute ? '\u2641' : ''}`}
        </span>
        <span className='samples'>
          {samples}
        </span>
        <TextButton className='calibrate'
                    onClick={this.onCalibrate}>
          {'\u2727'}
        </TextButton>
        <TextButton className='calibration'
                    onClick={this.onResetCalibration}>
          {'\u271c'}
        </TextButton>
        <TextButton className='calibration'
                    onClick={this.onZero}>
          {'\u27c1'}
        </TextButton>
      </section>
    );
  }
}

export default CompassSpin;
