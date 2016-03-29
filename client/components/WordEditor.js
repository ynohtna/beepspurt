import React from 'react';
import { Button, CheckBox, TextArea } from './Inputs';

const textStyle = {
  fontSize: 'medium',
  background: '#363',
  color: '#ffe',
  border: 0,
  borderRadius: 16,
  margin: 4,
  padding: 6,
  outlineStyle: 'dotted',
  outlineWidth: 2,
  outlineOffset: 3,
  outlineColor: '#696'
};

class WordEditor extends React.Component {
  static propTypes = {
  };
  static defaultProps = {
  };
  state = {
    message: '[beep]',
    autoUpdate: false
  };
  render() {
    return (
      <div>
        <TextArea autoComplete='off' cols={30} rows={4}
                  value={this.state.message}
                  onChange={message => this.setState({ message })}
                  style={textStyle}
        />
        <CheckBox checked={this.state.autoUpdate}
                  onChange={() => this.setState({ autoUpdate: !this.state.autoUpdate })}
        >
          auto-dispatch
        </CheckBox>
        <Button>
          dispatch
        </Button>
      </div>
    );
  }
}
export default WordEditor;
