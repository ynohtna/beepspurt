import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button, TextButton } from './Inputs';

/*
   Previous
   Next

   Transition time
   Transition type
 */

@provide
class Sequencer extends React.Component {
  static propTypes = {
    activateNextWord: PropTypes.func.isRequired,
    activatePrevWord: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired,
    wordList: PropTypes.array.isRequired
  };

  sendActive() {
    // TODO: This would be better triggered by middleware or something similar?
    const words = this.props.wordList;
    const index = words.findIndex(w => (w.activated === true));
    if (index >= 0) {
      const { uuid, ...word } = words[index];
      this.props.sendSocket('/spurter/STATE', word);
      if (uuid) {
        console.log(`UUID: ${uuid}`); // eslint-disable-line no-console
      }
    }
  }

  activateNext() {
    this.props.activateNextWord();
    this.sendActive();
  }

  activatePrev() {
    this.props.activatePrevWord();
    this.sendActive();
  }

  render() {
    return (
      <div className='sequencer'>
        <TextButton className='small-text'
                    onClick={::this.activatePrev}>
          Prev
        </TextButton>
        <Button className='round-button next'
                onClick={::this.activateNext}>
          Next
        </Button>
      </div>
    );
  }
}

export default Sequencer;
