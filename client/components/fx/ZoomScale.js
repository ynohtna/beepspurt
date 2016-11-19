import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button } from '../Inputs';

@provide
class ZoomScale extends React.Component {
  static propTypes = {
    zoomScale: PropTypes.number.isRequired,
    setZoomScale: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired
  };

  // decrement
  // scale
  // increment

  dec() {
    let zs = this.props.zoomScale;
    if (zs > 0.1) {
      zs = ((zs * 10) - 1) / 10;
      this.props.setZoomScale(zs);
    }
  }

  inc() {
    let zs = this.props.zoomScale;
    if (zs < 1000.0) { // TODO: Alter increment amount according to value.
      zs = ((zs * 10) + 1) / 10;
      this.props.setZoomScale(zs);
    }
  }

  render() {
    return (
      <section className='zoom-scale'>
        <h4>Zoom Scale</h4>
        <Button className='numeric' onClick={::this.dec}>
          -
        </Button>
        { this.props.zoomScale.toFixed(1) }
        <Button className='numeric' onClick={::this.inc}>
          +
        </Button>
      </section>
    );
  }
}

export default ZoomScale;
