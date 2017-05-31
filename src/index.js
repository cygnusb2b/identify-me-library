import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import { createElement } from 'react';
import { render } from 'react-dom';
import extractComponents from './extract-components';

if (!window.Promise) {
  window.Promise = Promise;
}

extractComponents().forEach((def) => {
  render(
    createElement(def.component, def.props),
    def.element,
  );
});
