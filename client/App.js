import React from 'react';
import { columnParent, rowParent, flexContainer,
         flexChild, flexAll, flexNone } from './flexStyles';
import WordEditor from './components/WordEditor';

class App extends React.Component {
  render() {
    const narrow = {
      height: '2em'
    };

    return (
      <section style={{ ...flexChild, ...columnParent, ...flexContainer }}>
        <header style={{ ...flexChild, ...flexNone, ...narrow }}>
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
            <section style={{ ...flexChild, ...rowParent, ...flexAll }}>
              <div style={{ ...flexChild }}>
                LFO OPACITY
              </div>
              <div style={{ ...flexChild, backgroundColor: '#211' }}>
                SEQUENCER
              </div>
            </section>
          </section>
        </section>
        <footer style={{ ...flexChild, ...flexNone, ...narrow }}>
          FOOTER
        </footer>
      </section>
    );
  }
}
export default App;
