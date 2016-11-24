import React from 'react';
import provide from 'react-redux-provide';

import Header from './components/Header';
import Master from './components/Master';
import MiscManipulations from './components/MiscManipulations';
import Sequencer from './components/Sequencer';
import WordEditor from './components/WordEditor';
import WordList from './components/WordList';

// FIXME: Remove in favour of CSS styling.
import { columnParent, rowParent, flexContainer,
         flexChild, flexAll, flexNone } from './flexStyles';

const LeftPanel = () => (
  <div className='left-panel'
       style={{ ...flexChild }}>
    <WordEditor />
  </div>
);

const RightPanel = () => (
  <section className='right-panel'
           style={{ ...flexChild, ...columnParent }}>
    <div className='word-list-panel'
         style={{ ...flexChild, ...flexAll, overflowY: 'auto' }}>
      <WordList />
    </div>

    <section style={{ ...flexChild, ...rowParent, ...flexNone }}>
      <div style={{ ...flexChild, justifyContent: 'flex-start', alignSelf: 'center' }}>
        <MiscManipulations />
      </div>
      <div style={{ ...flexChild, justifyContent: 'flex-end' }}>
        <Sequencer />
      </div>
    </section>
  </section>
);

@provide
class App extends React.Component {
  render() {
    return (
      <section style={{ ...flexChild, ...columnParent, ...flexContainer }}>
        <header style={{ ...flexChild, ...flexNone }}>
          <Header />
          <Master />
        </header>

        <section style={{ ...flexChild, ...rowParent }}>
          <LeftPanel />
          <RightPanel />
        </section>

        <footer style={{ ...flexChild, ...flexNone }}>
        </footer>
      </section>
    );
  }
}
export default App;
