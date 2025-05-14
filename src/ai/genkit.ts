import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai'; // Google AI plugin is no longer used

export const ai = genkit({
  plugins: [
    // If you were to add other Genkit plugins in the future
    // that don't rely on the Google AI API key, they would be configured here.
  ],
  // model: 'googleai/gemini-2.0-flash', // Default model was for the Google AI plugin
});
