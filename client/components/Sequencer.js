import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button } from './Inputs';
import transmitFx from './fx/transmitFx';

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
    defaultFx: PropTypes.object.isRequired,
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
    // FIXME: Somehow get this action to WordList so it can auto-edit, etc.
    // Maybe through a 'sequencerAction' store element that contains 'next', 'prev':
    // this component sets it, and WordList responds (and resets the action to '').
    const words = this.props.wordList;
    const index = words.findIndex(w => (w.activated === true));
    if (index >= 0) {
      const { uuid, fx, ...word } = words[index];
      this.props.sendSocket('/spurter/STATE', word);
      if (uuid) {
        console.log(`UUID: ${uuid}`); // eslint-disable-line no-console
      }
      transmitFx(this.props.sendSocket, { ...this.props.defaultFx, ...fx });
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
