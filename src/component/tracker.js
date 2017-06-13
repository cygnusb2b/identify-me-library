import Cookies from 'cookies-js';

const COOKIE_NAME = 'id-me';
const EXPIRES = 60 * 60 * 24 * 30;

if (!Array.isArray) {
  Array.isArray = function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

function getCookieValue() {
  const cookie = Cookies.get(COOKIE_NAME);
  if (!cookie) {
    return { submitted: [] };
  }
  const parsed = JSON.parse(cookie);
  if (!Array.isArray(parsed.submitted)) {
    parsed.submitted = [];
  }
  return parsed;
}

function setCookieValue(object) {
  Cookies.set(COOKIE_NAME, JSON.stringify(object), { expires: EXPIRES });
}

export function isIdentified(cookieName) {
  if (Cookies.get(cookieName)) {
    return true;
  }
  return false;
}

export function setSubmittedComponent(id) {
  const value = getCookieValue();
  value.submitted.push(id);
  setCookieValue(value);
}

export function hasSubmittedComponent(id) {
  const value = getCookieValue();
  if (value.submitted.indexOf(id) !== -1) {
    return true;
  }
  return false;
}
