import React, { PropTypes } from 'react';

const halignStyles = [{
  justifyContent: 'flex-start',
  textAlign: 'left'
}, {
  justifyContent: 'center',
  textAlign: 'center'
}, {
  justifyContent: 'flex-end',
  textAlign: 'right'
}];

const halignClasses = ['h-left', 'h-center', 'h-right'];
const valignClasses = ['v-top', 'v-middle', 'v-bottom'];

const safeLookup = (a, i) => {
  try {
    return a[i | 0];
  } catch (e) {
    return a[0];
  }
};

const WordEntry = props => {
  const {
    index,
    activated,
    editing,
    canDel,
    halign,
    valign
  } = props;
  const maybeDel = canDel ? (
    <span className='del action flex-none'
          onClick={() => props.del(index)}>
      del
    </span>
  ) : null;
  const activeClass = activated ? 'activated' : '';
  const editClass = editing ? ' editing' : '';
  const editSigil = editing ? (<span className='sigil flex-none'>{'\u25c0'}</span>) : null;
  const halignStyle = safeLookup(halignStyles, halign);
  const halignClass = safeLookup(halignClasses, halign);
  const valignClass = safeLookup(valignClasses, valign);
  return (
    <div className={`word-entry ${activeClass} flex-row flex-none`}>
      {editSigil}
      <span className={`edit action flex-none${editClass}`}
            onClick={() => props.edit(index)}
      >
        edit
      </span>

      <span className='word-activator flex-auto'
            onClick={() => props.activate(index)}>
        <span className={`word-align-sigil ${halignClass} ${valignClass}`}/>
        <span className='word flex-auto'
              style={{ ...props.style,
                       ...halignStyle }}>
          {props.message}
        </span>
      </span>

      {maybeDel}

      <span className='dup action flex-none'
            onClick={() => props.dup(index)}>
        dup
      </span>

      <span className='swappers flex-none'>
        <span className='swapper up'
              onClick={() => props.nudge(index, -1)}
        >
          {'\u25b2'}
        </span>
        <span className='swapper down'
              onClick={() => props.nudge(index, 1)}
        >
          {'\u25bc'}
        </span>
      </span>
    </div>
  );
};
WordEntry.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object,
  activated: PropTypes.bool,
  editing: PropTypes.bool,
  canDel: PropTypes.bool,
  halign: PropTypes.number,
  valign: PropTypes.number,
  message: PropTypes.string,
  activate: PropTypes.func.isRequired,
  del: PropTypes.func.isRequired,
  dup: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  nudge: PropTypes.func.isRequired
};
export default WordEntry;
