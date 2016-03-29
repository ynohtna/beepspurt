import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';

import WordEditor from './components/WordEditor';
import { columnParent, rowParent, flexContainer,
         flexChild, flexAll, flexNone } from './flexStyles';

const narrowStyle = {
  height: '2em'
};

@provide
class App extends React.Component {
  static propTypes = {
    socketStatus: PropTypes.string.isRequired
  };

  render() {
    return (
      <section style={{ ...flexChild, ...columnParent, ...flexContainer }}>
        <header style={{ ...flexChild, ...flexNone, ...narrowStyle }}>
          HEADER
        </header>
        <section style={{ ...flexChild, ...rowParent }}>
          <div style={{ ...flexChild, backgroundColor: '#112' }}>
            <WordEditor />
          </div>
          <section style={{ ...flexChild, ...columnParent }}>
            <div style={{ ...flexChild, ...flexNone, backgroundColor: '#112' }}>
              MASTER
            </div>
            <div style={{ ...flexChild, ...flexAll, backgroundColor: '#211' }}>
              <div style={{ display: 'table-cell', overflowY: 'scroll' }}>
                <p>WORD LIST</p>
                <p>asdfghjkl</p>
                <p>bacon</p>
              </div>
            </div>
            <section style={{ ...flexChild, ...rowParent, ...flexNone }}>
              <div style={{ ...flexChild }}>
                LFO OPACITY
              </div>
              <div style={{ ...flexChild, backgroundColor: '#211' }}>
                SEQUENCER
              </div>
            </section>
          </section>
        </section>
        <footer style={{ ...flexChild, ...flexNone, ...narrowStyle }}>
          FOOTER
        </footer>
      </section>
    );
  }
}
export default App;
