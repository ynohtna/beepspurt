import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import HorizontalAlignment from './HorizontalAlignment';

@provide
class HorizontalAlignmentContainer extends React.Component {
  static propTypes = {
    alignment: PropTypes.object.isRequired,
    setHorizontalAlignment: PropTypes.func.isRequired
  };

  halign = alignment => {
    this.props.setHorizontalAlignment(alignment);
  };

  render() {
    return (
      <HorizontalAlignment className='horizontal-alignment'
                           alignment={this.props.alignment.halign}
                           onChange={this.halign} />
    );
  }
}
export default HorizontalAlignmentContainer;
