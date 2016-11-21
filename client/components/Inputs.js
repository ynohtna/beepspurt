import React, { PropTypes } from 'react';

const TextArea = props => {
  const onChange = e => props.onChange && props.onChange(e.target.value);
  return (
    <textarea {...props} onChange={onChange}>
    </textarea>
  );
};
TextArea.propTypes = {
  onChange: PropTypes.func.isRequired
};

const CheckBox = props => (
  <label className={props.className} style={{ ...props.style }}>
    <input type='checkbox' { ...props } className={null} style={null} children={null} />
    {props.children}
  </label>
);
CheckBox.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node
};

const Button = props => (
  <button type='button' { ...props } children={null}>
    {props.children}
  </button>
);
Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node
};

const TextButton = props => (
  <button type='button' { ...props } children={null}
          className={props.className ? `text-button ${props.className}` : 'text-button'}>
    {props.children}
  </button>
);
TextButton.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node
};

const SelectDropDown = ({ className, value, options, onChange }) => (
  <select className={className} value={value} onChange={onChange}>
    { options.map((opt, index) =>
      <option key={index} value={opt}>{opt}</option>) }
  </select>
);
SelectDropDown.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string
};

export {
  Button,
  TextButton,
  CheckBox,
  TextArea,
  SelectDropDown
};
