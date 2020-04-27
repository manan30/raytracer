const advancedCheckpoint = 'Advanced Checkpoint - OSL';

export const checkpoints = new Array(7)
  .fill('Checkpoint')
  .map((v, i) => `${v} ${i + 1}`)
  .concat(advancedCheckpoint);

export const ToneReproductionResults = [
  'Reinhard-1',
  'Reinhard-2',
  'Reinhard-3',
  'Ward-1',
  'Ward-2',
  'Ward-3',
];

export const AdvancedCheckpointResults = ['osl.gif', 'osl-texture.png'];
export const AdvancedCheckpointCaptions = [
  'Open Shader Language Tutorial',
  'Texture generated using Open Shader Language',
];
