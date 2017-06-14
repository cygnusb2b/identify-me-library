import React from 'react';
import PropTypes from 'prop-types';

const FORM_PREFIX = 'id-me__form';
const GROUP_PREFIX = 'id-me__field-group';
const FIELD_PREFIX = 'id-me__field';

function buildInitialValues(props) {
  const values = {};
  const keys = props.fields.map(field => field.key);
  for (let i = keys.length - 1; i >= 0; i -= 1) {
    if (keys[i]) {
      values[keys[i]] = '';
    }
  }
  return values;
}

class CampaignForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: buildInitialValues(props),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getFormId() {
    return `${FORM_PREFIX}__${this.props.identifier}`;
  }

  handleChange(event) {
    const values = Object.assign({}, this.state.values);
    values[event.target.name] = event.target.value;
    this.setState({ values });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.values);
  }

  buildFieldGroup(field) {
    const component = this.buildField(field);
    if (!component) {
      return undefined;
    }
    const htmlFor = this.createFieldId(field.key);
    const className = `${GROUP_PREFIX} ${GROUP_PREFIX}__${field.key}`;
    return (
      <div key={field.key} className={className}>
        <label htmlFor={htmlFor}>{field.label}</label>
        {component}
      </div>
    );
  }

  buildField(field) {
    const type = field.fieldType;
    if (type === 'text' || type === 'email') {
      return this.buildInputField(type, field);
    }
    if (type === 'select') {
      return this.buildSelectField(field);
    }
    return undefined;
  }

  buildInputField(type, field) {
    const key = field.key;
    const id = this.createFieldId(key);
    // eslint-disable-next-line max-len
    return <input id={id} className={FIELD_PREFIX} type={type} name={key} value={this.state[key]} placeholder={field.label} required={field.required} onChange={this.handleChange} />;
  }

  buildSelectField(field) {
    const key = field.key;
    const id = this.createFieldId(key);
    const options = field.options.map((option) => {
      const value = option.value;
      return <option key={value} value={value}>{option.label}</option>;
    });
    return (
      // eslint-disable-next-line max-len
      <select id={id} className={FIELD_PREFIX} name={key} value={this.state[key]} required={field.required} onChange={this.handleChange}>
        {options}
      </select>
    );
  }

  createFieldId(key) {
    return `${this.getFormId()}__${key}`;
  }

  render() {
    const fields = this.props.fields.map(this.buildFieldGroup, this);
    const className = `${FORM_PREFIX} ${this.props.className}`;
    if (!fields.length) {
      return <div id={this.getFormId()} className="id-me__no-fields" />;
    }
    return (
      <form id={this.getFormId()} className={className} onSubmit={this.handleSubmit}>
        <fieldset disabled={this.props.lock}>
          {fields}
        </fieldset>
        <input type="submit" value={this.props.buttonLabel} disabled={this.props.lock} />
      </form>
    );
  }
}

CampaignForm.defaultProps = {
  className: '',
  buttonLabel: 'Submit',
  lock: false,
  fields: [],
};

CampaignForm.propTypes = {
  identifier: PropTypes.string.isRequired,
  lock: PropTypes.bool,
  buttonLabel: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape({
    fieldType: PropTypes.string,
    key: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),
  })),
};

export default CampaignForm;
