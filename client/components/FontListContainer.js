import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import FontList from './FontList';

/*
   style={{ ...rowParent, ...flexContainer,
   flexWrap: 'wrap',
   justifyContent: 'space-between' }}
 */

@provide
class FontListContainer extends React.Component {
  static propTypes = {
    styling: PropTypes.object.isRequired,
    fontList: PropTypes.array.isRequired,
    fontPanelIsOpen: PropTypes.bool.isRequired,
    setFont: PropTypes.func.isRequired
  };

  render() {
    const { fontFamily } = this.props.styling;
    const showFontClass = this.props.fontPanelIsOpen ? 'show-fonts' : 'hide-fonts';
    return (
        <FontList className={`font-list ${showFontClass}`}
                  fonts={this.props.fontList}
                  selected={fontFamily}
                  onClick={this.props.setFont}/>
    );
  }
}
export default FontListContainer;
