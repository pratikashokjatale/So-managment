const fs = require('fs');
const { execSync } = require('child_process');

const file = 'src/pages/dashboard/components/CRMDashboard.tsx';
const currentContent = fs.readFileSync(file, 'utf8');
const lines = currentContent.split('\n');

const headContent = execSync('git show HEAD:' + file).toString();
const headLines = headContent.split('\n');
const originalIntake = headLines.slice(2835, 3340).join('\n'); // 2836 is idx 2835

const startIdx = lines.findIndex(l => l.includes('activeTab === "intake" && ('));
let endIdx = -1;
let brace = 0;
for(let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('{')) brace += (lines[i].match(/\{/g) || []).length;
  if (lines[i].includes('}')) brace -= (lines[i].match(/\}/g) || []).length;
  if (brace === 0 && lines[i].trim() === ')}' && i > startIdx + 1) {
    endIdx = i;
    break;
  }
}

if(startIdx !== -1 && endIdx !== -1) {
  // We need to wrap the original intake in a relative Box, and put the blur + coming soon overlay
  // The original starts with `          {activeTab === "intake" && (`
  // We will replace that line too since we're replacing the whole block.
  
  const innerContent = headLines.slice(2836, 3339).join('\n'); // without the `{activeTab === "intake" && (` and `)}`
  
  const wrappedContent = `          {activeTab === "intake" && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ filter: 'blur(6px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
${innerContent}
              </Box>
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    border: "1px solid #e2e8f0",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.5rem", mb: 1, fontFamily: '"Cormorant Garamond", serif' }}>
                    Coming soon
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                    The AI document intake engine is currently being wired up.
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}`;
          
  lines.splice(startIdx, endIdx - startIdx + 1, wrappedContent);
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully applied blurred overlay.');
} else {
  console.log('Could not find bounds: ', startIdx, endIdx);
}
