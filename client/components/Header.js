import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

@provide
class Header extends React.Component {
  static propTypes = {
    socketStatus: PropTypes.string,
    pingInfo: PropTypes.string
  };

  render() {
    return (
      <div>{this.props.socketStatus}&bull;{this.props.pingInfo}</div>
    );
  }
}
export default Header;

