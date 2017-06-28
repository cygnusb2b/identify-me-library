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

export function submitCampaignAnalytics(identifier, action, data) {
  return fetch('https://id-me.as3.io/component/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { identifier, action, data } }),
  }).then(checkResponseStatus).then(parseJsonResponse);
}

export function retrieveComponentManifest() {
  return fetch('https://id-me.as3.io/component/manifest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {
      location: window.location,
    } }),
  }).then(checkResponseStatus).then(parseJsonResponse);
}

export function submitComponentForm(data) {
  return fetch('https://id-me.as3.io/component/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })
  .then(checkResponseStatus);
}
