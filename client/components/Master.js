import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

@provide
class Master extends React.Component {
  static propTypes = {
    // TODO: rendererState
    // setRendererState
  };

  render() {
    return (
      <div>
        <button>off</button>
        <button>play</button>
        <button>pause</button>
      </div>
    );
  }
}
export default Master;
