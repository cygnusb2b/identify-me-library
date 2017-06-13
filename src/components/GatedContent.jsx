import React from 'react';
import PropTypes from 'prop-types';
import { hasSubmittedComponent, setSubmittedComponent, isIdentified } from '../component/tracker';
import { submitComponentAnalytics } from '../api';

const SUBMISSION_TYPE = 'campaign-gated-content';
const WRAPPER_CLASS = `id-me__${SUBMISSION_TYPE}`;

function flipCoin() {
  return Math.random() < 0.5;
}

class GatedContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComplete: false,
      isSubmitting: false,
      error: null,
      email: '',
      fullRegister: flipCoin(),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (!this.shouldHide()) {
      // Only send analytics if the component was actually rendered and not hidden.
      submitComponentAnalytics(
        SUBMISSION_TYPE,
        this.props.id,
        'render',
        { location: window.location, fullRegistration: this.displayRegistrationLink() },
      );
    }
  }

  shouldHide() {
    return hasSubmittedComponent(this.props.id) || isIdentified('token');
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
      {
        email: this.state.email,
        location: window.location,
        fullRegister: this.state.fullRegister,
      },
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

  displayRegistrationLink() {
    if (!this.props.registerUrl) {
      return false;
    }
    return this.state.fullRegister;
  }

  displayOriginalContents() {
    return { __html: this.props.innerHTML };
  }

  render() {
    if (this.state.isComplete || this.shouldHide()) {
      return (
        <div dangerouslySetInnerHTML={this.displayOriginalContents()} />
      );
    }

    if (this.displayRegistrationLink()) {
      return (
        <div className={WRAPPER_CLASS}>
          <h3>{this.props.title}</h3>
          <p><a href={this.props.registerUrl}>{this.props.fullRegisterDescription}</a></p>
        </div>
      );
    }
    return (
      <div className={WRAPPER_CLASS}>
        <h3>{this.props.title}</h3>
        <p>{this.props.description}</p>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input
              placeholder="Your email address"
              type="email"
              required="true"
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
            <span className="id-me__form-loading" />
          }
        </form>
      </div>
    );
  }
}

GatedContent.defaultProps = {
  title: 'This content is exclusive to subscribers.',
  description: 'To continue reading this content, please complete the following information.',
  fullRegisterDescription: 'To continue reading this content, please click here to register.',
  buttonValue: 'Continue',
  registerUrl: '',
  innerHTML: '',
};

GatedContent.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  fullRegisterDescription: PropTypes.string,
  innerHTML: PropTypes.string,
  buttonValue: PropTypes.string,
  registerUrl: PropTypes.string,
};

export default GatedContent;
