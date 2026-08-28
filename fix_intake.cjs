const fs = require('fs');
const file = 'src/pages/dashboard/components/CRMDashboard.tsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes('activeTab === "intake" && ('));
let endIdx = -1;
let brace = 0;
for(let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('{')) brace += (lines[i].match(/\{/g) || []).length;
  if (lines[i].includes('}')) brace -= (lines[i].match(/\}/g) || []).length;
  if (brace === 0 && lines[i].trim() === ')}' && i > startIdx + 10) {
    endIdx = i;
    break;
  }
}

if(startIdx !== -1 && endIdx !== -1) {
  const newContent = `          {activeTab === "intake" && (
            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: "16px",
                border: "1px dashed #cbd5e1",
                p: { xs: 4, md: 8 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                justifyContent: "center",
                minHeight: "300px",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "1.5rem",
                  mb: 1,
                  fontFamily: '"Cormorant Garamond", serif',
                }}
              >
                Coming soon
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
                The AI document intake engine is currently being wired up.
              </Typography>
            </Box>
          )}`;
          
  lines.splice(startIdx, endIdx - startIdx + 1, newContent);
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully replaced intake block.');
} else {
  console.log('Could not find bounds: ', startIdx, endIdx);
}
