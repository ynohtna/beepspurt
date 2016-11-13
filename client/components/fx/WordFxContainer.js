import React, { PropTypes } from 'react';

/*
   FX:

   Arena OSC Send
   Photo Background
   Zoom Scale
   Alpha Scale
   Compass Spin
*/

const ArenaSend = () =>
  <h3>Arena OSC Send</h3>;

const ZoomScale = () =>
  <h3>Zoom Scale</h3>;

class WordFxContainer extends React.Component {
  static propTypes = {
    fxList: PropTypes.array
  };

  render() {
    return (
      <section className='fx'>
        <h2>Word FX</h2>
        <ArenaSend />
        <ZoomScale />
      </section>
    );
  }
}

export default WordFxContainer;
