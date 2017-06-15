import React from 'react';
import PropTypes from 'prop-types';
import Campaign from '../Campaign';
import { hasSubmittedComponent } from '../../component/tracker';

class EmailSignup extends React.Component {
  getActiveElements() {
    return (
      <div>
        <h3>{this.props.callToAction}</h3>
        <p>{this.props.description}</p>
        {this.props.previewUrl &&
          <p>
            <small>
              <a href={this.props.previewUrl} target="_blank" rel="noopener noreferrer">
                View email preview
              </a>
            </small>
          </p>
        }
      </div>
    );
  }

  getCompletedElements() {
    return (
      <div>
        <h3>{this.props.thankYouTitle}</h3>
        <div>
          {this.props.thankYouBody}
        </div>
      </div>
    );
  }

  render() {
    const suppress = hasSubmittedComponent(this.props.id);
    // eslint-disable-next-line max-len
    return <Campaign type="email-signup" campaignId={this.props.id} suppress={suppress} buttonLabel={this.props.buttonValue} forms={this.props.forms} whenActive={this.getActiveElements()} whenComplete={this.getCompletedElements()} />;
  }
}

EmailSignup.defaultProps = {
  callToAction: 'Stay up to date!',
  description: 'Subscribe to our newsletter to receive the latest industry news.',
  buttonValue: 'Sign up!',
  previewUrl: '',
  thankYouTitle: 'Thank You!',
  thankYouBody: 'Your submission has been received.',
  forms: [],
};

EmailSignup.propTypes = {
  id: PropTypes.string.isRequired,
  forms: PropTypes.arrayOf(PropTypes.object),
  callToAction: PropTypes.string,
  description: PropTypes.string,
  buttonValue: PropTypes.string,
  previewUrl: PropTypes.string,
  thankYouTitle: PropTypes.string,
  thankYouBody: PropTypes.string,
};

export default EmailSignup;
