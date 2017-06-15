import React from 'react';
import PropTypes from 'prop-types';
import { submitCampaignAnalytics } from '../api';
import { setSubmittedComponent } from '../component/tracker';

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
      isSubmitting: false,
      didError: false,
      errorMessage: '',
      values: buildInitialValues(props),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const data = {
      formId: this.props.formId,
      location: window.location,
    };
    this.submitAnalytics('render', data);
  }

  getFormId() {
    return `${FORM_PREFIX}__${this.props.formId}`;
  }

  getFieldDefintionBy(key) {
    const fields = this.props.fields;
    for (let i = fields.length - 1; i >= 0; i -= 1) {
      if (key === fields[i].key) {
        return fields[i];
      }
    }
    return undefined;
  }

  handleChange(event) {
    const values = Object.assign({}, this.state.values);
    values[event.target.name] = event.target.value;
    this.setState({ values });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    const data = {
      formId: this.props.formId,
      location: window.location,
      values: this.createValuePayload(),
    };
    this.submitAnalytics('submit', data)
      .then(() => {
        setSubmittedComponent(this.props.campaignId);
        this.setState({ isSubmitting: false });
        this.props.onComplete();
      })
      .catch(error => this.setState({
        didError: true, errorMessage: error.message, isSubmitting: false,
      }))
    ;
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
    return <input id={id} className={FIELD_PREFIX} type={type} name={key} value={this.state[key]} required={field.required} onChange={this.handleChange} />;
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

  createValuePayload() {
    const keys = Object.keys(this.state.values);
    const values = {
      hash: {},
      mapped: [],
    };
    for (let i = keys.length - 1; i >= 0; i -= 1) {
      const key = keys[i];
      const value = this.state.values[key];
      if (this.state.values[key]) {
        values.hash[key] = value;
        const field = this.getFieldDefintionBy(key);
        if (field) {
          const map = { key, value, label: field.label };
          if (field.fieldType === 'select') {
            for (let n = field.options.length - 1; n >= 0; n -= 1) {
              const option = field.options[n];
              if (option.value === value) {
                map.value = { key: value, value: option.label };
              }
            }
          }
          values.mapped.push(map);
        }
      }
    }
    return values;
  }

  submitAnalytics(action, data) {
    return submitCampaignAnalytics(this.props.campaignId, action, data);
  }

  render() {
    const fields = this.props.fields.map(this.buildFieldGroup, this);
    const className = `${FORM_PREFIX} ${this.props.className}`;
    if (!fields.length) {
      return <div id={this.getFormId()} className="id-me__no-fields" />;
    }
    return (
      <form id={this.getFormId()} className={className} onSubmit={this.handleSubmit}>
        <fieldset disabled={this.state.isSubmitting}>
          {fields}
        </fieldset>
        <input type="submit" value={this.props.buttonLabel} disabled={this.state.isSubmitting} />
        {this.state.isSubmitting &&
          <span className="id-me__form-loading" />
        }
      </form>
    );
  }
}

CampaignForm.defaultProps = {
  className: '',
  buttonLabel: 'Submit',
  fields: [],
  onComplete: () => {},
};

CampaignForm.propTypes = {
  formId: PropTypes.string.isRequired,
  campaignId: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string,
  onComplete: PropTypes.func,
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
