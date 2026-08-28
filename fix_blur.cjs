const fs = require('fs');
const file = 'src/pages/dashboard/components/CRMDashboard.tsx';
const currentContent = fs.readFileSync(file, 'utf8');

const newContent = currentContent.replace(
  /<Box sx={{ filter: 'blur\\(6px\\)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>/,
  '<Box sx={{ opacity: 0.5, pointerEvents: "none", userSelect: "none" }}>'
).replace(
  /position: 'absolute',\n                  top: 0, left: 0, right: 0, bottom: 0,\n                  display: 'flex',/g,
  \`position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',\`
);

fs.writeFileSync(file, newContent);
console.log('Fixed blur.');
