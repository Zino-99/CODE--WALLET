// jest.setup.js
require('@testing-library/jest-dom');

window.Range.prototype.getClientRects = () => ({
  length: 0,
  item: () => null,
});