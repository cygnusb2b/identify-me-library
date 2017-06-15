import React from 'react';
import PropTypes from 'prop-types';
import Campaign from '../Campaign';
import { hasSubmittedComponent, isIdentified } from '../../component/tracker';


class GatedContent extends React.Component {

  getActiveElements() {
    const url = this.props.registerUrl;
    return (
      <div>
        <h3>{this.props.title}</h3>
        <p>{this.props.description}</p>
        {url &&
          <p>
            Alernatively, you can create a registered account by&nbsp;
            <a href={url}>clicking here</a>.
          </p>
        }
      </div>
    );
  }

  shouldSuppress() {
    if (this.props.cookies.length) {
      return hasSubmittedComponent(this.props.id) || isIdentified(this.props.cookies);
    }
    return hasSubmittedComponent(this.props.id);
  }

  displayOriginalContents() {
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: this.props.innerHTML }} />;
  }

  render() {
    const suppress = this.shouldSuppress();
    // eslint-disable-next-line max-len
    return <Campaign campaignId={this.props.id} suppress={suppress} buttonLabel={this.props.buttonValue} forms={this.props.forms} whenActive={this.getActiveElements()} whenComplete={this.displayOriginalContents()} whenSuppressed={this.displayOriginalContents()} />;
  }
}

GatedContent.defaultProps = {
  title: 'This content is exclusive to subscribers.',
  description: 'To continue reading this content, please complete the following information.',
  buttonValue: 'Continue',
  registerUrl: '',
  innerHTML: '',
  cookies: [],
  forms: [],
};

GatedContent.propTypes = {
  id: PropTypes.string.isRequired,
  forms: PropTypes.arrayOf(PropTypes.object),
  cookies: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  description: PropTypes.string,
  innerHTML: PropTypes.string,
  buttonValue: PropTypes.string,
  registerUrl: PropTypes.string,
};

export default GatedContent;
