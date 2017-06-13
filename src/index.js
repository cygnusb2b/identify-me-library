import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import { createElement } from 'react';
import { render } from 'react-dom';
import extractComponents from './component/extractor';
import loadComponents from './component/loader';

if (!window.Promise) {
  window.Promise = Promise;
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
