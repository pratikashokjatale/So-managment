import axios from 'axios';
axios.get('https://marbellasociety.4tech.in/api/v1/users?role=RESIDENT&limit=1').then(res => console.log(JSON.stringify(res.data, null, 2))).catch(console.error);
