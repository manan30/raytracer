const advancedCheckpointOSL = 'Advanced Checkpoint - OSL';
const advancedCheckpointKDTree = 'Advanced Checkpoint - KD-Tree';

export const checkpoints = new Array(7)
  .fill('Checkpoint')
  .map((v, i) => `${v} ${i + 1}`)
  .concat(advancedCheckpointOSL)
  .concat(advancedCheckpointKDTree);

export const ToneReproductionResults = [
  'Reinhard-1',
  'Reinhard-2',
  'Reinhard-3',
  'Ward-1',
  'Ward-2',
  'Ward-3',
];

export const AdvancedCheckpointOSLResults = ['osl.gif', 'osl-texture.png'];
export const AdvancedCheckpointOSLCaptions = [
  'Open Shader Language Tutorial',
  'Texture generated using Open Shader Language',
];
