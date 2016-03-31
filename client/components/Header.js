import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

const pingBarStyle = {
  height: 1,
  marginBottom: 3,
  marginLeft: 2,
  backgroundColor: '#fff',
  display: 'inline-block'
};

const connectedStates = {
  'open': true,
  'opening': true
};

@provide
class Header extends React.Component {
  static propTypes = {
    socketStatus: PropTypes.string.isRequired,
    pingInfo: PropTypes.number.isRequired,
    openSocket: PropTypes.func.isRequired
  };

  status(socketStatus) {
    switch (socketStatus) {
      case 'opening':
        return '^';
      case 'open':
        return '\u2261';
      case 'closed':
        return '\u2a2f';
      case 'error':
        return '\u26a0';
      default:
        return '?';
    }
  }

  reconnect() {
    console.log('... RECONNECTING ...');
    this.props.openSocket();
  }

  render() {
//    console.log('Header', this.props);
    const { pingInfo, socketStatus } = this.props;
    const status = this.status(socketStatus);
    const pingDelay = (pingInfo !== -1) ? (pingInfo === 0 ? '\u2713' : pingInfo) : '\u2a2f';
    const reconnect = (socketStatus in connectedStates) ?
                      null :
                      (<a className='reconnect' onClick={::this.reconnect}>reconnect</a>);
    return (
      <div className={socketStatus}>
        <span className='status'>{status}</span>
        <span className='ping'>{pingDelay}</span>
        {reconnect}
      </div>
    );
  }
}
export default Header;
