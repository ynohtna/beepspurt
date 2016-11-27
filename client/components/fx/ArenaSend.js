import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { TextButton } from '../Inputs';

// text input
// multiple messages?

@provide
class ArenaSend extends React.Component {
  static propTypes = {
    sendSocket: PropTypes.func.isRequired
  };

  send() {
    this.props.sendSocket('/ext/ARENA',
                          '/layer1/activeclip/test',
                          'is',
                          0,
                          'test');
  }

  render() {
    return (
      <section>
        <h4>Arena Control</h4>
        <TextButton onClick={::this.send}>
          test
        </TextButton>
      </section>
    );
  }
}

export default ArenaSend;
