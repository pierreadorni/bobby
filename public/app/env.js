/**
 *  Variables d'environnement
 */

(function (window) {
  window.__env = window.__env || {};

  // URL de la webapp
  window.__env.webappUrl = window.location.protocol + '//localhost:8000';

  // URL de l'API
  window.__env.apiUrl = window.location.protocol + '//localhost:8000/api/v1';

    // Debug
    window.__env.debug = false;
}(this));
