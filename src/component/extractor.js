import { getComponentFor } from './utils';

const CLASS_NAME = 'id-me';
const COMPONENT_NAME_ATTR = 'data-component';
const COMPONENT_PROP_ATTR_PREFIX = 'data-prop-';

const Promise = window.Promise;

function getComponentName(element) {
  let name = null;
  if (element.hasAttribute(COMPONENT_NAME_ATTR)) {
    name = element.getAttribute(COMPONENT_NAME_ATTR);
  }
  return name;
}

function extractComponentProps(element) {
  const props = {};
  if (element.hasAttributes()) {
    for (let i = element.attributes.length - 1; i >= 0; i -= 1) {
      const attr = element.attributes[i];
      if (attr.name.indexOf(COMPONENT_PROP_ATTR_PREFIX) === 0) {
        const propName = attr.name.replace(COMPONENT_PROP_ATTR_PREFIX, '');
        props[propName] = attr.value;
      }
    }
  }
  return props;
}

function extractComponents() {
  const components = [];
  const check = document.getElementsByClassName(CLASS_NAME);
  for (let i = check.length - 1; i >= 0; i -= 1) {
    const element = check[i];
    const name = getComponentName(element);
    const component = getComponentFor(name);
    if (component) {
      components.push({ element, component, props: extractComponentProps(element) });
    }
  }
  return Promise.resolve(components);
}

export default extractComponents;
