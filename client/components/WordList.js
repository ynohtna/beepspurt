import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { columnParent, rowParent, flexContainer, flexChild, flexNone } from '../flexStyles';

const WordEntry = props => {
  const { index } = props;
  const maybeDel = props.canDel ? (
    <span className='del action flex-none'
          onClick={() => props.onDel(index)}>
      del
    </span>
  ) : null;
  return (
    <div className='word-entry'
         style={{ ...flexNone, ...rowParent }}>
      <span className='edit action flex-none'>edit</span>
      <span className='word flex-auto'>{props.message}</span>

      {maybeDel}

      <span className='dup action flex-none'
            onClick={() => props.onDup(index)}>
        dup
      </span>

      <span className='swappers flex-none'>
        <span className='swapper up'>{'\u25b2'}</span>
        <span className='swapper down'>{'\u25bc'}</span>
      </span>
    </div>
  );
};

@provide
class WordList extends React.Component {
  static propTypes = {
    wordList: PropTypes.array.isRequired,
    delWord: PropTypes.func.isRequired,
    dupWord: PropTypes.func.isRequired
  };

  onDup(index) {
    this.props.dupWord(index);
  }

  onDel(index) {
    this.props.delWord(index);
  }

  renderWords(words) {
    return words.map((entry, index, array) => (
      <WordEntry key={index} { ...entry } index={index}
                 onDup={::this.onDup}
                 onDel={::this.onDel}
                 canDel={array.length !== 1}/>
    ));
  }

  render() {
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
