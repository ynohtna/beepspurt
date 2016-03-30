import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

@provide
class WordList extends React.Component {
  render() {
    return (
      <ol style={{ display: 'table-cell', overflowY: 'scroll' }}>
        <li>WORD</li>
        <li>asdfghjkl</li>
        <li>bacon</li>
        <li>cheese</li>
      </ol>
    );
  }
}
export default WordList;
