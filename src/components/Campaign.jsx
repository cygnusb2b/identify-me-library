import React from 'react';
import PropTypes from 'prop-types';
import CampaignForm from './CampaignForm';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
}

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComplete: false,
    };
    this.finish = this.finish.bind(this);
  }

  getFormComponent(form) {
    if (!form) {
      return undefined;
    }
    // eslint-disable-next-line max-len
    return <CampaignForm campaignId={this.props.campaignId} formId={form.identifier} fields={form.fields} onComplete={this.finish} buttonLabel={this.props.buttonLabel} setCookies={this.props.setCookies} />;
  }

  finish() {
    this.setState({ isComplete: true });
  }

  render() {
    const className = `id-me__campaign id-me__campaign--${this.props.type}`;
    if (this.state.isComplete) {
      return (
        <div className={className}>
          {this.props.whenComplete}
        </div>
      );
    }

    if (this.props.suppress) {
      return (
        <div className={className}>
          {this.props.whenSuppressed}
        </div>
      );
    }

    // Randomly select the form.
    const forms = this.props.forms;
    const index = getRandomInt(0, forms.length);
    const form = forms[index];
    return (
      <div className={className}>
        {this.props.whenActive}
        {this.getFormComponent(form)}
      </div>
    );
  }
}

Campaign.defaultProps = {
  suppress: false,
  whenComplete: <span />,
  whenActive: <span />,
  whenSuppressed: <span />,
  buttonLabel: 'Submit',
  setCookies: [],
};


Campaign.propTypes = {
  type: PropTypes.string.isRequired,
  campaignId: PropTypes.string.isRequired,
  forms: PropTypes.arrayOf(PropTypes.object).isRequired,
  whenComplete: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  whenActive: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  whenSuppressed: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  suppress: PropTypes.bool,
  buttonLabel: PropTypes.string,
  setCookies: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    expires: PropTypes.number,
  })),
};

export default Campaign;
