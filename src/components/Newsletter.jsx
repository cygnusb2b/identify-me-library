import React from 'react';
import PropTypes from 'prop-types';
import { checkResponseStatus } from '../response-utils';

const fetch = window.fetch;

class Newsletter extends React.Component {
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

  handleChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    fetch('/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: this.props.source,
        identifier: this.props.identifier,
        email: this.state.email,
      }),
    })
    .then(checkResponseStatus)
    .then(() => {
      this.setState({
        isSubmitting: false,
        isComplete: true,
      });
    })
    .catch((error) => {
      this.setState({
        isSubmitting: false,
        error: error.message,
      });
    });
  }

  render() {
    return (
      <div>
        <h3>{this.props.cta}</h3>
        <p>{this.props.desc}</p>
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <input
              placeholder="Your email address"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
              disabled={this.state.isSubmitting}
            />
          </fieldset>
          <input type="submit" value={this.props.buttonValue} disabled={this.state.isSubmitting} />
          {this.state.isSubmitting &&
            <span className="loading" />
          }
        </form>
      </div>
    );
  }
}

Newsletter.defaultProps = {
  cta: 'Stay up to date!',
  desc: 'Subscribe to our newsletter to receive the latest industry news.',
  buttonValue: 'Sign up!',
};

Newsletter.propTypes = {
  cta: PropTypes.string,
  desc: PropTypes.string,
  buttonValue: PropTypes.string,
  source: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
};

export default Newsletter;
