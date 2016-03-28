const TextArea = props => {
  const onChange = (e) => {
    console.log(e.target.value);
    if (props.onChange) {
      props.onChange(e.target.value);
    }
  };
  return (
    <textarea autoComplete='off' cols={30} rows={4} {...props} onChange={onChange}>
    </textarea>
  );
};

const CheckBox = props => {
  return (
    <label>
      <input type="checkbox" {...props} children={null} />
      {props.children}
    </label>
  );
};

const Button = props => {
  return (
    <button {...props}>
      {props.children}
    </button>
  );
};

export {
  Button,
  CheckBox,
  TextArea
};
