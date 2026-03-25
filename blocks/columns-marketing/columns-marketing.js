const ICONS = {
  'Fast, Free Shipping': '/icons/icon-shipping.svg',
  'Worry-Free Returns': '/icons/icon-returns.svg',
  'Converse Gift Cards': '/icons/icon-giftcards.svg',
};

const SOCIAL_ICONS = {
  instagram: '/icons/icon-instagram.png',
  twitter: '/icons/icon-twitter.png',
  youtube: '/icons/icon-youtube.png',
  tiktok: '/icons/icon-tiktok.png',
};

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-marketing-img-col');
        }
      }

      const h3 = col.querySelector('h3');
      if (!h3) return;
      const title = h3.textContent.trim();

      // Follow Us: replace text links with social media icon images
      if (title === 'Follow Us') {
        const links = col.querySelectorAll('p > a[href]');
        const iconRow = document.createElement('div');
        iconRow.className = 'columns-marketing-social';
        links.forEach((a) => {
          const href = a.getAttribute('href').toLowerCase();
          const name = a.textContent.trim().toLowerCase();
          let key = '';
          if (href.includes('instagram') || name === 'instagram') key = 'instagram';
          else if (href.includes('twitter') || href.includes('x.com') || name === 'twitter') key = 'twitter';
          else if (href.includes('youtube') || name === 'youtube') key = 'youtube';
          else if (href.includes('tiktok') || name === 'tiktok') key = 'tiktok';
          if (key && SOCIAL_ICONS[key]) {
            const link = document.createElement('a');
            link.href = a.href;
            link.setAttribute('aria-label', name);
            const img = document.createElement('img');
            img.src = SOCIAL_ICONS[key];
            img.alt = name;
            img.width = 24;
            img.height = 24;
            link.appendChild(img);
            iconRow.appendChild(link);
          }
          a.closest('p').remove();
        });
        // Place social icons ABOVE the heading
        h3.parentNode.insertBefore(iconRow, h3);
      }

      // inject heading icons as images
      const iconSrc = ICONS[title];
      if (iconSrc) {
        const iconEl = document.createElement('div');
        iconEl.className = 'columns-marketing-icon';
        const img = document.createElement('img');
        img.src = iconSrc;
        img.alt = title;
        img.width = 48;
        img.height = 48;
        iconEl.appendChild(img);
        h3.parentNode.insertBefore(iconEl, h3);
      }
    });
  });
}
