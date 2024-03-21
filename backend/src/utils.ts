export function sendRequest(url, method = "GET", body = "", headers = {}) {
  const content = {
    method: method,
    headers: headers,
  };
  if (body) {
    content["body"] = body;
  }
  return fetch(url, content);
}
