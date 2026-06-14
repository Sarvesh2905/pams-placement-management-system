/**
 * PAMS Seed Test Data Script
 * Creates: 10 Coordinators, 50 Students, 7 Companies, 20 Alumni,
 *          4 Placement Announcements, 5 Notifications
 * Run: node scripts/seed-test-data.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';

// ─── HTTP helper ───────────────────────────────────────────────────────────────
function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (res.statusCode >= 400) {
            console.warn(`  ⚠  ${method} ${path} → ${res.statusCode}: ${json.message || raw}`);
          }
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: raw });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// ─── Step 0: Admin login ────────────────────────────────────────────────────
async function login() {
  console.log('\n🔐 Logging in as admin...');
  const res = await request('POST', '/auth/login', {
    email: 'pamsadmin@college.edu',
    password: 'pamsadmin123',
    role: 'admin',
  });
  if (res.status !== 200) throw new Error('Admin login failed: ' + JSON.stringify(res.data));
  adminToken = res.data.token;
  console.log('  ✅ Logged in. Token obtained.');
}

// ─── A. Coordinators ────────────────────────────────────────────────────────
const coordinators = [
  { name: 'Karthik Subramaniam',       email: 'karthik.subramaniam@drngpit.ac.in',       phoneNo: '9876543210', department: 'Artificial Intelligence & Data Science',                    password: 'Coordinator@123' },
  { name: 'Priya Dharshini',           email: 'priya.dharshini@drngpit.ac.in',           phoneNo: '9876543211', department: 'Biomedical Engineering',                                    password: 'Coordinator@123' },
  { name: 'Mohammed Faizal',           email: 'mohammed.faizal@drngpit.ac.in',           phoneNo: '8765432100', department: 'Civil Engineering',                                         password: 'Coordinator@123' },
  { name: 'Lakshmi Narayanan',         email: 'lakshmi.narayanan@drngpit.ac.in',         phoneNo: '7654321009', department: 'Computer Science & Engineering',                            password: 'Coordinator@123' },
  { name: 'Deepika Rajendran',         email: 'deepika.rajendran@drngpit.ac.in',         phoneNo: '9345678901', department: 'Computer Science & Engineering (Cyber Security Specialization)', password: 'Coordinator@123' },
  { name: 'Arun Prasath',              email: 'arun.prasath@drngpit.ac.in',              phoneNo: '8234567890', department: 'Computer Science and Business Systems',                     password: 'Coordinator@123' },
  { name: 'Sangeetha Murugan',         email: 'sangeetha.murugan@drngpit.ac.in',         phoneNo: '7123456789', department: 'Electrical & Electronics Engineering',                      password: 'Coordinator@123' },
  { name: 'Vignesh Kumar',             email: 'vignesh.kumar@drngpit.ac.in',             phoneNo: '9012345678', department: 'Electronics & Communication Engineering',                   password: 'Coordinator@123' },
  { name: 'Revathi Balasubramanian',   email: 'revathi.balasubramanian@drngpit.ac.in',   phoneNo: '8901234567', department: 'Information Technology',                                    password: 'Coordinator@123' },
  { name: 'Naveen Anand',             email: 'naveen.anand@drngpit.ac.in',             phoneNo: '7890123456', department: 'Mechanical Engineering',                                     password: 'Coordinator@123' },
];

async function seedCoordinators() {
  console.log('\n👩‍🏫 Seeding 10 Coordinators...');
  for (const c of coordinators) {
    const res = await request('POST', '/admin/coordinators', c, adminToken);
    const ok = res.status === 201;
    console.log(`  ${ok ? '✅' : '❌'} ${c.name} [${c.department.substring(0,35)}...]`);
  }
}

// ─── B. Students (50 total — 5 per dept, 2+ years each) ─────────────────────
// Year values accepted by the admin UI filter: 2021,2022,2023,2024,2025
// We use 2022–2025 across departments so filters are testable.
// Dept codes: AIDS, BME, CIVIL, CSE, CS-CY, CSBS, EEE, ECE, IT, MECH
const students = [
  // ── Artificial Intelligence & Data Science (AIDS) ──
  { name:'Arjun Raghunath',    registerNumber:'AIDS24001', rollNo:'24AIDS01', email:'arjun.raghunath24@drngpit.ac.in',    phoneNo:'9001110001', department:'Artificial Intelligence & Data Science',                     batch:'2021-2025', year:2024, cgpa:8.5 },
  { name:'Sneha Krishnamurthy',registerNumber:'AIDS24002', rollNo:'24AIDS02', email:'sneha.krishnamurthy24@drngpit.ac.in',phoneNo:'9001110002', department:'Artificial Intelligence & Data Science',                     batch:'2021-2025', year:2024, cgpa:9.2 },
  { name:'Harish Venkatesh',   registerNumber:'AIDS23003', rollNo:'23AIDS03', email:'harish.venkatesh23@drngpit.ac.in',   phoneNo:'9001110003', department:'Artificial Intelligence & Data Science',                     batch:'2020-2024', year:2023, cgpa:7.8 },
  { name:'Ramya Selvakumar',   registerNumber:'AIDS23004', rollNo:'23AIDS04', email:'ramya.selvakumar23@drngpit.ac.in',   phoneNo:'9001110004', department:'Artificial Intelligence & Data Science',                     batch:'2020-2024', year:2023, cgpa:6.5 },
  { name:'Dinesh Prabakaran',  registerNumber:'AIDS25005', rollNo:'25AIDS05', email:'dinesh.prabakaran25@drngpit.ac.in',  phoneNo:'9001110005', department:'Artificial Intelligence & Data Science',                     batch:'2022-2026', year:2025, cgpa:9.8 },

  // ── Biomedical Engineering (BME) ──
  { name:'Anitha Rajan',       registerNumber:'BME24001', rollNo:'24BME01', email:'anitha.rajan24@drngpit.ac.in',         phoneNo:'9002220001', department:'Biomedical Engineering',                                    batch:'2021-2025', year:2024, cgpa:8.1 },
  { name:'Surya Prakash',      registerNumber:'BME24002', rollNo:'24BME02', email:'surya.prakash24@drngpit.ac.in',        phoneNo:'9002220002', department:'Biomedical Engineering',                                    batch:'2021-2025', year:2024, cgpa:7.4 },
  { name:'Kavitha Shanmugam',  registerNumber:'BME23003', rollNo:'23BME03', email:'kavitha.shanmugam23@drngpit.ac.in',    phoneNo:'9002220003', department:'Biomedical Engineering',                                    batch:'2020-2024', year:2023, cgpa:8.9 },
  { name:'Praveen Murugesan',  registerNumber:'BME22004', rollNo:'22BME04', email:'praveen.murugesan22@drngpit.ac.in',    phoneNo:'9002220004', department:'Biomedical Engineering',                                    batch:'2019-2023', year:2022, cgpa:6.0 },
  { name:'Divya Srinivasan',   registerNumber:'BME25005', rollNo:'25BME05', email:'divya.srinivasan25@drngpit.ac.in',     phoneNo:'9002220005', department:'Biomedical Engineering',                                    batch:'2022-2026', year:2025, cgpa:9.5 },

  // ── Civil Engineering (CIVIL) ──
  { name:'Gowtham Baskaran',   registerNumber:'CIVIL24001', rollNo:'24CIVIL01', email:'gowtham.baskaran24@drngpit.ac.in', phoneNo:'9003330001', department:'Civil Engineering',                                         batch:'2021-2025', year:2024, cgpa:7.2 },
  { name:'Meenakshi Pillai',   registerNumber:'CIVIL24002', rollNo:'24CIVIL02', email:'meenakshi.pillai24@drngpit.ac.in', phoneNo:'9003330002', department:'Civil Engineering',                                         batch:'2021-2025', year:2024, cgpa:8.3 },
  { name:'Senthilkumar Raja',  registerNumber:'CIVIL23003', rollNo:'23CIVIL03', email:'senthilkumar.raja23@drngpit.ac.in',phoneNo:'9003330003', department:'Civil Engineering',                                         batch:'2020-2024', year:2023, cgpa:6.7 },
  { name:'Preethi Nagarajan',  registerNumber:'CIVIL22004', rollNo:'22CIVIL04', email:'preethi.nagarajan22@drngpit.ac.in',phoneNo:'9003330004', department:'Civil Engineering',                                         batch:'2019-2023', year:2022, cgpa:7.9 },
  { name:'Aravind Chandran',   registerNumber:'CIVIL25005', rollNo:'25CIVIL05', email:'aravind.chandran25@drngpit.ac.in', phoneNo:'9003330005', department:'Civil Engineering',                                         batch:'2022-2026', year:2025, cgpa:8.6 },

  // ── Computer Science & Engineering (CSE) ──
  { name:'Vishal Mohan',       registerNumber:'CSE24001', rollNo:'24CSE01', email:'vishal.mohan24@drngpit.ac.in',         phoneNo:'9004440001', department:'Computer Science & Engineering',                            batch:'2021-2025', year:2024, cgpa:9.1 },
  { name:'Nithya Devi',        registerNumber:'CSE24002', rollNo:'24CSE02', email:'nithya.devi24@drngpit.ac.in',          phoneNo:'9004440002', department:'Computer Science & Engineering',                            batch:'2021-2025', year:2024, cgpa:8.7 },
  { name:'Bharath Raj',        registerNumber:'CSE23003', rollNo:'23CSE03', email:'bharath.raj23@drngpit.ac.in',          phoneNo:'9004440003', department:'Computer Science & Engineering',                            batch:'2020-2024', year:2023, cgpa:7.5 },
  { name:'Sathyapriya Raman',  registerNumber:'CSE22004', rollNo:'22CSE04', email:'sathyapriya.raman22@drngpit.ac.in',   phoneNo:'9004440004', department:'Computer Science & Engineering',                            batch:'2019-2023', year:2022, cgpa:8.0 },
  { name:'Kishore Balaji',     registerNumber:'CSE25005', rollNo:'25CSE05', email:'kishore.balaji25@drngpit.ac.in',       phoneNo:'9004440005', department:'Computer Science & Engineering',                            batch:'2022-2026', year:2025, cgpa:9.6 },

  // ── CS & Engineering (Cyber Security) (CS-CY) ──
  { name:'Dharani Krishnan',   registerNumber:'CSCY24001', rollNo:'24CSCY01', email:'dharani.krishnan24@drngpit.ac.in',   phoneNo:'9005550001', department:'Computer Science & Engineering (Cyber Security Specialization)', batch:'2021-2025', year:2024, cgpa:8.4 },
  { name:'Pavithra Selvaraj',  registerNumber:'CSCY24002', rollNo:'24CSCY02', email:'pavithra.selvaraj24@drngpit.ac.in',  phoneNo:'9005550002', department:'Computer Science & Engineering (Cyber Security Specialization)', batch:'2021-2025', year:2024, cgpa:9.0 },
  { name:'Ezhilarasan Murali', registerNumber:'CSCY23003', rollNo:'23CSCY03', email:'ezhilarasan.murali23@drngpit.ac.in', phoneNo:'9005550003', department:'Computer Science & Engineering (Cyber Security Specialization)', batch:'2020-2024', year:2023, cgpa:7.3 },
  { name:'Sujitha Annamalai',  registerNumber:'CSCY22004', rollNo:'22CSCY04', email:'sujitha.annamalai22@drngpit.ac.in',  phoneNo:'9005550004', department:'Computer Science & Engineering (Cyber Security Specialization)', batch:'2019-2023', year:2022, cgpa:6.8 },
  { name:'Manikandan Pillai',  registerNumber:'CSCY25005', rollNo:'25CSCY05', email:'manikandan.pillai25@drngpit.ac.in',  phoneNo:'9005550005', department:'Computer Science & Engineering (Cyber Security Specialization)', batch:'2022-2026', year:2025, cgpa:9.3 },

  // ── Computer Science and Business Systems (CSBS) ──
  { name:'Santhosh Rajan',     registerNumber:'CSBS24001', rollNo:'24CSBS01', email:'santhosh.rajan24@drngpit.ac.in',     phoneNo:'9006660001', department:'Computer Science and Business Systems',                     batch:'2021-2025', year:2024, cgpa:8.2 },
  { name:'Abirami Suresh',     registerNumber:'CSBS24002', rollNo:'24CSBS02', email:'abirami.suresh24@drngpit.ac.in',     phoneNo:'9006660002', department:'Computer Science and Business Systems',                     batch:'2021-2025', year:2024, cgpa:7.6 },
  { name:'Prasanth Natarajan', registerNumber:'CSBS23003', rollNo:'23CSBS03', email:'prasanth.natarajan23@drngpit.ac.in', phoneNo:'9006660003', department:'Computer Science and Business Systems',                     batch:'2020-2024', year:2023, cgpa:8.8 },
  { name:'Indhu Priya',        registerNumber:'CSBS22004', rollNo:'22CSBS04', email:'indhu.priya22@drngpit.ac.in',        phoneNo:'9006660004', department:'Computer Science and Business Systems',                     batch:'2019-2023', year:2022, cgpa:7.1 },
  { name:'Rajkumar Velu',      registerNumber:'CSBS25005', rollNo:'25CSBS05', email:'rajkumar.velu25@drngpit.ac.in',      phoneNo:'9006660005', department:'Computer Science and Business Systems',                     batch:'2022-2026', year:2025, cgpa:9.4 },

  // ── Electrical & Electronics Engineering (EEE) ──
  { name:'Balaji Subramani',   registerNumber:'EEE24001', rollNo:'24EEE01', email:'balaji.subramani24@drngpit.ac.in',     phoneNo:'9007770001', department:'Electrical & Electronics Engineering',                      batch:'2021-2025', year:2024, cgpa:7.9 },
  { name:'Nandini Kumaresan',  registerNumber:'EEE24002', rollNo:'24EEE02', email:'nandini.kumaresan24@drngpit.ac.in',    phoneNo:'9007770002', department:'Electrical & Electronics Engineering',                      batch:'2021-2025', year:2024, cgpa:8.5 },
  { name:'Muthu Krishnan',     registerNumber:'EEE23003', rollNo:'23EEE03', email:'muthu.krishnan23@drngpit.ac.in',       phoneNo:'9007770003', department:'Electrical & Electronics Engineering',                      batch:'2020-2024', year:2023, cgpa:6.3 },
  { name:'Sangavi Rajan',      registerNumber:'EEE22004', rollNo:'22EEE04', email:'sangavi.rajan22@drngpit.ac.in',        phoneNo:'9007770004', department:'Electrical & Electronics Engineering',                      batch:'2019-2023', year:2022, cgpa:7.6 },
  { name:'Kabilesh Shankar',   registerNumber:'EEE25005', rollNo:'25EEE05', email:'kabilesh.shankar25@drngpit.ac.in',     phoneNo:'9007770005', department:'Electrical & Electronics Engineering',                      batch:'2022-2026', year:2025, cgpa:9.1 },

  // ── Electronics & Communication Engineering (ECE) ──
  { name:'Jeevitha Ramachandran',registerNumber:'ECE24001', rollNo:'24ECE01', email:'jeevitha.ramachandran24@drngpit.ac.in',phoneNo:'9008880001', department:'Electronics & Communication Engineering',                  batch:'2021-2025', year:2024, cgpa:8.6 },
  { name:'Sivakumar Palani',   registerNumber:'ECE24002', rollNo:'24ECE02', email:'sivakumar.palani24@drngpit.ac.in',     phoneNo:'9008880002', department:'Electronics & Communication Engineering',                   batch:'2021-2025', year:2024, cgpa:7.2 },
  { name:'Yogalakshmi Durai',  registerNumber:'ECE23003', rollNo:'23ECE03', email:'yogalakshmi.durai23@drngpit.ac.in',    phoneNo:'9008880003', department:'Electronics & Communication Engineering',                   batch:'2020-2024', year:2023, cgpa:9.0 },
  { name:'Tamilselvan Raj',    registerNumber:'ECE22004', rollNo:'22ECE04', email:'tamilselvan.raj22@drngpit.ac.in',      phoneNo:'9008880004', department:'Electronics & Communication Engineering',                   batch:'2019-2023', year:2022, cgpa:6.9 },
  { name:'Brindha Natarajan',  registerNumber:'ECE25005', rollNo:'25ECE05', email:'brindha.natarajan25@drngpit.ac.in',    phoneNo:'9008880005', department:'Electronics & Communication Engineering',                   batch:'2022-2026', year:2025, cgpa:8.3 },

  // ── Information Technology (IT) ──
  { name:'Yuvaraj Chandrasekaran',registerNumber:'IT24001', rollNo:'24IT01', email:'yuvaraj.chandrasekaran24@drngpit.ac.in',phoneNo:'9009990001', department:'Information Technology',                                 batch:'2021-2025', year:2024, cgpa:8.9 },
  { name:'Aswini Prabhu',      registerNumber:'IT24002', rollNo:'24IT02', email:'aswini.prabhu24@drngpit.ac.in',          phoneNo:'9009990002', department:'Information Technology',                                   batch:'2021-2025', year:2024, cgpa:7.7 },
  { name:'Saravanan Murugan',  registerNumber:'IT23003', rollNo:'23IT03', email:'saravanan.murugan23@drngpit.ac.in',      phoneNo:'9009990003', department:'Information Technology',                                   batch:'2020-2024', year:2023, cgpa:8.4 },
  { name:'Geetha Rajan',       registerNumber:'IT22004', rollNo:'22IT04', email:'geetha.rajan22@drngpit.ac.in',           phoneNo:'9009990004', department:'Information Technology',                                   batch:'2019-2023', year:2022, cgpa:7.0 },
  { name:'Parthiban Selvam',   registerNumber:'IT25005', rollNo:'25IT05', email:'parthiban.selvam25@drngpit.ac.in',       phoneNo:'9009990005', department:'Information Technology',                                   batch:'2022-2026', year:2025, cgpa:9.7 },

  // ── Mechanical Engineering (MECH) ──
  { name:'Vijayakumar Selvam', registerNumber:'MECH24001', rollNo:'24MECH01', email:'vijayakumar.selvam24@drngpit.ac.in', phoneNo:'9110001001', department:'Mechanical Engineering',                                   batch:'2021-2025', year:2024, cgpa:10.0 },
  { name:'Saranya Raman',      registerNumber:'MECH24002', rollNo:'24MECH02', email:'saranya.raman24@drngpit.ac.in',      phoneNo:'9110001002', department:'Mechanical Engineering',                                   batch:'2021-2025', year:2024, cgpa:7.8 },
  { name:'Elangovan Venkat',   registerNumber:'MECH23003', rollNo:'23MECH03', email:'elangovan.venkat23@drngpit.ac.in',   phoneNo:'9110001003', department:'Mechanical Engineering',                                   batch:'2020-2024', year:2023, cgpa:6.4 },
  { name:'Poorani Selvaraj',   registerNumber:'MECH22004', rollNo:'22MECH04', email:'poorani.selvaraj22@drngpit.ac.in',   phoneNo:'9110001004', department:'Mechanical Engineering',                                   batch:'2019-2023', year:2022, cgpa:8.2 },
  { name:'Chandru Rajan',      registerNumber:'MECH25005', rollNo:'25MECH05', email:'chandru.rajan25@drngpit.ac.in',      phoneNo:'9110001005', department:'Mechanical Engineering',                                   batch:'2022-2026', year:2025, cgpa:9.0 },
];

async function seedStudents() {
  console.log('\n🎓 Seeding 50 Students...');
  for (const s of students) {
    const res = await request('POST', '/admin/students', s, adminToken);
    const ok = res.status === 201;
    console.log(`  ${ok ? '✅' : '❌'} ${s.name} [${s.rollNo}] — ${s.department.substring(0,30)}`);
  }
}

// ─── C. Companies ────────────────────────────────────────────────────────────
const companies = [
  { name:'TCS',                              location:'Chennai',     hrName:'Arunachalam Srinivasan', hrContact:'9444556677', hrEmail:'hr.tcs@tcs.com',         website:'https://www.tcs.com' },
  { name:'Infosys',                          location:'Bengaluru',   hrName:'Padmavathi Rao',         hrContact:'9555667788', hrEmail:'hr.infosys@infosys.com', website:'https://www.infosys.com' },
  { name:'Cognizant',                        location:'Coimbatore',  hrName:'Venkataraman Iyer',      hrContact:'9666778899', hrEmail:'hr.cognizant@cognizant.com', website:'https://www.cognizant.com' },
  { name:'Wipro',                            location:'Hyderabad',   hrName:'Suhasini Reddy',         hrContact:'9777889900', hrEmail:'hr.wipro@wipro.com',     website:'https://www.wipro.com' },
  { name:'Zoho Corporation',                 location:'Chennai',     hrName:'Muthuvel Pandiyan',      hrContact:'9888990011', hrEmail:'hr.zoho@zoho.com',       website:'https://www.zoho.com' },
  { name:'HCLTech',                          location:'Pune',        hrName:'Savitha Krishnan',       hrContact:'9999001122', hrEmail:'hr.hcltech@hcltech.com', website:'https://www.hcltech.com' },
  { name:'Accenture',                        location:'Bengaluru',   hrName:'Rajeshwari Iyer',        hrContact:'9000112233', hrEmail:'hr.accenture@accenture.com', website:'https://www.accenture.com' },
  { name:'Amazon Development Centre (India)',location:'Hyderabad',   hrName:'Krishnamoorthi Nair',    hrContact:'9111223344', hrEmail:'hr.amazon@amazon.com',   website:'https://www.amazon.com' },
];

async function seedCompanies() {
  console.log('\n🏢 Seeding 8 Companies...');
  for (const c of companies) {
    const res = await request('POST', '/admin/companies', c, adminToken);
    const ok = res.status === 201;
    console.log(`  ${ok ? '✅' : '❌'} ${c.name} — ${c.location}`);
  }
}

// ─── D. Alumni (20 total — 2 per dept) ──────────────────────────────────────
const alumni = [
  // AIDS
  { name:'Aadithya Balan',      year:2023, department:'Artificial Intelligence & Data Science',                     currentRole:'Data Analyst at Zoho',                    linkedinProfile:'https://linkedin.com/in/aadithya-balan' },
  { name:'Nandhini Prakash',    year:2022, department:'Artificial Intelligence & Data Science',                     currentRole:'ML Engineer at Infosys',                  linkedinProfile:'https://linkedin.com/in/nandhini-prakash' },
  // BME
  { name:'Sathish Kumar',       year:2023, department:'Biomedical Engineering',                                    currentRole:'Biomedical Engineer at Apollo Hospitals',  linkedinProfile:'https://linkedin.com/in/sathish-kumar-bme' },
  { name:'Rekha Rajan',         year:2021, department:'Biomedical Engineering',                                    currentRole:'Research Associate at IIT Madras',         linkedinProfile:'https://linkedin.com/in/rekha-rajan' },
  // Civil
  { name:'Anand Subramanian',   year:2022, department:'Civil Engineering',                                         currentRole:'Site Engineer at L&T Construction',        linkedinProfile:'https://linkedin.com/in/anand-subramanian' },
  { name:'Selvi Murugan',       year:2020, department:'Civil Engineering',                                         currentRole:'Structural Engineer at Shapoorji Pallonji',linkedinProfile:'https://linkedin.com/in/selvi-murugan' },
  // CSE
  { name:'Kiran Raj',           year:2024, department:'Computer Science & Engineering',                            currentRole:'Software Engineer at TCS',                 linkedinProfile:'https://linkedin.com/in/kiran-raj' },
  { name:'Mangayarkarasi Devi', year:2022, department:'Computer Science & Engineering',                            currentRole:'Full Stack Developer at Zoho',             linkedinProfile:'https://linkedin.com/in/mangayarkarasi-devi' },
  // CS-CY
  { name:'Dhanasekaran Pillai', year:2024, department:'Computer Science & Engineering (Cyber Security Specialization)', currentRole:'Cyber Security Analyst at HCLTech',   linkedinProfile:'https://linkedin.com/in/dhanasekaran-pillai' },
  { name:'Thenmozhi Raj',       year:2023, department:'Computer Science & Engineering (Cyber Security Specialization)', currentRole:'Security Engineer at Wipro',           linkedinProfile:'https://linkedin.com/in/thenmozhi-raj' },
  // CSBS
  { name:'Satheesh Prabhu',     year:2023, department:'Computer Science and Business Systems',                     currentRole:'Business Analyst at Cognizant',            linkedinProfile:'https://linkedin.com/in/satheesh-prabhu' },
  { name:'Anuradha Sundar',     year:2021, department:'Computer Science and Business Systems',                     currentRole:'ERP Consultant at Infosys',                linkedinProfile:'https://linkedin.com/in/anuradha-sundar' },
  // EEE
  { name:'Ramachandran Nair',   year:2022, department:'Electrical & Electronics Engineering',                      currentRole:'Electrical Engineer at BHEL',              linkedinProfile:'https://linkedin.com/in/ramachandran-nair' },
  { name:'Subhashini Rajan',    year:2020, department:'Electrical & Electronics Engineering',                      currentRole:'Power Systems Analyst at TNEB',            linkedinProfile:'https://linkedin.com/in/subhashini-rajan' },
  // ECE
  { name:'Venkatesh Iyer',      year:2024, department:'Electronics & Communication Engineering',                   currentRole:'Embedded Engineer at Bosch',               linkedinProfile:'https://linkedin.com/in/venkatesh-iyer' },
  { name:'Kayalvizhi Selvan',   year:2021, department:'Electronics & Communication Engineering',                   currentRole:'VLSI Design Engineer at Intel',            linkedinProfile:'https://linkedin.com/in/kayalvizhi-selvan' },
  // IT
  { name:'Murugeswaran Raj',    year:2023, department:'Information Technology',                                    currentRole:'Software Developer at Accenture',          linkedinProfile:'https://linkedin.com/in/murugeswaran-raj' },
  { name:'Vijitha Krishnan',    year:2022, department:'Information Technology',                                    currentRole:'Cloud Engineer at Amazon',                 linkedinProfile:'https://linkedin.com/in/vijitha-krishnan' },
  // MECH
  { name:'Palaniswamy Raj',     year:2023, department:'Mechanical Engineering',                                    currentRole:'Mechanical Design Engineer at TVS Motors', linkedinProfile:'https://linkedin.com/in/palaniswamy-raj' },
  { name:'Deepa Chandran',      year:2020, department:'Mechanical Engineering',                                    currentRole:'Production Engineer at Ashok Leyland',     linkedinProfile:'https://linkedin.com/in/deepa-chandran' },
];

async function seedAlumni() {
  console.log('\n🎓 Seeding 20 Alumni...');
  for (const a of alumni) {
    const res = await request('POST', '/admin/alumni', a, adminToken);
    const ok = res.status === 201;
    console.log(`  ${ok ? '✅' : '❌'} ${a.name} [${a.year}] — ${a.department.substring(0,30)}`);
  }
}

// ─── E. Placement Announcements (4) ─────────────────────────────────────────
const announcements = [
  {
    companyName: 'Zoho Corporation',
    departments: ['Information Technology'],
    students: ['Yuvaraj Chandrasekaran', 'Aswini Prabhu', 'Saravanan Murugan'],
    role: 'Software Developer Intern',
    package: 4.5,
    batch: '2022-2026',
  },
  {
    companyName: 'TCS',
    departments: ['Computer Science & Engineering', 'Information Technology', 'Computer Science & Engineering (Cyber Security Specialization)'],
    students: ['Vishal Mohan', 'Yuvaraj Chandrasekaran', 'Dharani Krishnan'],
    role: 'Assistant System Engineer',
    package: 3.6,
    batch: '2021-2025',
  },
  {
    companyName: 'Accenture',
    departments: [
      'Artificial Intelligence & Data Science',
      'Biomedical Engineering',
      'Civil Engineering',
      'Computer Science & Engineering',
      'Computer Science & Engineering (Cyber Security Specialization)',
      'Computer Science and Business Systems',
      'Electrical & Electronics Engineering',
      'Electronics & Communication Engineering',
      'Information Technology',
      'Mechanical Engineering',
    ],
    students: ['Nithya Devi', 'Jeevitha Ramachandran', 'Aswini Prabhu'],
    role: 'Associate Software Engineer',
    package: 4.0,
    batch: '2022-2026',
  },
  {
    companyName: 'Amazon Development Centre (India)',
    departments: ['Computer Science & Engineering'],
    students: ['Bharath Raj', 'Kishore Balaji'],
    role: 'SDE-1',
    package: 12.0,
    batch: '2021-2025',
  },
];

async function seedAnnouncements() {
  console.log('\n📢 Seeding 4 Placement Announcements...');
  for (const a of announcements) {
    const res = await request('POST', '/admin/placement-announcements', a, adminToken);
    const ok = res.status === 201;
    console.log(`  ${ok ? '✅' : '❌'} ${a.companyName} — ${a.role}`);
  }
}

// ─── F. Notifications (5) ────────────────────────────────────────────────────
const now = new Date();
const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

const notifications = [
  {
    title: 'Campus Placement Drive Begins',
    body: 'The campus placement drive for the academic year 2025 has officially commenced. All eligible students are requested to update their profiles and attend the orientation session.',
    targetAudience: 'all',
    targetDepartments: [],
    scheduledAt: now.toISOString(),
  },
  {
    title: 'Resume Submission Deadline',
    body: 'Students from IT and CSE departments must submit their updated resumes to the placement portal before the deadline. Only shortlisted candidates will be called for further rounds.',
    targetAudience: 'students',
    targetDepartments: ['Information Technology', 'Computer Science & Engineering'],
    scheduledAt: now.toISOString(),
  },
  {
    title: 'Pre-placement Talk for Final Years',
    body: 'A pre-placement talk has been arranged for final year students (2024 batch). Industry experts will guide you through interview preparation, aptitude tests, and resume building.',
    targetAudience: 'students',
    targetDepartments: [],
    targetYear: 2024,
    scheduledAt: now.toISOString(),
  },
  {
    title: 'Department Coordinator Meeting',
    body: 'All department coordinators for Mechanical Engineering and Civil Engineering are invited for a mandatory coordination meeting. Please confirm attendance by EOD.',
    targetAudience: 'coordinators',
    targetDepartments: ['Mechanical Engineering', 'Civil Engineering'],
    scheduledAt: twoDaysFromNow.toISOString(),  // future — to test scheduled logic
  },
  {
    title: 'Aptitude Test Registration',
    body: 'Students from all departments with year of study 2023 must register for the upcoming aptitude test. The test will be conducted online and is mandatory for placement eligibility.',
    targetAudience: 'students',
    targetDepartments: [
      'Artificial Intelligence & Data Science',
      'Biomedical Engineering',
      'Civil Engineering',
      'Computer Science & Engineering',
      'Computer Science & Engineering (Cyber Security Specialization)',
      'Computer Science and Business Systems',
      'Electrical & Electronics Engineering',
      'Electronics & Communication Engineering',
      'Information Technology',
      'Mechanical Engineering',
    ],
    targetYear: 2023,
    scheduledAt: now.toISOString(),
  },
];

async function seedNotifications() {
  console.log('\n🔔 Seeding 5 Notifications...');
  for (const n of notifications) {
    const res = await request('POST', '/admin/notifications', n, adminToken);
    const ok = res.status === 201;
    console.log(`  ${ok ? '✅' : '❌'} "${n.title}" → audience:${n.targetAudience}`);
    if (!ok) console.log('     Detail:', res.data);
  }
}

// ─── Verify counts ────────────────────────────────────────────────────────────
async function verifyStats() {
  console.log('\n📊 Verifying dashboard stats...');
  const res = await request('GET', '/admin/dashboard-stats', null, adminToken);
  if (res.status === 200) {
    const d = res.data;
    console.log(`  Students:      ${d.totalStudents}  (expected 50)`);
    console.log(`  Companies:     ${d.totalCompanies} (expected 8)`);
    console.log(`  Coordinators:  ${d.totalCoordinators} (expected 10)`);
    console.log(`  Alumni:        ${d.totalAlumni}  (expected 20)`);
    console.log(`  Announcements: ${d.totalAnnouncements} (expected 4)`);
    console.log(`  Notifications: ${d.totalNotifications} (expected 5)`);
  } else {
    console.warn('  Could not fetch stats:', res.data);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await login();
    await seedCoordinators();
    await seedStudents();
    await seedCompanies();
    await seedAlumni();
    await seedAnnouncements();
    await seedNotifications();
    await verifyStats();
    console.log('\n✅ Seeding complete!\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  }
})();
