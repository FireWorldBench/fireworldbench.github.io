'use strict';

const sceneData = {
  transport: { family: 'Transportation and Infrastructure', title: 'Electric bus terminal charging-bay fire', description: 'Follow the buoyant plume, bay-scale confinement, and longitudinal smoke transport through a charging-bay fire.', figure: 16 },
  office: { family: 'Office and Digital Facilities', title: 'Data-centre cold-aisle cable-tray fire', description: 'Overhead structures and aisle geometry constrain the thermal plume, redistribute soot, and progressively degrade visibility.', figure: 17 },
  healthcare: { family: 'Healthcare and Education', title: 'Teaching medical laboratory solvent-bench fire', description: 'Trace the evolution of heat, smoke, airflow, and visibility around a solvent-bench fire in a teaching laboratory.', figure: 18 },
  commercial: { family: 'Commercial and Public Spaces', title: 'Public atrium kiosk fire', description: 'Observe the coupled evolution of the buoyant plume and surrounding physical fields in an open atrium setting.', figure: 19 },
  residential: { family: 'Residential and Care Settings', title: 'Night-shift care ward linen-cart fire', description: 'Compare scene geometry with the changing temperature, smoke, velocity, and visibility fields in a care ward.', figure: 20 },
  industrial: { family: 'Industry, Energy, and Logistics', title: 'Integrated refinery pipe-rack energy fire', description: 'Follow the buoyant plume and heat and soot transport through an outdoor equipment layout, alongside spatially varying airflow and visibility.', figure: 21 },
  wildland: { family: 'Wildland and Wildland–Urban Interface', title: 'Hillside WUI evacuation-lane fire', description: 'Read aligned physical fields as fire develops in a hillside wildland–urban interface setting.', figure: 22 }
};

function keyboardTabs(container, activate) {
  const tabs = [...container.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      activate(tabs[next]);
    });
  });
}

function setActiveTab(tab) {
  tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]').forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  document.getElementById(tab.getAttribute('aria-controls')).setAttribute('aria-labelledby', tab.id);
}

keyboardTabs(document.querySelector('.scene-tabs'), tab => {
  setActiveTab(tab);
  const key = tab.dataset.scene;
  const scene = sceneData[key];
  document.getElementById('scene-family').textContent = scene.family.toUpperCase();
  document.getElementById('scene-title').textContent = scene.title;
  document.getElementById('scene-description').textContent = scene.description;
  document.getElementById('scene-reference').textContent = `Paper · Fig. ${scene.figure}`;
  const image = document.getElementById('scene-image');
  image.src = `assets/scene-${key}.webp`;
  image.alt = `Time-resolved 3D scenes and physical fields: ${scene.title}`;
  image.parentElement.dataset.lightbox = image.src;
  image.parentElement.dataset.caption = `Figure ${scene.figure}. ${scene.title}.`;
});

const results = {
  simulated: [
    { name: 'GPT-5.6-Luna', s: 55.34, i: 42.99 },
    { name: 'Gemini-2.5-Flash', s: 46.20, i: 44.83 },
    { name: 'Claude-Haiku-4.5', s: 44.78, i: 39.51 },
    { name: 'Qwen3.5-Plus-02-15', s: 47.25, i: 39.40 }
  ],
  real: [
    { name: 'GPT-5.6-Luna', s: 60.16, i: 51.51 },
    { name: 'Gemini-2.5-Flash', s: 54.35, i: 47.65 },
    { name: 'Claude-Haiku-4.5', s: 55.05, i: 45.95 },
    { name: 'Qwen3.5-Plus-02-15', s: 55.35, i: 43.47 }
  ]
};
let currentSetting = 'simulated';
let sortKey = 's';
let sortDirection = -1;

function renderResults() {
  const rows = results[currentSetting].map(row => ({ ...row, gap: row.s - row.i }));
  rows.sort((a, b) => sortDirection * (sortKey === 'name' ? a.name.localeCompare(b.name) : a[sortKey] - b[sortKey]));
  const bestS = Math.max(...rows.map(row => row.s));
  const bestI = Math.max(...rows.map(row => row.i));
  const scoreCell = (value, best) => `<td${value === best ? ' class="best-score"' : ''}>${value.toFixed(2)}${value === best ? '<span class="best-label">BEST</span>' : ''}</td>`;
  document.getElementById('results-body').innerHTML = rows.map(row => `<tr><th scope="row">${row.name}</th>${scoreCell(row.s, bestS)}${scoreCell(row.i, bestI)}<td class="gap-cell">${row.gap.toFixed(2)}</td></tr>`).join('');
  document.querySelectorAll('[data-sort]').forEach(button => {
    const active = button.dataset.sort === sortKey;
    button.closest('th').setAttribute('aria-sort', active ? (sortDirection === 1 ? 'ascending' : 'descending') : 'none');
    button.querySelector('[aria-hidden]').textContent = active ? (sortDirection === 1 ? '↑' : '↓') : '↕';
  });
  document.getElementById('table-source').textContent = currentSetting === 'simulated' ? 'Table 1' : 'Table 3';
  document.getElementById('results-caption').textContent = `Frontier model completion accuracy on ${currentSetting === 'simulated' ? 'controlled simulation' : 'real-world-aligned events'}, averaged over five physical capabilities`;
}

keyboardTabs(document.querySelector('.result-tabs'), tab => {
  setActiveTab(tab);
  currentSetting = tab.dataset.setting;
  renderResults();
});
document.querySelectorAll('[data-sort]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.sort;
  sortDirection = key === sortKey ? -sortDirection : (key === 'name' ? 1 : -1);
  sortKey = key;
  renderResults();
}));
renderResults();

const adaptation = [
  { name: 'Llama-3.1-8B-Instruct', vanilla: 31.1, sft: 43.1 },
  { name: 'Qwen3-8B', vanilla: 33.4, sft: 40.8 },
  { name: 'InternVL3-8B', vanilla: 25.1, sft: 34.1 },
  { name: 'Qwen3-VL-8B', vanilla: 29.2, sft: 41.0 }
];
document.getElementById('adaptation-bars').innerHTML = adaptation.map(model => `<div class="bar-group" role="img" aria-label="${model.name}: vanilla ${model.vanilla} percent, supervised fine-tuning ${model.sft} percent"><span class="bar-name">${model.name}</span><div class="bar-pair" aria-hidden="true"><div class="bar" style="--bar-width:${model.vanilla / 50 * 100}%"><span>${model.vanilla.toFixed(1)}</span></div><div class="bar sft" style="--bar-width:${model.sft / 50 * 100}%"><span>${model.sft.toFixed(1)}</span></div></div></div>`).join('');

const dialog = document.getElementById('figure-dialog');
let lastFigureButton;
document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
  lastFigureButton = button;
  const image = document.getElementById('dialog-image');
  image.src = button.dataset.lightbox;
  image.alt = button.querySelector('img').alt;
  document.getElementById('figure-dialog-caption').textContent = button.dataset.caption;
  dialog.showModal();
}));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => lastFigureButton?.focus());

document.getElementById('copy-citation').addEventListener('click', async () => {
  const text = document.getElementById('bibtex').textContent;
  const status = document.getElementById('copy-status');
  const label = document.querySelector('#copy-citation span');
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const field = document.createElement('textarea');
      field.value = text;
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      if (!copied) throw new Error('Copy unavailable');
    }
    label.textContent = 'Copied!';
    status.textContent = 'Citation copied to clipboard.';
    setTimeout(() => { label.textContent = 'Copy citation'; }, 2500);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('bibtex'));
    selection.removeAllRanges();
    selection.addRange(range);
    label.textContent = 'Press Ctrl/Cmd + C';
    status.textContent = 'Automatic copying is unavailable. The citation is selected; press Control C or Command C to copy.';
  }
});

if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.site-header nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main>section[id]').forEach(section => observer.observe(section));
}
