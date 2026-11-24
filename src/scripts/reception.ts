// Single switch for online reception of BOTH forms (quote and careers). Keep false until FIARIL confirms
// who receives requests/CVs and publishes a valid privacy notice (LFPDPPP). While false: no Netlify Forms
// registration, no network request, no upload (D-031, D-045). To enable: set true, deploy, enable form
// detection in Netlify (Forms › Enable form detection).
export const RECEPCION_ACTIVA = false;
