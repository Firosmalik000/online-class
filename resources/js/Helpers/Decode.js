const decodeHtml = (html) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = html;
  return textarea.value;
}

export {decodeHtml};
// Usage example:
// import { decodeHtml } from './Decode';
