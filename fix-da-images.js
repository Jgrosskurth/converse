/**
 * DA Image Fix Script
 *
 * Run this script in your browser console while logged into da.live
 * It will update the index.html content to reference the correct media hash images.
 *
 * Steps:
 * 1. Go to https://da.live/#/Jgrosskurth/converse
 * 2. Open browser DevTools (F12) → Console
 * 3. Paste this entire script and press Enter
 */

(async () => {
  // Get the auth token from the IMS library
  const { token } = await window.adobeIMS?.getAccessToken() || {};
  if (!token) {
    console.error('❌ Not logged in. Please sign into da.live first.');
    return;
  }
  console.log('✅ Got auth token');

  // Fetch current content
  const getResp = await fetch('https://admin.da.live/source/Jgrosskurth/converse/index.html', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!getResp.ok) {
    console.error(`❌ Failed to fetch content: ${getResp.status}`);
    return;
  }

  const html = await getResp.text();
  console.log('✅ Fetched current content');

  // Replace about:error with correct media hash paths based on alt text
  const imageMap = [
    { alt: '', src: './media_1e1216c9be41a6f775732568a6a2c19d9f78aae67.jpg' }, // Hero banner (first image with empty alt)
    { alt: 'Shop High Top Shoes', src: './media_1da84683dc55b2d012f0510021f065ffa1d0cd12a.jpg' },
    { alt: 'Shop Low Top Shoes', src: './media_19f627e17d16c2672841f28b8a36cb30ccbd1a5e4.jpg' },
    { alt: 'Shop Platform Shoes', src: './media_1ba208a824caa7732eb762adf89cf2ab7a4df1398.jpg' },
    { alt: 'Shop Custom Shoes', src: './media_1da84683dc55b2d012f0510021f065ffa1d0cd12a.jpg' },
    { alt: 'Chuck Color Shoes', src: './media_14e7d959df23d0d01535f8241a5aba79e4be610c1.jpg' },
    { alt: 'Custom Shoes', src: './media_1f3aa068651a2e929485aec67351d72b1690b733f.jpg' },
    { alt: 'Shai 001 Blush is sold out - sign up for more to come', src: './media_16cd2afaba452e0c7397a3dd77b45509cfb004060.jpg' },
    { alt: 'Sign up to be notified about updates', src: './media_143516926f59a8d49e4bff0183b51fa76471fd1d5.jpg' },
  ];

  // Parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const images = doc.querySelectorAll('img');

  let replaced = 0;
  // Handle images by matching alt text
  images.forEach((img) => {
    const alt = img.getAttribute('alt') || '';
    const mapping = imageMap.find((m) => m.alt === alt);
    if (mapping && img.getAttribute('src') === 'about:error') {
      img.setAttribute('src', mapping.src);
      replaced += 1;
      console.log(`  ✅ Fixed: "${alt || '(empty alt)'}" → ${mapping.src}`);
    }
  });

  if (replaced === 0) {
    console.log('ℹ️ No broken images found. Content may already be fixed.');
    return;
  }

  console.log(`✅ Fixed ${replaced} images`);

  // Save back to DA
  const newHtml = doc.body.innerHTML;
  const blob = new Blob([newHtml], { type: 'text/html' });
  const formData = new FormData();
  formData.append('data', blob, 'index.html');

  const putResp = await fetch('https://admin.da.live/source/Jgrosskurth/converse/index.html', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (putResp.ok) {
    console.log('✅ Content saved to DA!');

    // Trigger preview
    const previewResp = await fetch('https://admin.hlx.page/preview/Jgrosskurth/converse/main/', {
      method: 'POST',
    });
    console.log(`✅ Preview triggered: ${previewResp.status}`);
    console.log('🎉 Done! Refresh the preview page to see images.');
  } else {
    console.error(`❌ Failed to save: ${putResp.status}`);
    const text = await putResp.text();
    console.error(text);
  }
})();
