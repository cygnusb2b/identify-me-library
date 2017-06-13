import Cookies from 'cookies-js';

const COOKIE_NAME = 'id-me';
const EXPIRES = 60 * 60 * 24 * 30;

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

export function isIdentified(cookieNames) {
  if (Array.isArray(cookieNames)) {
    for (let i = cookieNames.length - 1; i >= 0; i -= 1) {
      if (Cookies.get(cookieNames[i])) {
        return true;
      }
    }
    return false;
  }
  if (Cookies.get(cookieNames)) {
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
