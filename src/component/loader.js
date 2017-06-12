import { retrieveComponentManifest } from '../api';
import { getComponentFor } from './utils';


function createDefinitions(response) {
  const components = response.data || [];
  const definitions = [];

  for (let i = components.length - 1; i >= 0; i -= 1) {
    const component = getComponentFor(components[i].name);
    if (component) {
      const selectors = components[i].selectors;
      for (let n = selectors.length - 1; n >= 0; n -= 1) {
        const elements = document.querySelectorAll(selectors[n]);
        for (let x = elements.length - 1; x >= 0; x -= 1) {
          definitions.push({ element: elements[x], component, props: components[i].props });
        }
      }
    }
  }
  return definitions;
}

function load() {
  return retrieveComponentManifest().then(createDefinitions);
}

export default load;
