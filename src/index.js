import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import ObjectAssign from 'es6-object-assign';
import { createElement } from 'react';
import { render } from 'react-dom';
import extractComponents from './component/extractor';
import loadComponents from './component/loader';

// Object assign polyfill
ObjectAssign.polyfill();

// Polyfill Promise
if (!window.Promise) {
  window.Promise = Promise;
}
// Polyfill Array.isArray
if (!Array.isArray) {
  Array.isArray = function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

function doRender(definitions) {
  for (let i = definitions.length - 1; i >= 0; i -= 1) {
    const def = definitions[i];
    def.props.innerHTML = def.element.innerHTML;
    render(
      createElement(def.component, def.props),
      def.element,
    );
  }
}

loadComponents().then(doRender);
extractComponents().then(doRender);
