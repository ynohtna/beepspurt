const flexContainer = {
  width: '100%',
  height: '100%'
};

const rowParent = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'flex-start',
  alignContent: 'stretch',
  alignItems: 'stretch'
};

const columnParent = {
  ...rowParent,
  flexDirection: 'column'
};

const flexChild = {
  flex: '1 0 0', // flexGrow, flexShrink, flexBasis
  alignSelf: 'auto'
};

const flexAll = {
  flex: '1 1 0'
};
const flexAuto = {
  flex: '1 1 auto'
};
const flexNone = {
  flex: '0 0 auto'
};

export {
  flexContainer,
  rowParent,
  columnParent,
  flexChild,
  flexAll,
  flexAuto,
  flexNone
};
