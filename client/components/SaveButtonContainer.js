import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button } from './Inputs';
import { flexChild, flexNone } from '../flexStyles';

@provide
class SaveButtonContainer extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    alignment: PropTypes.object.isRequired,
    styling: PropTypes.object.isRequired,
    saveWord: PropTypes.func.isRequired,
    saveNewWord: PropTypes.func.isRequired
  };

  wordData() {
    const { message, alignment, styling } = this.props;
    const { fontFamily, bold, italic } = styling;
    const { halign, valign } = alignment;
    return { message, fontFamily, bold, italic, halign, valign };
  }

  saveWord() {
    const word = this.wordData();
    this.props.saveWord(word);
  }

  saveNewWord() {
    const word = this.wordData();
    this.props.saveNewWord(word);
  }

  render() {
    return (
      <span style={{ ...flexChild, ...flexNone }}>
        <Button className='round-button save'
                onClick={::this.saveWord}>
          save
        </Button>
        <Button className='round-button save-new'
                onClick={::this.saveNewWord}>
          save new
        </Button>
      </span>
    );
  }
}

export default SaveButtonContainer;
