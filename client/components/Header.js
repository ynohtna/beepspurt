import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

@provide
class Header extends React.Component {
  static propTypes = {
    socketStatus: PropTypes.string
  };

  render() {
    return (
      <div>{this.props.socketStatus}</div>
    );
  }
}
export default Header;

