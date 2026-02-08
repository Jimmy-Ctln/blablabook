import '@testing-library/jest-dom';

// Ajouté pour supprimer le warning JSDOM sur scrollTo dans les tests
window.scrollTo = () => {};

// Supprime les warnings act(...) et autres erreurs React dans la console des tests
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("not wrapped in act")
  ) {
    return;
  }
  originalError(...args);
};
