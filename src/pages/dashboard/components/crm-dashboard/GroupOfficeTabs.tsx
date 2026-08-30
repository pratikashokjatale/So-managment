import { Box, Button } from "@mui/material";

export type GroupOfficeTab =
  | "onboarding"
  | "inventory"
  | "payment plans"
  | "reminders"
  | "purchase requests"
  | "sales pipeline";

const tabs: Array<{ label: string; value: GroupOfficeTab }> = [
  { label: "Onboarding & handover", value: "onboarding" },
  { label: "Inventory", value: "inventory" },
  { label: "Payment plans", value: "payment plans" },
  { label: "Reminders", value: "reminders" },
  { label: "Purchase requests", value: "purchase requests" },
  { label: "Sales pipeline", value: "sales pipeline" },
];

type GroupOfficeTabsProps = {
  activeTab: GroupOfficeTab;
  onChange: (tab: GroupOfficeTab) => void;
};

const GroupOfficeTabs = ({ activeTab, onChange }: GroupOfficeTabsProps) => (
  <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
    {tabs.map((tab) => {
      const isSelected = activeTab === tab.value;

      return (
        <Button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          sx={{
            bgcolor: isSelected ? "#24528C" : "#EAF0F7",
            color: isSelected ? "#f7f7f7" : "#6B7794",
            textTransform: "none",
            borderRadius: "10px",
            px: 2,
            py: 1,
            fontWeight: 600,
            fontSize: "0.85rem",
            "&:hover": { bgcolor: "#24528C", color: "#fff" },
          }}
        >
          {tab.label}
        </Button>
      );
    })}
  </Box>
);

export default GroupOfficeTabs;
