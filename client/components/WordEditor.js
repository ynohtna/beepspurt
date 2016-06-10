import React from 'react';
import { rowParent, flexAll } from '../flexStyles';

import TextAreaContainer from './TextAreaContainer';
import FontListContainer from './FontListContainer';
import SendAutoSendClear from './SendAutoSendClear';
import StylingContainer from './StylingContainer';
import SaveButtonContainer from './SaveButtonContainer';
import HorizontalAlignmentContainer from './HorizontalAlignmentContainer';
import VerticalAlignmentContainer from './VerticalAlignmentContainer';

class WordEditor extends React.Component {
  render() {
    return (
      <div>
        <div className='word-editor'
             style={{ ...rowParent }}>
          <VerticalAlignmentContainer />

          <TextAreaContainer />

          <SendAutoSendClear />
        </div>

        <div className='word-manipulation'
             style={{ ...rowParent }}>
          <HorizontalAlignmentContainer />

          <StylingContainer />

          <SaveButtonContainer />
        </div>

        <FontListContainer/>

        <div className='word-fx'
             style={{ ...flexAll }}>
          <h2>Word FX</h2>
        </div>
      </div>
    );
  }
}
export default WordEditor;
