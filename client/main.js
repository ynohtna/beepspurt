import React from 'react';
import { render } from 'react-dom';

const flexContainer = {
  width: '100%',
  height: '100%'
};

const rowParent = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  alignContent: 'stretch',
  alignItems: 'stretch'
};

const columnParent = {
  ...rowParent,
  flexDirection: 'column'
};

const flexChild = {
  flex: '1 0 0',
  alignSelf: 'auto'
};

const narrow = {
  flex: '0 0 auto',
  height: '2em'
};

class App extends React.Component {
  render() {
    return (
      <section style={{ ...flexChild, ...columnParent, ...flexContainer }}>
        <header style={{ ...flexChild, ...narrow }}>
          HEADER
        </header>
        <section style={{ ...flexChild, ...rowParent }}>
          <div style={{ ...flexChild, backgroundColor: '#112' }}>
            WORD EDITOR
          </div>
          <section style={{ ...flexChild, ...columnParent }}>
            <div style={{ ...flexChild, flex: '0 0 auto', backgroundColor: '#112' }}>
              MASTER
            </div>
            <div style={{ ...flexChild, flex: '1 1 33%', backgroundColor: '#211' }}>
              <div style={{ display: 'table-cell', overflowY: 'scroll' }}>
                <p>WORD LIST</p>
                <p>asdfghjkl</p>
                <p>bacon</p>
              </div>
            </div>
            <section style={{ ...flexChild, ...rowParent, flex: '1 1 33%' }}>
              <div style={{ ...flexChild }}>
                LFO OPACITY
              </div>
              <div style={{ ...flexChild, backgroundColor: '#211' }}>
                SEQUENCER
              </div>
            </section>
          </section>
        </section>
        <footer style={{ ...flexChild, ...narrow }}>
          FOOTER
        </footer>
      </section>
    );
  }
};

console.log('-- -- MAIN -- --');
render(<App />, document.getElementById('app'));
console.log('-- -- MAIN -- --');
