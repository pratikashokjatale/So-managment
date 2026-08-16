const fs = require('fs');

const path = './src/pages/dashboard/components/PopulationModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Import getUsersApi
content = content.replace('import { getCrmPopulationSummaryApi } from "@/apis/crm";', 
  'import { getCrmPopulationSummaryApi } from "@/apis/crm";\nimport { getUsersApi } from "@/apis/user";');

// 2. Add onResidentClick prop
content = content.replace('interface PopulationModalProps {\n  open: boolean;\n  onClose: () => void;\n}',
  'interface PopulationModalProps {\n  open: boolean;\n  onClose: () => void;\n  onResidentClick?: (user: any) => void;\n}');

// 3. Destructure onResidentClick
content = content.replace('const PopulationModal: React.FC<PopulationModalProps> = ({ open, onClose }) => {',
  'const PopulationModal: React.FC<PopulationModalProps> = ({ open, onClose, onResidentClick }) => {');

// 4. Add users state
content = content.replace('const [data, setData] = useState<any>(null);',
  'const [data, setData] = useState<any>(null);\n  const [usersList, setUsersList] = useState<any[]>([]);\n  const [loadingUsers, setLoadingUsers] = useState(false);');

// 5. Update fetchData to call getUsersApi
const fetchDataReplacement = `  const fetchData = async () => {
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
    setLoadingUsers(true);
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
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      fetchUsers();
    }
  }, [open, whoFilter, ageFilter, projectFilter, search]);`;

content = content.replace(/const fetchData = async \(\) => \{[\s\S]*?\}, \[open, whoFilter, ageFilter, projectFilter, search\]\);/, fetchDataReplacement);

// 6. Update the mapping logic
const listRegex = /\{\[\s*\{\s*name: "Rohit Mehra"[\s\S]*?\]\.map\(\(person, i\) => \([\s\S]*?onClick=\{\(\) => opt\.value === "EVERYONE"\? setWhoFilter\("EVERYONE"\) : setWhoFilter\(opt\.value\)\}[\s\S]*?sx=\{\{/;

// The regex might be complex because of the bad string replacement. Let's do it safer.
fs.writeFileSync(path, content);
