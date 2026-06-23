import {genkit} from 'genkit';

// Mock AI response for development/demo purposes
// This avoids API key issues while you set up authentication
export const ai = genkit({
  model: 'googleai/gemini-1.5-flash', // Will be overridden by mock below
});

// Mock function that returns realistic plant health responses
export async function mockAnalyzePlantHealth(input: any) {
  return {
    healthStatus: input.plantDescription.toLowerCase().includes('dying') || 
                  input.plantDescription.toLowerCase().includes('dead') ? 'sick' : 'healthy',
    disease: input.plantDescription.toLowerCase().includes('brown') ? 'Leaf Spot' : 
             input.plantDescription.toLowerCase().includes('yellow') ? 'Nutrient Deficiency' :
             input.plantDescription.toLowerCase().includes('wilt') ? 'Root Rot' : null,
    treatmentAdvice: 'Provide proper watering, sunlight, and nutrients. Consult a gardener if symptoms persist.',
    confidenceLevel: 0.75,
  };
}

export async function mockPlantCareTips(input: any) {
  const plantType = input.plantType || 'general';
  return {
    careTips: `For ${plantType} plants:\n• Water regularly but don't overwater\n• Provide adequate sunlight\n• Use well-draining soil\n• Fertilize monthly during growing season\n• Prune dead leaves regularly`
  };
}
