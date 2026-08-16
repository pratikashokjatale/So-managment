const fs = require('fs');

const path = './src/pages/dashboard/components/PopulationModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace AGE
content = content.replace(/\{\["All ages", "Children", "Adults", "Seniors"\].map\(\s*\(\s*opt\s*,\s*i\s*\)\s*=>\s*\(/g, 
  '{ageOptions.map((opt, i) => (');
content = content.replace(/i === 0 \? "#1e3a8a" : "#f1f5f9"/g, '(whoFilter === opt.value || ageFilter === opt.value || projectFilter === opt.value) ? "#1e3a8a" : "#f1f5f9"');
content = content.replace(/i === 0 \? "#ffffff" : "#64748b"/g, '(whoFilter === opt.value || ageFilter === opt.value || projectFilter === opt.value) ? "#ffffff" : "#64748b"');

// Fix key={i} issues since we did global replacements
// I'll just write a cleaner regex for the age box and project box manually via multi_replace_file_content if I want, or just let it be. Let's do it cleanly with multi_replace_file_content.
