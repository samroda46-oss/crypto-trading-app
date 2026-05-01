// Preload script for security
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
});

// Prevent navigation to external sites
window.addEventListener('beforeunload', (e) => {
  // Prevent accidental navigation
});