import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import WordEntry from './WordEntry';
import transmitFx from './fx/transmitFx';

@provide
class WordList extends React.Component {
  static propTypes = {
    wordList: PropTypes.array.isRequired,
    delWord: PropTypes.func.isRequired,
    dupWord: PropTypes.func.isRequired,
    nudgeWord: PropTypes.func.isRequired,
    editWord: PropTypes.func.isRequired,
    activateWord: PropTypes.func.isRequired,
    mergeState: PropTypes.func.isRequired,
    mergeFx: PropTypes.func.isRequired,
    defaultFx: PropTypes.object.isRequired,
    saveFxToIndexedWord: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired,
    autoEditUponActivation: PropTypes.bool.isRequired,
    manipulationPanelIsOpen: PropTypes.bool.isRequired
  };

  componentDidMount() {
    const editing = this.props.wordList.findIndex(w => (w.editing === true));
    if (editing >= 0) {
      this.edit(editing);
    }
  }

  activate(index) {
    const { uuid, fx, ...word } = this.props.wordList[index]; // eslint-disable-line no-unused-vars
    console.log('** activate', word); // eslint-disable-line no-console
    this.props.activateWord(index);

    // Transmit activated word state.
    this.props.sendSocket('/spurter/STATE', word);

    // Transmit activated word's FX.
    transmitFx(this.props.sendSocket, { ...this.props.defaultFx, ...fx });

    if (this.props.autoEditUponActivation) {
      this.edit(index);
    }
  }

  edit(index) {
    const word = this.props.wordList[index];
//    console.log('** mergeState', word); // eslint-disable-line no-console
    this.props.mergeState({
      message: word.message,
      alignment: {
        halign: word.halign,
        valign: word.valign
      },
      styling: {
        bold: word.bold,
        italic: word.italic,
        fontFamily: word.fontFamily
      }
    });
    // Edit FX associated with word.
    this.props.mergeFx({ ...this.props.defaultFx, ...word.fx });
    this.props.editWord(index);
  }

  editFx(index) {
    const word = this.props.wordList[index];
    this.props.mergeFx({ ...this.props.defaultFx, ...word.fx });
  }

  clearFx(index) {
//    console.log(`clearFx @ ${index}`);
    this.props.saveFxToIndexedWord(index, null);
  }

  dup(index) {
    this.props.dupWord(index);
  }

  del(index) {
    this.props.delWord(index);
  }

  nudge(index, dir = 1) {
    this.props.nudgeWord(index, dir);
  }

  onActiveMounted(div) {
    if (div) {
      if (div.scrollIntoViewIfNeeded) {
        div.scrollIntoViewIfNeeded(true);
      } else {
        div.scrollIntoView(true);
      }
    }
  }

  renderWords(words) {
    return words.map((word, index, array) => (
      <WordEntry key={index} { ...word } index={index}
                 style={{ fontFamily: word.fontFamily,
                          fontWeight: word.bold ? 'bold' : 'normal',
                          fontStyle: word.italic ? 'italic' : 'normal',
                          fontSize: word.fontSize ? `${word.fontSize}%` : '100%'
                   }}
                 activate={::this.activate}
                 onActiveMounted={::this.onActiveMounted}
                 edit={::this.edit}
                 editFx={::this.editFx}
                 clearFx={::this.clearFx}
                 dup={::this.dup}
                 del={::this.del}
                 nudge={::this.nudge}
                 canDel={array.length !== 1}
                 fxState={word.fx}
      />
    ));
  }

  render() {
//    console.log('WordList props', this.props);
    const hideManipulations = !this.props.manipulationPanelIsOpen;
    const classes = hideManipulations ? 'word-list hide-manips' : 'word-list';
    const words = this.renderWords(this.props.wordList);
    return (
      <section className={classes}>
        {words}
      </section>
    );
  }
}
export default WordList;
