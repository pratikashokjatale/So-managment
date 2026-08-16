const fs = require('fs');

const path = './src/pages/dashboard/components/PopulationModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const imports = `import React, { useState, useEffect } from "react";
import { Box, Typography, Dialog, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { getCrmPopulationSummaryApi } from "@/apis/crm";

interface PopulationModalProps {
  open: boolean;
  onClose: () => void;
}

const PopulationModal: React.FC<PopulationModalProps> = ({ open, onClose }) => {
  const [data, setData] = useState<any>(null);
  
  // Filter States
  const [whoFilter, setWhoFilter] = useState("EVERYONE");
  const [ageFilter, setAgeFilter] = useState("ALL");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await getCrmPopulationSummaryApi({
        who: whoFilter,
        ageGroup: ageFilter,
        projectId: projectFilter === "ALL" ? undefined : projectFilter,
        search: search || undefined
      });
      setData(res?.data || res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, whoFilter, ageFilter, projectFilter, search]);

  const cards = data?.cards || { population: 18, households: 7, ownersResidents: 6, tenants: 2, guests: 1, family: 9 };
  const ageGroups = data?.ageGroups || { adults: 13, children: 4, seniors: 1 };
  const propertySales = data?.propertySales || { buyers: 6, resales: { count: 2 } };

  // Mapping options for UI
  const whoOptions = [
    { label: "Everyone", value: "EVERYONE" },
    { label: "Owners / residents", value: "OWNERS_RESIDENTS" },
    { label: "Tenants", value: "TENANTS" },
    { label: "Family", value: "FAMILY" }
  ];
  const ageOptions = [
    { label: "All ages", value: "ALL" },
    { label: "Children", value: "CHILDREN" },
    { label: "Adults", value: "ADULTS" },
    { label: "Seniors", value: "SENIORS" }
  ];
  const projectOptions = [
    { label: "All", value: "ALL" },
    { label: "Grand", value: "Grand" },
    { label: "Twin Tower", value: "Twin Tower" },
    { label: "Royce", value: "Royce" }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          p: { xs: 2, md: 4 },
          bgcolor: "#ffffff",
        },
      }}
    >
`;

const footer = `
    </Dialog>
  );
};

export default PopulationModal;
`;

// Replace hardcoded values inside the template
content = content.replace(/{ value: "13"/g, '{ value: ageGroups.adults || "13"');
content = content.replace(/{ value: "4"/g, '{ value: ageGroups.children || "4"');
content = content.replace(/{ value: "1"/g, '{ value: ageGroups.seniors || "1"');

content = content.replace(/value: "18"/, 'value: cards.population');
content = content.replace(/value: "7"/, 'value: cards.households');
content = content.replace(/value: "6"/, 'value: propertySales.buyers');
content = content.replace(/value: "2"/, 'value: propertySales.resales?.count || 2');

content = content.replace(/<Box\s+onClick=\{\(\) => setPopulationModalOpen\(false\)\}/g, '<Box onClick={onClose}');

// Replace Who mapping
content = content.replace(/\{\["Everyone", "Owners \/ residents", "Tenants", "Family"\].map\(\s*\(\s*opt\s*,\s*i\s*\)\s*=>\s*\(/g, 
  '{whoOptions.map((opt, i) => (');
content = content.replace(/opt\}/g, 'opt.label}');
content = content.replace(/i === 0 \? "#1e3a8a" : "#f1f5f9"/g, 'whoFilter === opt.value ? "#1e3a8a" : "#f1f5f9"');
content = content.replace(/i === 0 \? "#ffffff" : "#64748b"/g, 'whoFilter === opt.value ? "#ffffff" : "#64748b"');
// add onClick
content = content.replace(/key=\{i\}/g, 'key={i} onClick={() => opt.value === "EVERYONE" ? setWhoFilter("EVERYONE") : setWhoFilter(opt.value)}');

fs.writeFileSync(path, imports + content + footer);
