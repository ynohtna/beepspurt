import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

const WordEntry = props => {
  return (
    <li>
      {props.message}
    </li>
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
      <ol className='word-list'
          style={{ display: 'table-cell', overflowY: 'scroll' }}>
        {words}
      </ol>
    );
  }
}
export default WordList;
