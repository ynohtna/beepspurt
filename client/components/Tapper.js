/* eslint-disable no-console */
import React, { PropTypes } from 'react';
import { Button, CheckBox } from './Inputs.js';
import { now } from '../utils.js';

class Tapper extends React.Component {
  static propTypes = {
    onIntervalChange: PropTypes.func,
    onPulse: PropTypes.func
  };

  state = {
    flash: false,
    enabled: false,
    lastPulse: null,
    nextPulse: null,
    lastTap: null,
    interval: null
  };

/*
  componentWillUpdate(nextProps, nextState) {
    console.log('****', nextState);
  }
*/

  onEnableToggle = () => {
    this.setState({ enabled: !this.state.enabled });
  };

  onTap = () => {
    const { lastTap, interval } = this.state;
    const t = now();

    console.log(`TAP ${t}`);

    if (lastTap === null) {
      // This is first tap.
      // Do nothing, await second tap to set initial interval.
      this.setState({ lastTap: t });
    } else if (interval === null) {
      // Second tap. First completed interval.
      const dt = t - lastTap;
      this.pulse(t, dt);
      this.setState({ lastTap: t, interval: dt });
    } else {
      // Subsequent tap. Restart sequence if too long since last tap.
      const dt = t - lastTap;

      // TODO: Determine logic for being slightly earlier than next pulse
      // so unnecessary repulse can be avoided..

      const dtMin = interval * 0.7;
      const dtMax = Math.max(interval * 1.3, interval + 250);
      if (dt < dtMin) {
        // Too quick. Restart sequence.
        this.pulse(t, dt);
        this.setState({ lastTap: t, interval: null });
      } else if (dt <= dtMax) {
        // Continuing tap sequence.
        // Average interval.
        const dt2 = (interval + dt) / 2;
        this.pulse(t, dt2);
        this.setState({ lastTap: t, interval: dt2 });
      } else {
        // Too slow. Restart sequence.
        this.pulse(t, dt);
        this.setState({ lastTap: t, interval: null });
      }
    }
  }

  pulse = (t, dt) => {
    const { enabled } = this.state;
    const { onPulse } = this.props;
    if (enabled && onPulse) {
      onPulse();
      console.log(`PULSED ${t} ${dt}`);
    }

    if (this._timer) {
      clearTimeout(this._timer);
    }
    const next = t + dt;
    this._timer = setTimeout(() => this.pulse(next, dt), dt);
    this.setState({ lastPulse: t, nextPulse: t + dt, flash: true });
    setTimeout(() => this.setState({ flash: false }), 50);
  }

  render() {
    const { enabled, flash } = this.state;
    const flashClass = flash ? 'flash' : '';
    return (
      <span className={`tapper ${flashClass}`}>
        <CheckBox className='enable'
                  checked={enabled}
                  onChange={this.onEnableToggle}
        />
        <Button className='tap-button'
                onClick={this.onTap}>
          {'•'}
        </Button>
      </span>
    );
  }
}
export default Tapper;
