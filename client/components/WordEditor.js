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
      <div style={{ ...rowParent, ...flexContainer }}>
        <TextArea style={{ ...textStyle, ...flexChild }}
                  autoComplete='off' cols={30} rows={4}
                  value={this.state.message}
                  onChange={::this.updateMessage}
        />
        <div style={{ ...flexChild, ...columnParent, ...flexNone }}>
          <CheckBox style={{ ...flexChild, ...flexNone, margin: '1rem' }}
                    checked={this.state.autoUpdate}
                    onChange={() => this.setState({ autoUpdate: !this.state.autoUpdate })}
          >
            auto-send
          </CheckBox>
          <Button style={{ ...flexChild, ...flexNone,
                           margin: '1rem', height: '2rem',
                           fontSize: '100%', borderRadius: '12px' }}
                  onClick={() => this.dispatch(this.state.message)}>
            send
          </Button>
        </div>
      </div>
    );
  }
}
export default WordEditor;
