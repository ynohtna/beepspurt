import React from 'react';
import provide from 'react-redux-provide';

import Header from './components/Header';
import WordEditor from './components/WordEditor';
import WordList from './components/WordList';
import { columnParent, rowParent, flexContainer,
         flexChild, flexAll, flexNone } from './flexStyles';

const narrowStyle = {
  height: '1.6rem',
  fontSize: '110%'
};

@provide
class App extends React.Component {
  render() {
    return (
      <section style={{ ...flexChild, ...columnParent, ...flexContainer }}>
        <header style={{ ...flexChild, ...flexNone, ...narrowStyle }}>
          <Header />
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
              <WordList />
            </div>
            <section style={{ ...flexChild, ...rowParent, ...flexNone }}>
              <div style={{ ...flexChild }}>
                LFO {'>'} OPACITY
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
