const FontList = props => {
  const {
    fonts,
    selected,
    onClick,
    ...strippedProps
  } = props;

  if (!fonts || !fonts.length) {
    // FIXME: Update React so stateless component can return null/false.
    return (<script></script>);
  }

  const fontItems = fonts.map((font, index) => (
    <li key={index}
        className={font.family === selected ? 'selected' : null}
        style={{ fontFamily: font.family,
                 fontSize: font.size ? `${font.size}%` : null }}
        onClick={() => onClick(font.family)}>
      {font.family}
    </li>
  ));

  return (
    <ol { ...strippedProps }>
      {fontItems}
    </ol>
  );
};
export default FontList;
