import React, { PropTypes } from 'react';
import { Button, CheckBox, TextArea } from './Inputs';
import provide from 'react-redux-provide';
import { columnParent, rowParent, flexContainer, flexChild, flexNone } from '../flexStyles';

const textStyle = {
  fontFamily: 'Rockwell',
  fontSize: '120%',
  background: '#363',
  color: '#ffe',
  border: 0,
  borderRadius: 12,
  margin: 4,
  padding: 6,
  resize: 'vertical',
  outlineStyle: 'dotted',
  outlineWidth: 2,
  outlineOffset: 3,
  outlineColor: '#696'
};

@provide
class WordEditor extends React.Component {
  static propTypes = {
    sendSocket: PropTypes.func.isRequired,
    editor: PropTypes.object.isRequired,
    activateWord: PropTypes.func.isRequired,
    saveWord: PropTypes.func.isRequired,
    saveNewWord: PropTypes.func.isRequired
  };
  static defaultProps = {
  };
  state = {
    message: this.props.editor.message || '[beep]',
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

  // TODO: Save font and alignment with word.
  save() {
    this.props.saveWord(this.state.message);
  }
  saveNew() {
    this.props.saveNewWord(this.state.message);
  }

  render() {
//    console.log('**** WORD EDITOR', this.props, this.state);
    return (
      <div>
        <div className='word-editor'
             style={{ ...rowParent, ...flexContainer }}>
          <TextArea style={{ ...textStyle, ...flexChild }}
                    autoComplete='off' cols={30} rows={4}
                    value={this.state.message}
                    onChange={::this.updateMessage}
          />
          <div style={{ ...flexChild, ...columnParent, ...flexNone }}>
            <a className='clear-link'
               style={{ ...flexChild, ...flexNone }}
               onClick={() => this.updateMessage('')}
            >
              {'\u02e3'} clear
            </a>
            <CheckBox className='auto-send'
                      style={{ ...flexChild, ...flexNone }}
                      checked={this.state.autoUpdate}
                      onChange={() => this.setState({ autoUpdate: !this.state.autoUpdate })}
            >
              auto-send
            </CheckBox>
            <Button className='round-button'
                    style={{ ...flexChild, ...flexNone,
                             margin: '1rem 0 0 1rem' }}
                    onClick={() => this.dispatch(this.state.message)}>
              send
            </Button>
          </div>
        </div>

        <div className='word-manipulator'
             style={{ ...rowParent, ...flexContainer, justifyContent: 'flex-end' }}>
          <Button className='round-button'
                  style={{ ...flexChild, ...flexNone,
                           margin: '1rem 0 0 1rem' }}
                  onClick={::this.save}>
            save
          </Button>
          <Button className='round-button'
                  style={{ ...flexChild, ...flexNone,
                           margin: '1rem 0 0 1rem' }}
                  onClick={::this.saveNew}>
            save new
          </Button>
        </div>
      </div>
    );
  }
}
export default WordEditor;
