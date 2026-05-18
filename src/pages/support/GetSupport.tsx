import { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Stack, TextField, Button, 
  Accordion, AccordionSummary, AccordionDetails, Card, CardContent, Avatar
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon, 
  HelpOutline as HelpIcon, 
  Phone as PhoneIcon, 
  Email as EmailIcon, 
  Forum as TicketIcon,
  SupportAgent as AgentIcon
} from '@mui/icons-material';

export default function GetSupport() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setTicketStatus('Ticket successfully logged! Our executive team will respond within 2 hours.');
    setSubject('');
    setMessage('');
    setTimeout(() => setTicketStatus(null), 6000);
  };

  const faqItems = [
    { q: "How do I register a new crew member or security guard?", a: "Navigate to Staff Management under the Staff dropdown and click 'Add Staff Member'. Once submitted, their verified digital plastic ID card will be automatically generated instantly." },
    { q: "How do I temporarily deactivate a clubhouse facility?", a: "Go to Facility Management, find the target facility in the ledger, and toggle the status switch in the 'Toggle Active' column to 'Inactive'. This instantly locks booking systems." },
    { q: "How can I check a staff member's break history?", a: "Open the Staff Attendance dashboard, locate the staff member, and click the 'View Logs' button. The interactive terminal log timeline will display all check-in, check-out, and break intervals recorded today." },
    { q: "Where do I update tower or flat details?", a: "Tower and Flat configurations are under the 'Setup' menu section on the sidebar. Expanding 'Setup' allows access to Projects, Towers, and individual Flats ledger dashboards." }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Header Panel */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" color="#002855">Help & Support</Typography>
        <Typography variant="subtitle1" color="text.secondary" fontWeight="700">
          Access core FAQs, submit support tickets, or contact Marbella Clubhouse operations desks
        </Typography>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Side: FAQs & Direct Contacts */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4}>
            
            {/* Quick Contact Cards */}
            <Typography variant="h5" fontWeight="900" color="#002855">Direct Channels</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '24px', bgcolor: 'white' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '20px !important' }}>
                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }}><PhoneIcon /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800">EMERGENCY HELPDESK</Typography>
                      <Typography variant="body1" fontWeight="800" color="#002855">+91 22 8879 4400</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '24px', bgcolor: 'white' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '20px !important' }}>
                    <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981' }}><EmailIcon /></Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="800">OFFICIAL SUPPORT EMAIL</Typography>
                      <Typography variant="body1" fontWeight="800" color="#002855">support@marbellaclub.com</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* FAQs Accordion */}
            <Box>
              <Typography variant="h5" fontWeight="900" color="#002855" sx={{ mb: 3 }}>
                Frequently Asked Questions
              </Typography>
              
              {faqItems.map((faq, index) => (
                <Accordion 
                  key={index}
                  elevation={0}
                  sx={{ 
                    mb: 1.5, 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px !important',
                    overflow: 'hidden',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon sx={{ color: '#002855' }} />}
                    sx={{ bgcolor: 'white', py: 1 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <HelpIcon sx={{ color: '#3b82f6' }} />
                      <Typography variant="body1" fontWeight="800" color="#002855">
                        {faq.q}
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ bgcolor: '#f8fafc', p: 3, borderTop: '1px solid #e2e8f0' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, lineHeight: 1.7 }}>
                      {faq.a}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

          </Stack>
        </Grid>

        {/* Right Side: Log a Ticket Form */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', bgcolor: 'white', position: 'sticky', top: 96 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#1d4ed8' }}><AgentIcon /></Avatar>
              <Box>
                <Typography variant="h5" fontWeight="900" color="#002855">Submit a Ticket</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="700">Direct query to operational executives</Typography>
              </Box>
            </Stack>

            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Subject Summary"
                  variant="outlined"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Squash Court active bookings dispute"
                  required
                  slotProps={{
                    input: {
                      sx: { borderRadius: '16px' }
                    }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Detailed Message Description"
                  variant="outlined"
                  multiline
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or query in detail so our technical team can coordinate..."
                  required
                  slotProps={{
                    input: {
                      sx: { borderRadius: '16px' }
                    }
                  }}
                />

                {ticketStatus && (
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px' }}>
                    <Typography variant="body2" fontWeight="800" color="#15803d">
                      {ticketStatus}
                    </Typography>
                  </Paper>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<TicketIcon />}
                  sx={{ 
                    borderRadius: '16px', 
                    py: 1.75, 
                    fontWeight: 900, 
                    bgcolor: '#002855', 
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#001a35' }
                  }}
                >
                  Log Support Ticket
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
}
