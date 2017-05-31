/**
 * Checks the response status of a Fetch request.
 *
 * @param {Response} response The fetch response.
 * @return {Reponse} On a successfuly response.
 * @throws {Error} On a non-200 response status.
 */
export function checkResponseStatus(response) {
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
export function parseJsonResponse(response) {
  return response.json();
}
