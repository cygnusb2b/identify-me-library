import assign from './assign';

const formControl = {
  display: 'block',
  width: '100%',
  padding: '.5rem .75rem',
  fontSize: '0.9375rem',
  color: '#333',
  backgroundColor: '#fff',
  backgroundImage: 'none',
  backgroundClip: 'padding-box',
  border: '1px solid rgba(0, 0, 0, 0.15)',
  borderRadius: 0,
  margin: 0,
};

export default {
  formGroup: {
    marginBottom: '1rem',
  },
  fieldset: {
    minWidth: 0,
    padding: 0,
    margin: 0,
    border: 0,
  },
  label: {
    display: 'inline-block',
    marginBottom: '.5rem',
  },
  button: {
    display: 'inline-block',
    fontWeight: 300,
    lineHeight: 1.25,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    userSelect: 'none',
    border: '1px solid transparent',
    padding: '.5rem 1rem',
    marginBottom: '1rem',
    fontSize: '0.9375rem',
    borderRadius: 0,
  },
  formControl,
  formControlSelect: assign({
    height: 'inherit',
  }, formControl),
};
