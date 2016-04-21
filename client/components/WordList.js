import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import WordEntry from './WordEntry';

// TODO: Refactor into CSS styles applied to .word-list
import { columnParent, flexContainer } from '../flexStyles';

@provide
class WordList extends React.Component {
  static propTypes = {
    wordList: PropTypes.array.isRequired,
    delWord: PropTypes.func.isRequired,
    dupWord: PropTypes.func.isRequired,
    nudgeWord: PropTypes.func.isRequired,
    editWord: PropTypes.func.isRequired,
    activateWord: PropTypes.func.isRequired,
    mergeEditorState: PropTypes.func.isRequired,
    sendSocket: PropTypes.func.isRequired
  };

  activate(index) {
    const word = this.props.wordList[index];
    this.props.activateWord(index);
    const { message, fontFamily, bold, italic, halign, valign } = word;
    this.props.sendSocket('/spurter/MERGE', { message, fontFamily, bold, italic, halign, valign });
  }

  edit(index) {
    const word = this.props.wordList[index];
    this.props.mergeEditorState(word);
    this.props.editWord(index);
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

  renderWords(words) {
    return words.map((word, index, array) => (
      <WordEntry key={index} { ...word } index={index}
                 style={{ fontFamily: word.fontFamily,
                          fontWeight: word.bold ? 'bold' : 'normal',
                          fontStyle: word.italic ? 'italic' : 'normal'
                     // TODO: lookup fontFamily in fontList and set fontSize accordingly.
                   }}
                 activate={::this.activate}
                 edit={::this.edit}
                 dup={::this.dup}
                 del={::this.del}
                 nudge={::this.nudge}
                 canDel={array.length !== 1}/>
    ));
  }

  render() {
//    console.log('WordList props', this.props);
    const words = this.renderWords(this.props.wordList);
    return (
      <section className='word-list'
               style={{ ...flexContainer, ...columnParent }}>
        {words}
      </section>
    );
  }
}
export default WordList;
