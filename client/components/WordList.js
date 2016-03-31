import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { columnParent, rowParent, flexContainer, flexChild, flexNone } from '../flexStyles';

const WordEntry = props => {
  return (
    <div className='word-entry'
         style={{ ...flexChild, ...flexNone, ...flexContainer, ...rowParent }}>
      <span className='edit action flex-none'>edit</span>
      <span className='word flex-auto'>{props.message}</span>
      <span className='dup action flex-none'>dup</span>
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
    wordList: PropTypes.array.isRequired
  };

  renderWords(words) {
    return words.map((entry, index) => (
      <WordEntry key={index} { ...entry } />
    ));
  }

  render() {
    const words = this.renderWords(this.props.wordList);
    return (
      <section className='word-list'
               style={{ ...flexContainer, ...columnParent,
                        overflowY: 'scroll' }}>
        {words}
      </section>
    );
  }
}
export default WordList;
