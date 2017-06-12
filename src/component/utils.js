import publicComps from '../components/public';

export function componentExists(name) {
  return Object.prototype.hasOwnProperty.call(publicComps, name);
}

export function getComponentFor(name) {
  let Component = null;
  if (componentExists(name)) {
    Component = publicComps[name];
  }
  return Component;
}
