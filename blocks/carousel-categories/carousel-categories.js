let carouselId = 0;
const AUTO_ROTATE_INTERVAL = 4000;

function showCategory(block, index) {
  const images = block.querySelectorAll('.carousel-categories-image');
  const labels = block.querySelectorAll('.carousel-categories-label');

  images.forEach((img, i) => {
    img.classList.toggle('active', i === index);
    img.setAttribute('aria-hidden', i !== index);
  });

  labels.forEach((label, i) => {
    label.classList.toggle('active', i === index);
    label.setAttribute('aria-selected', i === index);
  });

  block.dataset.activeSlide = index;
}

function startAutoRotate(block) {
  const count = block.querySelectorAll('.carousel-categories-image').length;
  return setInterval(() => {
    const current = parseInt(block.dataset.activeSlide, 10) || 0;
    const next = (current + 1) % count;
    showCategory(block, next);
  }, AUTO_ROTATE_INTERVAL);
}

export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-categories-${carouselId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Featured Categories');

  const rows = [...block.querySelectorAll(':scope > div')];

  // Build left panel (images)
  const imagePanel = document.createElement('div');
  imagePanel.classList.add('carousel-categories-images');

  // Build right panel (category labels)
  const labelPanel = document.createElement('div');
  labelPanel.classList.add('carousel-categories-labels');
  labelPanel.setAttribute('role', 'tablist');
  labelPanel.setAttribute('aria-label', 'Category Navigation');

  rows.forEach((row, idx) => {
    const cols = row.querySelectorAll(':scope > div');
    const imageCol = cols[0];
    const textCol = cols[1];

    // Image wrapper
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('carousel-categories-image');
    if (idx === 0) imageWrapper.classList.add('active');
    imageWrapper.setAttribute('aria-hidden', idx !== 0);
    const pic = imageCol.querySelector('picture');
    if (pic) imageWrapper.append(pic);
    imagePanel.append(imageWrapper);

    // Label item
    const label = document.createElement('a');
    label.classList.add('carousel-categories-label');
    if (idx === 0) label.classList.add('active');
    label.setAttribute('role', 'tab');
    label.setAttribute('aria-selected', idx === 0);
    label.dataset.index = idx;

    const heading = textCol.querySelector('h2');
    const link = textCol.querySelector('a');
    if (heading) label.textContent = heading.textContent;
    if (link) label.href = link.href;

    // Arrow icon
    const arrow = document.createElement('span');
    arrow.classList.add('carousel-categories-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    label.append(arrow);

    labelPanel.append(label);

    row.remove();
  });

  block.append(imagePanel);
  block.append(labelPanel);

  // Hover/focus interactions
  let autoRotateTimer = startAutoRotate(block);

  labelPanel.querySelectorAll('.carousel-categories-label').forEach((label) => {
    label.addEventListener('mouseenter', () => {
      clearInterval(autoRotateTimer);
      showCategory(block, parseInt(label.dataset.index, 10));
    });

    label.addEventListener('mouseleave', () => {
      autoRotateTimer = startAutoRotate(block);
    });

    label.addEventListener('focus', () => {
      clearInterval(autoRotateTimer);
      showCategory(block, parseInt(label.dataset.index, 10));
    });

    label.addEventListener('blur', () => {
      autoRotateTimer = startAutoRotate(block);
    });
  });

  // Pause on block hover
  block.addEventListener('mouseenter', () => {
    clearInterval(autoRotateTimer);
  });

  block.addEventListener('mouseleave', () => {
    autoRotateTimer = startAutoRotate(block);
  });

  block.dataset.activeSlide = 0;
}
