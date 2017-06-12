import React from 'react';
import PropTypes from 'prop-types';
import { hasSubmittedComponent, setSubmittedComponent } from '../component/tracker';
import { submitComponentAnalytics } from '../api';

const SUBMISSION_TYPE = 'email-signup-campaign';

class EmailSignupCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComplete: false,
      isSubmitting: false,
      error: null,
      email: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (!hasSubmittedComponent(this.props.id)) {
      // Only send analytics if the component was actually rendered and not hidden.
      submitComponentAnalytics(
        SUBMISSION_TYPE,
        this.props.id,
        'render',
        { location: window.location },
      );
    }
  }

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    submitComponentAnalytics(
      SUBMISSION_TYPE,
      this.props.id,
      'submit',
      { email: this.state.email, location: window.location },
    )
      .then(() => {
        this.setState({
          isSubmitting: false,
          isComplete: true,
        });
        // Mark that this component has been submitted.
        setSubmittedComponent(this.props.id);
      })
      .catch((error) => {
        this.setState({
          isSubmitting: false,
          error: error.message,
        });
      })
    ;
  }

  render() {
    if (hasSubmittedComponent(this.props.id)) {
      return (
        <div />
      );
    }
    return (
      <div className="id-me_email-signup-campaign">
        {this.state.isComplete ? (
          <div>
            <h3 className="id-me_thank-you-title">{this.props.thankYouTitle}</h3>
            <div className="id-me_thank-you-body">
              {this.props.thankYouBody}
            </div>
          </div>
        ) : (
          <div>
            <h3 className="id-me_call-to-action">{this.props.callToAction}</h3>
            <p className="id-me_description">{this.props.description}</p>
            {this.props.previewUrl &&
              <small className="id-me_preview-url">
                <a href={this.props.previewUrl} target="_blank" rel="noopener noreferrer">
                  View preview
                </a>
              </small>
            }
            <form onSubmit={this.handleSubmit}>
              <div>
                <input
                  className="id-me_email"
                  placeholder="Your email address"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  disabled={this.state.isSubmitting}
                />
              </div>
              <input
                type="submit"
                value={this.props.buttonValue}
                disabled={this.state.isSubmitting}
              />
              {this.state.isSubmitting &&
                <span className="id-me_form-loading" />
              }
            </form>
          </div>
        )}
      </div>
    );
  }
}

EmailSignupCampaign.defaultProps = {
  callToAction: 'Stay up to date!',
  description: 'Subscribe to our newsletter to receive the latest industry news.',
  buttonValue: 'Sign up!',
  previewUrl: '',
  thankYouTitle: 'Thank You!',
  thankYouBody: 'Your submission has been received.',
};

EmailSignupCampaign.propTypes = {
  id: PropTypes.string.isRequired,
  callToAction: PropTypes.string,
  description: PropTypes.string,
  buttonValue: PropTypes.string,
  previewUrl: PropTypes.string,
  thankYouTitle: PropTypes.string,
  thankYouBody: PropTypes.string,
};

export default EmailSignupCampaign;
