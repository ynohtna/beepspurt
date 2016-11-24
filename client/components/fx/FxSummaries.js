import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

@provide
class FxSummaries extends React.Component {
  static propTypes = {
    currentFxDescription: PropTypes.string.isRequired,
    defaultFxDescription: PropTypes.string.isRequired
  };

  render() {
    return (
      <span className='fx-summaries'>
        <small>{`[current: ${this.props.currentFxDescription}]`}</small>
        <small>{`[default: ${this.props.defaultFxDescription}]`}</small>
      </span>
    );
  }
}

export default FxSummaries;
