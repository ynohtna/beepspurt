import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import Styling from './Styling';

@provide
class StylingContainer extends React.Component {
  static propTypes = {
    styling: PropTypes.object.isRequired,
    setBold: PropTypes.func.isRequired,
    setItalic: PropTypes.func.isRequired,
    toggleFontPanelState: PropTypes.func.isRequired,
    fontPanelIsOpen: PropTypes.bool.isRequired
  };

  render() {
    const {
      styling,
      setBold,
      setItalic,
      fontPanelIsOpen,
      toggleFontPanelState
    } = this.props;
    const {
      bold,
      italic,
      fontFamily,
      fontSize = 80
    } = styling;
    const showFontClass = fontPanelIsOpen ? 'show-fonts' : 'hide-fonts';
    const stylingProps = { bold, italic, setBold, setItalic };

    return (
      <Styling className='styling flex-all'
               {...stylingProps}>
        <a className={showFontClass}
           style={{ fontSize: `${fontSize}%`,
                    fontFamily,
                    maxHeight: '1.5rem' }}
           onClick={() => toggleFontPanelState()}>
          {fontFamily}
        </a>
      </Styling>
    );
  }
}
export default StylingContainer;
