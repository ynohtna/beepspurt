import React, { PropTypes } from 'react';
import { Button, CheckBox, TextArea } from './Inputs';
import provide from 'react-redux-provide';

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
    spurterState: PropTypes.object.isRequired
    //    spurterState: PropTypes.object.isRequired
  };
  static defaultProps = {
  };
  state = {
    message: this.props.spurterState.message || '[beep]',
    autoUpdate: false
  };

  dispatch(message) {
    this.props.sendSocket('/spurter/MESSAGE', message);
  }

  updateMessage(message) {
    this.setState({ message });
    if (this.state.autoUpdate) {
      this.dispatch(message);
    }
  }

  render() {
    return (
      <div>
        <TextArea autoComplete='off' cols={30} rows={4}
                  value={this.state.message}
                  onChange={::this.updateMessage}
                  style={textStyle}
        />
        <CheckBox checked={this.state.autoUpdate}
                  onChange={() => this.setState({ autoUpdate: !this.state.autoUpdate })}
        >
          auto-dispatch
        </CheckBox>
        <Button onClick={() => this.dispatch(this.state.message)}>
          dispatch
        </Button>
      </div>
    );
  }
}
export default WordEditor;