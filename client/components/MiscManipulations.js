import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

@provide
class MiscManipulations extends React.Component {
  static propTypes = {
    manipulationPanelIsOpen: PropTypes.bool.isRequired,
    toggleManipulationPanelState: PropTypes.func.isRequired,
    autoEditUponActivation: PropTypes.bool.isRequired,
    toggleAutoEditUponActivation: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className='misc-manipulations'>
        <a className={this.props.manipulationPanelIsOpen ? 'on' : 'off'}
           onClick={this.props.toggleManipulationPanelState}>
          manipulators
        </a>
        <a className={this.props.autoEditUponActivation ? 'on' : 'off'}
           onClick={this.props.toggleAutoEditUponActivation}>
          auto-edit
        </a>
      </div>
    );
  }
}

export default MiscManipulations;
