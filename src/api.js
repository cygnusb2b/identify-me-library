const fetch = window.fetch;

/**
 * Checks the response status of a Fetch request.
 *
 * @param {Response} response The fetch response.
 * @return {Reponse} On a successfuly response.
 * @throws {Error} On a non-200 response status.
 */
function checkResponseStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Parses a JSON Fetch response body.
 *
 * @param {Response} response The fetch response.
 * @return {Object} The parsed JSON response.
 */
function parseJsonResponse(response) {
  return response.json();
}

export function submitComponentAnalytics(type, identifier, action, data) {
  return fetch('/component/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { type, identifier, action, data } }),
  }).then(checkResponseStatus).then(parseJsonResponse);
}

export function retrieveComponentManifest() {
  return fetch('/component/manifest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {
      location: window.location,
    } }),
  }).then(checkResponseStatus).then(parseJsonResponse);
}

export function submitComponentForm(data) {
  return fetch('/component/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })
  .then(checkResponseStatus);
}
