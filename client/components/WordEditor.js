import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button, CheckBox, TextArea, TextButton } from './Inputs';
import FontList from './FontList';
import { columnParent, rowParent, flexContainer,
         flexAll, flexChild, flexNone } from '../flexStyles';
import HorizontalAlignment from './HorizontalAlignment';
import VerticalAlignment from './VerticalAlignment';

function fixedFromCharCode(codePt) {
  let s;
  if (codePt > 0xFFFF) {
    const code = codePt - 0x10000;
    s = String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
  } else {
    s = String.fromCharCode(codePt);
  }
  return s;
}

@provide
class WordEditor extends React.Component {
  static propTypes = {
    sendSocket: PropTypes.func.isRequired,
    activateWord: PropTypes.func.isRequired,
    saveWord: PropTypes.func.isRequired,
    saveNewWord: PropTypes.func.isRequired,
    editor: PropTypes.object.isRequired,
    setAutoDispatch: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    setFont: PropTypes.func.isRequired,
    setBold: PropTypes.func.isRequired,
    setItalic: PropTypes.func.isRequired,
    fontList: PropTypes.array.isRequired
  };
  state = {
    showFonts: false
  };

  componentDidUpdate(/* prevProps, prevState */) {
    if (this.props.editor.autoDispatch) {
      this.dispatch();
    }
  }

  changeFont(fontName) {
    this.props.setFont(fontName);
  }

  clearMessage() {
    this.props.setMessage('');
  }

  dispatch() {
    // TODO: Trigger dispatch through middleware somehow, so component does not need to
    // understand transmission mechanism.
    this.props.activateWord(-1);
    const { message, fontFamily, bold, italic, halign, valign } = this.props.editor;
    this.props.sendSocket('/spurter/STATE', { message, fontFamily, bold, italic, halign, valign });
  }

  updateMessage(message) {
    this.props.setMessage(message);
  }

  toggleAutoDispatch() {
    const { autoDispatch } = this.props.editor;
    this.props.setAutoDispatch(!autoDispatch);
  }

  // TODO: Save font, styling and alignment with word.
  save() {
    const { message } = this.state;
    this.props.saveWord(message);
  }
  saveNew() {
    const { message } = this.state;
    this.props.saveNewWord(message);
  }

  render() {
//    console.log('**** WORD EDITOR', this.props, this.state);
    const {
      message,
      fontFamily,
      bold, italic,
      halign, valign
    } = this.props.editor;
    const fontInfo = this.props.fontList.find(font => font.family === fontFamily);
    const fontSize = fontInfo.size ? `${fontInfo.size}%` : '100%';
    const fontLarger = fontInfo.size ? `${fontInfo.size + 40}%` : '140%';
    const fontStyle = {
      fontFamily,
      fontSize,
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal'
    };
    const boldClass = this.props.editor.bold ? 'bold on' : 'bold off';
    const italicClass = this.props.editor.italic ? 'italic on' : 'italic off';
    const autoDispatch = this.props.editor.autoDispatch;
    const autodispatchClassNames = `auto-send ${autoDispatch ? 'checked' : 'unchecked'}`;
    const showFontClass = this.state.showFonts ? 'show-fonts' : 'hide-fonts';
    return (
      <div>
        <div className='word-editor'
             style={{ ...rowParent, ...flexContainer }}>
          <VerticalAlignment className='vertical-alignment'
                             alignment={valign} />

          <TextArea className='word-area dbl-click'
                    style={{ ...flexChild,
                             ...fontStyle,
                             fontSize: fontLarger }}
                    autoComplete='off' cols={30} rows={4}
                    value={message}
                    onChange={::this.updateMessage}
          />

          <div className='text-manipulation'
               style={{ ...flexChild, ...columnParent, ...flexNone }}>
            <Button className='round-button send'
                    style={{ ...flexChild, ...flexNone }}
                    onClick={::this.dispatch}>
              send
            </Button>
            <CheckBox className={autodispatchClassNames}
                      style={{ ...flexChild, ...flexNone }}
                      checked={autoDispatch}
                      onChange={::this.toggleAutoDispatch}
            >
              auto-send
            </CheckBox>
            <a className='clear-link'
               style={{ ...flexChild, ...flexNone }}
               onClick={::this.clearMessage}
            >
              {'\u00d7\u00a0 clear'}
            </a>
          </div>
        </div>

        <div className='word-manipulation'
             style={{ ...rowParent, ...flexContainer }}>
          <HorizontalAlignment className='horizontal-alignment'
                               alignment={halign} />

          <span className='styling'
                style={{ ...flexChild, ...flexAll }}>
            <a className={boldClass}
               onClick={() => this.props.setBold(!this.props.editor.bold)}>
              {fixedFromCharCode(0x1d401)}
            </a>
            <a className={italicClass}
               onClick={() => this.props.setItalic(!this.props.editor.italic)}>
              {fixedFromCharCode(0x1d456)}
            </a>
            <a className={showFontClass}
               style={{ fontSize,
                        fontFamily,
                        maxHeight: '1.5rem' }}
               onClick={() => this.setState({ showFonts: !this.state.showFonts })}>
              {fontFamily}
            </a>
          </span>

          <Button className='round-button save'
                  style={{ ...flexChild, ...flexNone,
                           margin: '0.7rem 0 0 1rem' }}
                  onClick={::this.save}>
            save
          </Button>
          <Button className='round-button save-new'
                  style={{ ...flexChild, ...flexNone,
                           margin: '0.7rem 0 0 1rem' }}
                  onClick={::this.saveNew}>
            save new
          </Button>
        </div>

        <FontList className={`font-list ${showFontClass}`}
                  style={{ ...rowParent, ...flexContainer,
                           flexWrap: 'wrap',
                           justifyContent: 'space-between' }}
                  fonts={this.props.fontList}
                  selected={fontFamily}
                  onClick={::this.changeFont}/>

        <div className='word-fx'
             style={{ ...flexContainer, ...flexAll }}>
          <h2>Word FX</h2>
        </div>
      </div>
    );
  }
}
export default WordEditor;
