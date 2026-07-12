import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AdminChartsProps {
  filterType: string;
  finalLineData: any[];
  finalPieData: any[];
  totalPieAccess: number;
}

export default function AdminCharts({
  filterType,
  finalLineData,
  finalPieData,
  totalPieAccess,
}: AdminChartsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
        gap: 4,
      }}
    >
      {/* Bookings Overview */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid rgba(226, 232, 240, 0.8)",
          borderRadius: "20px",
          height: "420px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          boxShadow: "0 10px 35px rgba(9, 21, 66, 0.02)",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="850"
          color="#091542"
          sx={{ mb: 4, fontSize: "1.1rem" }}
        >
          Bookings & Transactions ({filterType})
        </Typography>
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={finalLineData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="All Transactions"
                stroke="#2c4d93"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#2c4d93",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="confirmed"
                name="Successful"
                stroke="#10b981"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#10b981",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                name="Failed"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#f59e0b",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Facility Footfall Pie */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid rgba(226, 232, 240, 0.8)",
          borderRadius: "20px",
          height: "420px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          boxShadow: "0 10px 35px rgba(9, 21, 66, 0.02)",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="850"
          color="#091542"
          sx={{ mb: 4, fontSize: "1.1rem" }}
        >
          Facility Usage Distribution
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              height: 240,
              width: 240,
              flexShrink: 0,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart width={240} height={240}>
              <Pie
                data={finalPieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {finalPieData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" fontWeight="550" color="#091542">
                {totalPieAccess}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="700"
                sx={{ letterSpacing: 0.5 }}
              >
                VISITS/BOOKINGS
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              width: "100%",
              maxHeight: "280px",
              overflowY: "auto",
              pr: 1,
            }}
          >
            {finalPieData.map((item: any) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-1px)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: item.color,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: "#64748b",
                    }}
                    noWrap
                  >
                    {item.name}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    color: "#091542",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
