import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  ListAlt as LogsIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import LogItem from "@/components/LogItem";

interface SystemLogsProps {
  logs: any[];
  navigate: (path: string) => void;
}

export default function SystemLogs({ logs, navigate }: SystemLogsProps) {
  const [logsOpen, setLogsOpen] = useState(false);

  return (
    <>
      {/* Stretched System Logs (Full Width Bottom) */}
      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: "1px solid #f1f5f9",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(9, 21, 66, 0.02)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LogsIcon sx={{ color: "#0047b3" }} />
              <Typography variant="subtitle1" fontWeight="800" color="#091542">
                System Activity Logs (Recent)
              </Typography>
            </Stack>
            <Button
              size="small"
              onClick={() => navigate("/logs")}
              endIcon={<OpenInNewIcon fontSize="inherit" />}
              sx={{ fontWeight: 800, textTransform: "none", color: "#ef4444" }}
            >
              All Logs
            </Button>
          </Box>
          <Box
            sx={{
              maxHeight: "380px",
              overflowY: "auto",
              pr: 1.5,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cbd5e1",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#94a3b8",
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                  xl: "1fr 1fr 1fr",
                },
                gap: 2.5,
              }}
            >
              {logs.map((log) => (
                <LogItem key={log.id} log={log} />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* View All Logs Modal */}
      <Dialog
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(4px)",
              bgcolor: "rgba(9, 21, 66, 0.15)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 2,
            border: "1px solid #f1f5f9",
            boxShadow: "0 20px 40px rgba(9, 21, 66, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LogsIcon sx={{ color: "#0047b3" }} />
            <Typography variant="h6" fontWeight="900" color="#091542">
              All System Logs
            </Typography>
          </Stack>
          <IconButton
            onClick={() => setLogsOpen(false)}
            sx={{ color: "#64748b" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack>
            {logs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: "1px solid #f1f5f9" }}>
          <Button
            onClick={() => setLogsOpen(false)}
            variant="contained"
            sx={{
              borderRadius: "10px",
              fontWeight: 800,
              textTransform: "none",
              bgcolor: "#091542",
              color: "white",
              px: 3,
              "&:hover": { bgcolor: "#001a35" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
