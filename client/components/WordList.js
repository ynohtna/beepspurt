import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { columnParent, rowParent, flexContainer, flexChild, flexNone } from '../flexStyles';

const WordEntry = props => {
  const { index } = props;
  const maybeDel = props.canDel ? (
    <span className='del action flex-none'
          onClick={() => props.del(index)}>
      del
    </span>
  ) : null;
  const activeClass = props.activated ? ' activated' : '';
  const editClass = props.editting ? ' editting' : '';
  const editSigil = props.editting ? (<span className='sigil'>{'\u25c0'}</span>) : null;
  return (
    <div className={`word-entry${activeClass}`}
         style={{ ...flexNone, ...rowParent }}>
    {editSigil}
      <span className={`edit action flex-none${editClass}`}
            onClick={() => props.edit(index)}
      >
        edit
      </span>

      <span className='word-activator flex-auto'
            onClick={() => props.activate(index)}>
        <span className='word flex-auto' style={{ ...props.style, display: 'flex' }}>
          {props.message}
        </span>
      </span>

      {maybeDel}

      <span className='dup action flex-none'
            onClick={() => props.dup(index)}>
        dup
      </span>

      <span className='swappers flex-none'>
        <span className='swapper up'
              onClick={() => props.nudge(index, -1)}
        >
          {'\u25b2'}
        </span>
        <span className='swapper down'
              onClick={() => props.nudge(index, 1)}
        >
          {'\u25bc'}
        </span>
      </span>
    </div>
  );
};

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
    this.props.sendSocket('/spurter/MESSAGE', word.message);
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
    return words.map((entry, index, array) => (
      <WordEntry key={index} { ...entry } index={index}
                 style={{ fontFamily: entry.fontFamily }}
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
