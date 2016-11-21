import React from 'react';
import TextAreaContainer from './TextAreaContainer';
import FontListContainer from './FontListContainer';
import SendAutoSendClear from './SendAutoSendClear';
import StylingContainer from './StylingContainer';
import SaveButtonContainer from './SaveButtonContainer';
import HorizontalAlignmentContainer from './HorizontalAlignmentContainer';
import VerticalAlignmentContainer from './VerticalAlignmentContainer';
import WordFxContainer from './fx/WordFxContainer';

class WordEditor extends React.Component {
  render() {
    return (
      <div>
        <div className='word-editor flex-row'>
          <VerticalAlignmentContainer />

          <TextAreaContainer />

          <SendAutoSendClear />
        </div>

        <div className='word-manipulation flex-row'>
          <HorizontalAlignmentContainer />

          <StylingContainer />

          <SaveButtonContainer />
        </div>

        <FontListContainer/>

        <div className='word-fx-section flex-all'>
          <WordFxContainer />
        </div>
      </div>
    );
  }
}
export default WordEditor;
