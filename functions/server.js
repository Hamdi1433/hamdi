const serverless = require('serverless-http');
const app = require('../app');

// Wrapper pour l'application Express
const handler = serverless(app);

// Handler pour Netlify Functions
module.exports.handler = async (event, context) => {
  // Ajout des headers CORS
  const response = await handler(event, context);
  return {
    ...response,
    headers: {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  };
};