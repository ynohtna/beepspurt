import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button } from './Inputs';

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

  componentDidMount() {
    window.Mousetrap.bind('ctrl+p', ::this.activatePrev);
    window.Mousetrap.bind('ctrl+n', ::this.activateNext);
  }

  componentWillUnmount() {
    window.Mousetrap.unbind('ctrl+p');
    window.Mousetrap.unbind('ctrl+n');
  }

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

  activatePrev() {
    this.props.activatePrevWord();
    this.sendActive();
  }

  activateNext() {
    this.props.activateNextWord();
    this.sendActive();
  }

  render() {
    return (
      <div className='sequencer'>
        <Button className='round-button prev'
                    onClick={::this.activatePrev}>
          {'prev \u21a5'}
        </Button>
        <Button className='round-button next'
                onClick={::this.activateNext}>
          {'\u21a7 next'}
        </Button>
      </div>
    );
  }
}

export default Sequencer;
