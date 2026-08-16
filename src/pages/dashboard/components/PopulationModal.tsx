import React, { useState, useEffect } from "react";
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
import { getUsersApi } from "@/apis/user";

interface PopulationModalProps {
  open: boolean;
  onClose: () => void;
  onResidentClick?: (user: any) => void;
}

const PopulationModal: React.FC<PopulationModalProps> = ({ open, onClose, onResidentClick }) => {
  const [data, setData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
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

  const fetchUsers = async () => {
    try {
      let roleFilter: any = undefined;
      if (whoFilter === "OWNERS_RESIDENTS") roleFilter = "RESIDENT";
      
      const res = await getUsersApi({
        role: roleFilter,
        search: search || undefined,
        limit: 50
      });
      const list = (res as any)?.data?.users || (res as any)?.data?.items || (res as any)?.items || (res as any)?.data || [];
      setUsersList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      fetchUsers();
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
          <Box sx={{ position: "relative" }}>
            {/* Close Button */}
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: "#fff6e5",
                  color: "#c28b21",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 14 }} />
                View only
              </Box>
              <Box onClick={onClose}
                sx={{
                  bgcolor: "#f1f5f9",
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#64748b",
                  "&:hover": { bgcolor: "#e2e8f0" },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "inline-block",
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                CRM - Population
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: "2rem",
                  color: "#1e293b",
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                Population
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                Everyone living across the buildings — buyers, families,
                tenants, resales.
              </Typography>
            </Box>

            {/* Stat Cards Row 1 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 2,
                mb: 2,
              }}
            >
              {[
                {
                  icon: <PeopleAltOutlinedIcon sx={{ fontSize: 16 }} />,
                  label: "POPULATION",
                  value: cards.population,
                  subtext: "living here now",
                  color: "#64748b",
                },
                {
                  icon: <HomeOutlinedIcon sx={{ fontSize: 16 }} />,
                  label: "HOUSEHOLDS",
                  value: cards.households,
                  subtext: "6 owned · 1 rented",
                  color: "#64748b",
                },
                {
                  icon: <PersonOutlineIcon sx={{ fontSize: 16 }} />,
                  label: "BUYERS",
                  value: propertySales.buyers,
                  subtext: "bought from us",
                  color: "#64748b",
                },
                {
                  icon: <AutorenewOutlinedIcon sx={{ fontSize: 16 }} />,
                  label: "RESALES",
                  value: propertySales.resales?.count || 2,
                  subtext: "ownership transfers",
                  color: "#64748b",
                },
              ].map((stat, i) => (
                <Box
                  key={i}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    p: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: stat.color,
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "2rem",
                      color: "#1e293b",
                      lineHeight: 1,
                      fontFamily: '"Cormorant Garamond", serif',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{ color: "#94a3b8", fontSize: "0.75rem", mt: 1 }}
                  >
                    {stat.subtext}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Stat Cards Row 2 */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                mb: 4,
              }}
            >
              {[
                { value: ageGroups.adults || "13", subtext: "Adults", color: "#1e3a8a" },
                { value: ageGroups.children || "4", subtext: "Children", color: "#bca462" },
                { value: ageGroups.seniors || "1", subtext: "Seniors", color: "#7e22ce" },
              ].map((stat, i) => (
                <Box
                  key={i}
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.5rem",
                      color: stat.color,
                      lineHeight: 1,
                      fontFamily: '"Cormorant Garamond", serif',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      mt: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    {stat.subtext}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Search Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                p: 1.5,
                mb: 3,
              }}
            >
              <SearchIcon sx={{ color: "#94a3b8", mr: 1, fontSize: 20 }} />
              <input
                type="text"
                placeholder="Search name or unit..."
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  width: "100%",
                  fontSize: "0.9rem",
                  color: "#1e293b",
                }}
              />
            </Box>

            {/* Filters */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#64748b",
                    fontSize: "0.65rem",
                    letterSpacing: "0.5px",
                    width: 60,
                  }}
                >
                  WHO
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {whoOptions.map((opt, i) => (
                      <Box
                        key={i} onClick={() => opt.value === "EVERYONE" ? setWhoFilter("EVERYONE") : setWhoFilter(opt.value)}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          bgcolor: whoFilter === opt.value ? "#1e3a8a" : "#f1f5f9",
                          color: whoFilter === opt.value ? "#ffffff" : "#64748b",
                        }}
                      >
                        {opt.label}
                      </Box>
                    ),
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#64748b",
                    fontSize: "0.65rem",
                    letterSpacing: "0.5px",
                    width: 60,
                  }}
                >
                  AGE
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {ageOptions.map((opt, i) => (
                      <Box
                        key={i} 
                        onClick={() => setAgeFilter(opt.value)}
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          bgcolor: ageFilter === opt.value ? "#1e3a8a" : "#f1f5f9",
                          color: ageFilter === opt.value ? "#ffffff" : "#64748b",
                        }}
                      >
                        {opt.label}
                      </Box>
                    ),
                  )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#64748b",
                    fontSize: "0.65rem",
                    letterSpacing: "0.5px",
                    width: 60,
                  }}
                >
                  PROJECT
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  {projectOptions.map((opt, i) => (
                    <Box
                      key={i}
                      onClick={() => setProjectFilter(opt.value)}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        bgcolor: projectFilter === opt.value ? "#1e3a8a" : "#f1f5f9",
                        color: projectFilter === opt.value ? "#ffffff" : "#64748b",
                      }}
                    >
                      {opt.label}
                    </Box>
                  ))}

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#64748b",
                      fontSize: "0.65rem",
                      letterSpacing: "0.5px",
                      ml: 2,
                      mr: 1,
                    }}
                  >
                    MOVED IN
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        color: "#94a3b8",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        --------- ----
                      </Typography>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                    </Box>
                    <Typography sx={{ color: "#64748b", fontSize: "0.8rem" }}>
                      to
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        color: "#94a3b8",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        --------- ----
                      </Typography>
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* List Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f8fafc",
                p: 2,
                borderRadius: "12px 12px 0 0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <Typography
                sx={{ fontWeight: 600, color: "#475569", fontSize: "0.85rem" }}
              >
                {usersList.length} people
              </Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                tap anyone to open their profile
              </Typography>
            </Box>

            {/* List Items */}
            <Box
              sx={{
                border: "1px solid #e2e8f0",
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
              }}
            >
              {usersList.map((person, i) => (
                <Box
                  key={i} 
                  onClick={() => onResidentClick && onResidentClick(person)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: i !== usersList.length - 1 ? "1px solid #e2e8f0" : "none",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#f1f5f9",
                        color: "#1e3a8a",
                        width: 40,
                        height: 40,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      {person?.name ? person.name.slice(0, 2).toUpperCase() : `${person?.firstName?.[0] || ""}${person?.lastName?.[0] || ""}`}
                    </Avatar>
                    <Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography sx={{ fontWeight: 600, color: "#1e293b" }}>
                          {person?.name || `${person?.firstName || ""} ${person?.lastName || ""}`.trim() || "Unknown"}
                        </Typography>
                        {person?.role && (
                          <Box
                            sx={{
                              bgcolor: "#eef2ff",
                              color: "#4f46e5",
                              px: 1,
                              py: 0.25,
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                            }}
                          >
                            {person.role}
                          </Box>
                        )}
                      </Box>
                      <Typography
                        sx={{ color: "#64748b", fontSize: "0.8rem", mt: 0.5 }}
                      >
                        {person?.phone ? `+91 ${person.phone}` : "No phone"} · {person?.accountRole || "Resident"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.85rem",
                        }}
                      >
                        {person?.flat?.unitNumber || "N/A"}
                      </Typography>
                      <Typography
                        sx={{ color: "#94a3b8", fontSize: "0.75rem" }}
                      >
                        {person?.project?.name || "Grand"}
                      </Typography>
                    </Box>
                    <ChevronRightOutlinedIcon sx={{ color: "#cbd5e1" }} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Dialog>
  );
};

export default PopulationModal;
