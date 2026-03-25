export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // force line break before "Chuck 70" so it appears on a second line
  const textDiv = block.querySelector(':scope > div:last-child > div:first-child');
  if (textDiv) {
    const html = textDiv.innerHTML;
    if (html.includes('Chuck 70')) {
      textDiv.innerHTML = html.replace(/Chuck 70/, '<br>Chuck 70');
    }
  }
}
