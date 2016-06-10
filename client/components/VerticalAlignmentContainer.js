import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import VerticalAlignment from './VerticalAlignment';

@provide
class VerticalAlignmentContainer extends React.Component {
  static propTypes = {
    alignment: PropTypes.object.isRequired,
    setVerticalAlignment: PropTypes.func.isRequired
  };

  valign = alignment => {
    this.props.setVerticalAlignment(alignment);
  };

  render() {
    return (
      <VerticalAlignment className='vertical-alignment'
                         alignment={this.props.alignment.valign}
                         onChange={this.valign} />
    );
  }
}
export default VerticalAlignmentContainer;
