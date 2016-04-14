import React, { PropTypes } from 'react';
import provide from 'react-redux-provide';
import { Button, CheckBox, TextArea, TextButton } from './Inputs';
import FontList from './FontList';
import { columnParent, rowParent, flexContainer,
         flexAll, flexChild, flexNone } from '../flexStyles';

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
    editor: PropTypes.object.isRequired,
    activateWord: PropTypes.func.isRequired,
    saveWord: PropTypes.func.isRequired,
    saveNewWord: PropTypes.func.isRequired,
    setFont: PropTypes.func.isRequired,
    setBold: PropTypes.func.isRequired,
    setItalic: PropTypes.func.isRequired,
    fontList: PropTypes.array.isRequired
  };
  static defaultProps = {
  };
  state = {
    message: this.props.editor.message || '[beep]',
    showFonts: false,
    autoUpdate: false
  };

  // FIXME: Shouldn't need state at all, right?
  componentWillReceiveProps(nextProps) {
//    console.log('**** WORD EDITOR WILL RECEIVE PROPS', this.props, this.state);
    if (nextProps.editor.message !== this.state.message) {
      this.setState({
        message: nextProps.editor.message
      });
    }
  }

  componentDidUpdate(/* prevProps, prevState */) {
    if (this.state.autoUpdate) {
      console.warn('<<< SHOULD DISPATCH >>>');
    }
  }

  dispatch(message) {
    this.props.sendSocket('/spurter/MESSAGE', message);
    this.props.activateWord(-1);
  }

  updateMessage(message) {
    this.setState({ message });
    if (this.state.autoUpdate) {
      this.dispatch(message);
    }
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

  changeFont(fontName) {
    this.props.setFont(fontName);
  }

  render() {
//    console.log('**** WORD EDITOR', this.props, this.state);
    const fontName = this.props.editor.fontFamily;
    const fontInfo = this.props.fontList.find(font => font.family === fontName);
    const fontFamily = { fontFamily: fontName };
    const fontSize = { fontSize: fontInfo.size ? `${fontInfo.size}%` : null };
    const fontStyle = {
      fontWeight: this.props.editor.bold ? 'bold' : 'normal',
      fontStyle: this.props.editor.italic ? 'italic' : 'normal'
    };
    const boldClass = this.props.editor.bold ? 'bold on' : 'bold off';
    const italicClass = this.props.editor.italic ? 'italic on' : 'italic off';
    const autosendClassNames = `auto-send ${this.state.autoUpdate ? 'checked' : 'unchecked'}`;
    const showFontClass = this.state.showFonts ? 'show-fonts' : 'hide-fonts';
    return (
      <div>
        <div className='word-editor'
             style={{ ...rowParent, ...flexContainer }}>
          <div className='vertical-alignment'
               style={{ ...flexChild, ...columnParent, ...flexNone,
                        justifyContent: 'space-between' }}>
            <TextButton
               style={{ ...flexChild, ...flexNone }}>
              {'\u25b3'}
            </TextButton>
            <TextButton
               style={{ ...flexChild, ...flexNone }}>
              {'\u25c7'}
            </TextButton>
            <TextButton
               style={{ ...flexChild, ...flexNone }}>
              {'\u25bd'}
            </TextButton>
          </div>

          <TextArea className='word-area dbl-click'
                    style={{ ...flexChild,
                             ...fontStyle,
                             ...fontFamily }}
                    autoComplete='off' cols={30} rows={4}
                    value={this.state.message}
                    onChange={::this.updateMessage}
          />

          <div className='text-manipulation'
               style={{ ...flexChild, ...columnParent, ...flexNone }}>
            <Button className='round-button send'
                    style={{ ...flexChild, ...flexNone }}
                    onClick={() => this.dispatch(this.state.message)}>
              send
            </Button>
            <CheckBox className={autosendClassNames}
                      style={{ ...flexChild, ...flexNone }}
                      checked={this.state.autoUpdate}
                      onChange={() => this.setState({ autoUpdate: !this.state.autoUpdate })}
            >
              auto-send
            </CheckBox>
            <a className='clear-link'
               style={{ ...flexChild, ...flexNone }}
               onClick={() => this.updateMessage('')}
            >
              {'\u00d7\u00a0'} clear
            </a>
          </div>
        </div>

        <div className='word-manipulation'
             style={{ ...rowParent, ...flexContainer }}>
          <span className='horizontal-alignment'
                style={{ ...flexChild, ...flexNone }}>
            <TextButton>
              {'\u25c0'}
            </TextButton>
            <TextButton>
              {'\u25c6'}
            </TextButton>
            <TextButton>
              {'\u25b6'}
            </TextButton>
          </span>

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
               style={{ ...fontFamily,
                        ...fontSize,
                        maxHeight: '1.5rem' }}
               onClick={() => this.setState({ showFonts: !this.state.showFonts })}>
              {fontName}
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
                           justifyContent: 'space-around' }}
                  fonts={this.props.fontList}
                  selected={fontName}
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
