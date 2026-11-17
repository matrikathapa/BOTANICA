const addBtn = document.querySelector('.plus');
const subBtn = document.querySelector('.minus');
const resetBtn = document.querySelector('.reset');
const plant = document.querySelector('.plant-illustration');
const counter = document.querySelector('.counterDisplay');
const stageDisplay = document.querySelector('.stageText');

let count = 0;

// Stage thresholds match the displayed ranges: 0–10, then each following 10 counts.
// Count itself stays unbounded; only the plant stage is capped at the final entry.
const growthStages = [
  { threshold: 0, name: 'Seed', shortName: 'SEED', title: 'Every beginning holds a little wonder.', description: 'A patient seed is taking root beneath the soil. Keep showing up, and see what unfolds.' },
  { threshold: 11, name: 'First Sprout', shortName: 'SPROUT', title: 'A small hello from the earth.', description: 'A first green shoot reaches toward the light, tender and full of promise.' },
  { threshold: 21, name: 'Tiny Leaves', shortName: 'TINY LEAVES', title: 'The first leaves find the light.', description: 'Two little leaves open as the seedling begins to gather strength.' },
  { threshold: 31, name: 'Growing Stem', shortName: 'GROWING STEM', title: 'Reaching a little higher.', description: 'A longer stem lifts the new leaves, making room for the next bit of growth.' },
  { threshold: 41, name: 'Developing Plant', shortName: 'DEVELOPING', title: 'Taking shape, one leaf at a time.', description: 'The plant is becoming sturdier, with fresh growth branching from its central stem.' },
  { threshold: 51, name: 'Fuller Foliage', shortName: 'FULLER FOLIAGE', title: 'A fuller, softer canopy.', description: 'More leaves fill out the silhouette, turning the little sprout into a leafy plant.' },
  { threshold: 61, name: 'Branching Growth', shortName: 'BRANCHING', title: 'New paths begin to branch.', description: 'Strong side branches reach outward, each carrying a little more life.' },
  { threshold: 71, name: 'Emerging Buds', shortName: 'EMERGING BUDS', title: 'Something lovely is gathering.', description: 'Small buds appear among the leaves. The first bloom is nearly ready.' },
  { threshold: 81, name: 'First Bloom', shortName: 'FIRST BLOOM', title: 'The first flower opens.', description: 'A warm terracotta bloom unfurls above the foliage, marking a beautiful new chapter.' },
  { threshold: 91, name: 'Fully Flourished', shortName: 'FULLY FLOURISHED', title: 'A hundred little steps. One beautiful bloom.', description: 'Your garden is in full flower. Every small return helped this plant find its way into the light.' }
];

function getPlantStageIndex(value) {
  let stageIndex = 0;
  for (let index = 1; index < growthStages.length; index++) {
    if (value < growthStages[index].threshold) break;
    stageIndex = index;
  }
  return stageIndex;
}

function updateGarden(animateStageChange = true) {
  const stageIndex = getPlantStageIndex(count);
  const stage = growthStages[stageIndex];
  const isComplete = count >= 100;
  const nextStage = growthStages[stageIndex + 1];
  const nextMilestone = stageIndex === growthStages.length - 1 ? 100 : nextStage.threshold;
  const stageStart = stage.threshold;
  const stageRange = nextMilestone - stageStart;
  const stageProgress = isComplete ? stageRange : Math.max(0, count - stageStart);
  const previousStageIndex = Number(plant.dataset.stageIndex ?? -1);
  const shouldAnimate = animateStageChange && stageIndex !== previousStageIndex && count < 100;

  counter.textContent = count;
  stageDisplay.textContent = stage.name;
  plant.className = `plant-illustration stage-${stageIndex}${shouldAnimate ? ' growth-pop' : ''}`;
  plant.dataset.stageIndex = stageIndex;
  document.querySelector('.journal-title').textContent = stage.title;
  document.querySelector('.journal-copy').textContent = stage.description;

  const progressTrack = document.querySelector('.progress-track');
  const progressFill = document.querySelector('.progressBar');
  progressTrack.classList.toggle('is-complete', isComplete);
  const progressPercent = isComplete ? 100 : (stageProgress / stageRange) * 100;
  progressFill.style.width = `${progressPercent}%`;
  progressTrack.setAttribute('aria-valuemax', stageRange);
  progressTrack.setAttribute('aria-valuenow', stageProgress);
  progressTrack.setAttribute('aria-label', isComplete ? 'Plant growth complete' : 'Progress to next growth stage');
  document.querySelector('.progress-label span:first-child').textContent = isComplete ? 'GROWTH COMPLETE' : 'NEXT MILESTONE';
  document.querySelector('.progress-current').textContent = isComplete ? '100 of 100 · COMPLETE' : `${stageProgress} of ${stageRange}`;
  document.querySelector('.milestone-count').textContent = isComplete ? 'Garden in bloom' : `${nextMilestone} counts`;
  document.querySelector('.details-title').textContent = 'A little garden, a lot of patience.';
  document.querySelector('.details-copy').textContent = isComplete
    ? 'Your garden is in full flower, and the counter is ready for more.'
    : stage.description;
  document.querySelector('.stage-number').textContent = `${String(stageIndex + 1).padStart(2, '0')} / 10`;
  document.querySelector('.stage-pips').setAttribute('aria-label', `Stage ${stageIndex + 1} of 10`);
  document.querySelectorAll('.stage-pips i').forEach((pip, index) => pip.classList.toggle('active', index <= stageIndex));
  document.querySelector('.meter-foot').innerHTML = `<span>${stage.shortName}</span><span>${isComplete ? 'GROWTH COMPLETE' : 'IN FULL BLOOM'}</span>`;
  addBtn.setAttribute('aria-label', `Add one count. Current count ${count}`);
  subBtn.setAttribute('aria-label', `Decrease count. Current count ${count}`);
}

addBtn.addEventListener('click', () => {
  count++;
  updateGarden();
});

subBtn.addEventListener('click', () => {
  if (count > 0) count--;
  updateGarden();
});

resetBtn.addEventListener('click', () => {
  if (count === 0) return;
  makeFallingLeaves();
  count = 0;
  updateGarden(false);
});

function makeFallingLeaves() {
  const bounds = plant.getBoundingClientRect();
  ['🍃', '✿', '❧', '🍃', '✧'].forEach((symbol, index) => {
    const leaf = document.createElement('span');
    leaf.className = 'reset-leaf';
    leaf.textContent = symbol;
    leaf.style.left = `${bounds.left + bounds.width * (.3 + index * .09)}px`;
    leaf.style.top = `${bounds.top + 90 + (index % 2) * 25}px`;
    leaf.style.setProperty('--drift', `${(index - 2) * 23}px`);
    document.body.appendChild(leaf);
    leaf.addEventListener('animationend', () => leaf.remove(), { once: true });
  });
}

updateGarden(false);
