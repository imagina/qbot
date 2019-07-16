const baseApiUrl = env('BASE_URL', 'http://localhost:8000') + '/api';
const moduleName = 'idialogflow';
const urlBase = `${baseApiUrl}/${moduleName}`;

export default {
  bots: `${urlBase}/bots`,
  intens: `${urlBase}/intents`,
}
