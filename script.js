/* Delta Electric Power interactions */
const pillarData = {
  ac: {
    title: 'AC Heavy-Duty Cooling Arrays',
    desc: 'Designed for high-voltage panel boards, transformer units, and uninterrupted industrial machinery cooling. High airflow output with sustained thermal resilience under continuous load.',
    specs: ['220V - 380V Direct Input Range', 'Cast Aluminum Impeller Frames', 'Maintenance-free dual ball bearings'],
    tag: 'MODE: AC_STANDARD',
    status: '> Telemetry: Nominal 2800 RPM Output'
  },
  dc: {
    title: 'DC & EC Precision Micro-Ventilation',
    desc: 'Variable speed controls via PWM signals. Ultra-low wattage consumption tailored for precision telecom cabinets, automation logic racks, and battery storage modules.',
    specs: ['12V / 24V / 48V Precision Inputs', 'Integrated PWM Feedback Control', 'Ultra-Quiet Acoustic Dampening'],
    tag: 'MODE: DC_EC_PRECISION',
    status: '> Telemetry: 92% Motor Energy Efficiency'
  },
  blower: {
    title: 'Industrial Centrifugal Blowers',
    desc: 'High static pressure blowers constructed to drive dense airflow through restricted ductwork, heavy filter assemblies, and severe industrial environments.',
    specs: ['High Static Pressure Chamber', 'IP68 Environmental Sealing', 'Reinforced Multi-Blade Turbines'],
    tag: 'MODE: BLOWER_HIGH_PRESS',
    status: '> Telemetry: Static Pressure Peak 850 Pa'
  }
};

const byId = id => document.getElementById(id);
const firstElement = (...ids) => ids.map(byId).find(Boolean);

function switchPillar(type) {
  const data = pillarData[type];
  if (!data) return;

  document.querySelectorAll('.pillar-btn, .tab').forEach(button => {
    button.classList.remove('active', 'bg-royal-blue', 'text-white', 'border-royal-blue');
  });

  const active = byId(`tab-${type}`) || document.querySelector(`[data-pillar="${type}"]`);
  active?.classList.add('active', 'bg-royal-blue', 'text-white', 'border-royal-blue');

  if (byId('pillarTitle')) byId('pillarTitle').textContent = data.title;
  if (byId('pillarDesc')) byId('pillarDesc').textContent = data.desc;
  if (byId('pillarTag')) byId('pillarTag').textContent = data.tag;
  if (byId('pillarStatus')) byId('pillarStatus').textContent = data.status;
  if (byId('pillarSpecs')) {
    byId('pillarSpecs').innerHTML = data.specs
      .map(spec => `<li><i class="fa-solid fa-check text-royal-blue mr-2"></i>${spec}</li>`)
      .join('');
  }
}

function runCalculation() {
  const select = byId('fanSelect');
  const quantityInput = firstElement('quantityInput', 'quantity');
  const accessory = firstElement('accessorySelect', 'accessory');
  const display = firstElement('totalPriceDisplay', 'total');
  if (!select || !quantityInput || !accessory || !display) return;

  const quantity = Math.max(1, parseInt(quantityInput.value, 10) || 1);
  quantityInput.value = quantity;
  const total = ((Number(select.value) || 0) + (Number(accessory.value) || 0)) * quantity;
  display.textContent = `$${total.toFixed(2)}`;
}

function selectProduct(modelName) {
  const select = byId('fanSelect');
  if (!select) return;
  const optionIndex = [...select.options].findIndex(option => option.dataset.name === modelName);
  if (optionIndex < 0) return;
  select.selectedIndex = optionIndex;
  runCalculation();
  byId('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function adjustFanSpeed(mode) {
  const consoleBox = byId('telemetryConsole');
  if (!consoleBox) return;
  const time = new Date().toLocaleTimeString();
  const message = mode === 'low'
    ? 'ECO MODE ACTIVATED: Voltage scaled to 60%. RPM throttled to 1400. Noise < 28 dBA.'
    : 'HIGH PERFORMANCE ENGAGED: Max voltage applied. RPM boosted to 3600. Airflow at 100% capacity.';
  consoleBox.insertAdjacentHTML('beforeend', `<p>[${time}] ${message}</p>`);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function toggleNosFeature(checkbox) {
  const consoleBox = byId('telemetryConsole');
  if (!consoleBox) return;
  const time = new Date().toLocaleTimeString();
  const message = checkbox.checked
    ? 'NOS BOOST MODE: Standby protocol loaded. Feature module active.'
    : 'NOS BOOST MODE: Deactivated.';
  consoleBox.insertAdjacentHTML('beforeend', `<p>[${time}] ${message}</p>`);
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function handleOrderSubmission(event) {
  event.preventDefault();
  const select = byId('fanSelect');
  const accessory = firstElement('accessorySelect', 'accessory');
  const quantity = firstElement('quantityInput', 'quantity');
  const total = firstElement('totalPriceDisplay', 'total');
  if (!select || !accessory || !quantity || !total) return;

  const model = select.options[select.selectedIndex]?.dataset.name || select.value;
  const accessoryName = accessory.options[accessory.selectedIndex]?.dataset.acc
    || accessory.options[accessory.selectedIndex]?.dataset.name
    || accessory.options[accessory.selectedIndex]?.textContent;
  const message = `Hello DELTA ELECTRIC POWER!\nI would like to place an order/quote request:\n\n*Model:* ${model}\n*Quantity:* ${quantity.value} unit(s)\n*Accessory:* ${accessoryName}\n*Total Estimated Quote:* ${total.textContent}\n\nPlease confirm availability and dispatch details.`;
  window.open(`https://wa.me/8801774777962?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

function openZoomModal(image, title) {
  const modal = byId('imageModal');
  const modalImage = byId('modalImg');
  if (!modal || !modalImage) return;
  modalImage.src = image;
  modalImage.alt = title;
  if (byId('modalTitle')) byId('modalTitle').textContent = title;
  modal.classList.remove('hidden');
}

function closeZoomModal() {
  byId('imageModal')?.classList.add('hidden');
}

function toggleImageZoom(container) {
  container.querySelector('img')?.classList.toggle('scale-150');
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-pillar]').forEach(button => {
    button.addEventListener('click', () => switchPillar(button.dataset.pillar));
  });
  document.querySelectorAll('.pillar-btn').forEach(button => {
    button.addEventListener('click', () => switchPillar(button.id.replace('tab-', '')));
  });
  document.querySelectorAll('[data-mode]').forEach(button => {
    button.addEventListener('click', () => adjustFanSpeed(button.dataset.mode));
  });
  document.querySelectorAll('[data-product]').forEach(button => {
    button.addEventListener('click', () => selectProduct(button.dataset.product));
  });

  byId('fanSelect')?.addEventListener('change', runCalculation);
  firstElement('quantityInput', 'quantity')?.addEventListener('input', runCalculation);
  firstElement('accessorySelect', 'accessory')?.addEventListener('change', runCalculation);
  byId('quoteForm')?.addEventListener('submit', handleOrderSubmission);
  byId('calculatorForm')?.addEventListener('submit', handleOrderSubmission);
  runCalculation();
});
