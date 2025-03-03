export const getApiKeyConfigs = () => {
  return {
    apiKey: process.env.API_KEY || String(),
  };
};