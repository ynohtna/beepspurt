import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { TextArea } from './Inputs';
import { halignClassLookup, valignClassLookup } from '../utils';

@provide
class TextAreaContainer extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
    alignment: PropTypes.object.isRequired,
    styling: PropTypes.object.isRequired
  };

//  onBlur = () => console.log('onBlur!');
//  onFocus = () => console.log('onFocus!');

  render() {
    const { message, setMessage, alignment, styling } = this.props;
    const {
      halign,
      valign
    } = alignment;
    const {
      bold,
      italic,
      fontFamily,
      fontSize = 100
    } = styling;
    const halignClass = halignClassLookup(halign);
    const valignClass = valignClassLookup(valign);
    const fontStyle = {
      fontFamily,
      fontSize: `${fontSize + 40}%`,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal'
    };
    return (
      <TextArea className={`word-area dbl-click flex-all ${halignClass} ${valignClass}`}
                style={{ ...fontStyle }}
                autoComplete='off' cols={30} rows={4}
                value={message}
                onChange={setMessage}
      />
    );
    // onFocus={this.onFocus}
    // onBlur={this.onBlur}
  }
}
export default TextAreaContainer;
