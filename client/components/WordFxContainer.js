import React, { PropTypes } from 'react';

class WordFxContainer extends React.Component {
  static propTypes = {
    fxList: PropTypes.array
  };

  render() {
    return (
      <h2>Word FX</h2>
    );
  }
}

export default WordFxContainer;
