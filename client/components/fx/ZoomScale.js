import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button } from '../Inputs';

@provide
class ZoomScale extends React.Component {
  static propTypes = {
    zoomScale: PropTypes.number.isRequired,
    setZoomScale: PropTypes.func.isRequired
  };

  // decrement
  // scale
  // increment

  dec() {
    let zs = this.props.zoomScale;
    if (zs > 1) {
      zs -= 1;
      this.props.setZoomScale(zs);
    }
  }

  inc() {
    let zs = this.props.zoomScale;
    if (zs < 10000) { // TODO: Alter increment amount according to value.
      zs += 1;
      this.props.setZoomScale(zs);
    }
  }

  render() {
    return (
      <section className='zoom-scale'>
        <h4>{'Zoom'}</h4>
        <Button className='numeric' onClick={::this.dec}>
          -
        </Button>
        { this.props.zoomScale }{'%'}
        <Button className='numeric' onClick={::this.inc}>
          +
        </Button>
      </section>
    );
  }
}

export default ZoomScale;
