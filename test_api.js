import axios from 'axios';
axios.get('https://marbellasociety.4tech.in/api/v1/crm/population/summary?who=EVERYONE&ageGroup=ALL&status=ACTIVE').then(console.log).catch(console.error);
