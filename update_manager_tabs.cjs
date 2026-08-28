const fs = require('fs');
const file = 'src/pages/dashboard/ManagerDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import for RestaurantOutlined
content = content.replace(
  'Logout as LogoutIcon,',
  'Logout as LogoutIcon,\n  RestaurantOutlined,'
);

// 2. Add activeTab state
content = content.replace(
  'const [scanModalOpen, setScanModalOpen] = useState(false);',
  'const [activeTab, setActiveTab] = useState("counter");\n  const [scanModalOpen, setScanModalOpen] = useState(false);'
);

// 3. Define the tabs array inside the component just before the return
const tabsCode = `
  const managerTabs = [
    { id: "counter", label: "Counter", icon: <AccountBalanceWalletOutlined sx={{ fontSize: 16 }} /> },
    { id: "banquet", label: "Banquet", icon: <RestaurantOutlined sx={{ fontSize: 16 }} /> },
    { id: "sessions", label: "Sessions", icon: <CardMembershipOutlined sx={{ fontSize: 16 }} /> },
    { id: "staff", label: "Staff", icon: <PeopleOutlined sx={{ fontSize: 16 }} /> },
    { id: "upkeep", label: "Upkeep", icon: <WorkOutline sx={{ fontSize: 16 }} /> },
    { id: "spend", label: "Spend", icon: <TrendingUpOutlined sx={{ fontSize: 16 }} /> },
    { id: "requests", label: "Requests", icon: <InfoOutlined sx={{ fontSize: 16 }} /> }
  ];
`;
content = content.replace('return (', tabsCode + '\n  return (');

// 4. Inject the Tab Bar UI after KPI cards
const tabBarUI = `
            {/* ── Tabs ── */}
            <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, mt: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
              {managerTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    startIcon={tab.icon}
                    sx={{
                      bgcolor: isActive ? "#204a7b" : "#f1f5f9",
                      color: isActive ? "#ffffff" : "#64748b",
                      textTransform: "none",
                      borderRadius: "10px",
                      px: 2,
                      py: 0.8,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: isActive ? "#163a62" : "#e2e8f0",
                        boxShadow: "none"
                      }
                    }}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </Box>
`;

content = content.replace(
  '{/* ── Member Counter ── */}',
  tabBarUI + '\n            {activeTab === "counter" && (\n              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>\n            {/* ── Member Counter ── */}'
);

// 5. Wrap the end of Data Panels Row
content = content.replace(
  '          </Box>\n        </Paper>\n      </Box>',
  '              </Box>\n            )}\n            {activeTab !== "counter" && (\n              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px", bgcolor: "#f8fafc", borderRadius: "16px", border: "1px dashed #cbd5e1", textAlign: "center" }}>\n                <Box>\n                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "1.5rem", mb: 1, fontFamily: "\\"Cormorant Garamond\\", serif" }}>Coming soon</Typography>\n                  <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>The {managerTabs.find(t => t.id === activeTab)?.label} tab is currently being wired up.</Typography>\n                </Box>\n              </Box>\n            )}\n          </Box>\n        </Paper>\n      </Box>'
);

fs.writeFileSync(file, content);
console.log('Successfully updated manager tabs.');
