import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import WordEntry from './WordEntry';

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
    sendSocket: PropTypes.func.isRequired
  };

  activate(index) {
    const { uuid, ...word } = this.props.wordList[index];
    console.log('** activate', word); // eslint-disable-line no-console
    this.props.activateWord(index);
    this.props.sendSocket('/spurter/STATE', word);

    if (uuid) {
      // TODO: Retrieve FX associated with this word entry and activate them accordingly.
      console.log(`UUID: ${uuid}`); // eslint-disable-line no-console
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
                          fontStyle: word.italic ? 'italic' : 'normal',
                          fontSize: word.fontSize ? `${word.fontSize}%` : '100%'
                   }}
                 activate={::this.activate}
                 edit={::this.edit}
                 dup={::this.dup}
                 del={::this.del}
                 nudge={::this.nudge}
                 canDel={array.length !== 1}
                 fxDesc={ index % 2 ? 'zoom 0.9x, compass -15.0' : null }
                 fxState={{ zoomScale: 0.9, compass: -15.0 }}
      />
    ));
  }

  render() {
//    console.log('WordList props', this.props);
    const words = this.renderWords(this.props.wordList);
    return (
      <section className='word-list'>
        {words}
      </section>
    );
  }
}
export default WordList;
