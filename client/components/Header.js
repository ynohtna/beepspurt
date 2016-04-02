import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

const connectedStates = {
  open: true,
  opening: true
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

  reload() {
    window.location.reload();
  }

  render() {
//    console.log('Header', this.props);
    const { pingInfo, socketStatus } = this.props;
    const status = this.status(socketStatus);
    let pingSymbol = '\u2a2f'; // Small cross as ping symbol for unknown states.
    let pingColour = '';
    if (pingInfo === -2) {
      pingSymbol = '\u00b7';
    } else if (pingInfo === 0) {
      pingSymbol = '\u2713';
    } else if (pingInfo > 0) {
      pingSymbol = `${pingInfo}`;
      if (pingInfo > 7) {
        pingColour = 'danger';
      } else if (pingInfo > 3) {
        pingColour = 'warning';
      } else {
        pingColour = 'notify';
      }
    }
    const reconnect = (socketStatus in connectedStates) ?
                      null :
                      (<a className='reconnect' onClick={::this.reconnect}>reconnect</a>);
    return (
      <span className={`header ${socketStatus}`}>
        <span className='status'>
          {status}
        </span>
        <span className={`ping ${pingColour}`}>
          {pingSymbol}
        </span>
        {reconnect}
        <h1>[beep]spurter</h1>
        <a className='reload' onClick={::this.reload}>reload</a>
      </span>
    );
  }
}
export default Header;
