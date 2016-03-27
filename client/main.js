import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  render() {
    return (
      <div>
      <h1>spurt...</h1>
      </div>
    );
  }
};

console.log('-- -- MAIN -- --');
render(<App />, document.getElementById('root'));
