<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAfm7eDJPFiWrUK_U0aqS7yl2Wt_PpjmA",
  authDomain: "garage-system-41587.firebaseapp.com",
  projectId: "garage-system-41587",
  storageBucket: "garage-system-41587.firebasestorage.app",
  messagingSenderId: "688480145767",
  appId: "1:688480145767:web:f457e635675df0cbd91fc2",
  measurementId: "G-X8ZYNK9JRS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// เพิ่มงานซ่อม
async function saveJob() {
 await addDoc(collection(db, "jobs"), {
   customer: "สมชาย",
   car: "Toyota Vigo",
   repair: "เปลี่ยนน้ำมันเครื่อง",
   status: "รอคิว",
   createdAt: new Date()
 });
 alert("บันทึกงานแล้ว");
}

// โหลดงานทั้งหมด
async function loadJobs() {
 const querySnapshot = await getDocs(collection(db, "jobs"));
 querySnapshot.forEach((doc) => {
   console.log(doc.id, doc.data());
 });
}

window.saveJob = saveJob;
window.loadJobs = loadJobs;
</script>
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NISA AUTO CAR SERVICE</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{
font-family:Arial,Helvetica,sans-serif;
background:#0f1115;
color:#fff;
}
header{
background:linear-gradient(135deg,#00c853,#009624);
padding:22px;
text-align:center;
box-shadow:0 4px 15px rgba(0,0,0,.25);
}
header h1{
font-size:28px;
letter-spacing:1px;
}
header p{
margin-top:6px;
font-size:14px;
opacity:.95;
}
.wrap{
max-width:1200px;
margin:auto;
padding:18px;
}
.stats{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
gap:14px;
margin-bottom:18px;
}
.card{
background:#171a21;
padding:18px;
border-radius:16px;
box-shadow:0 6px 14px rgba(0,0,0,.25);
}
.card h3{
font-size:14px;
color:#9aa4b2;
margin-bottom:10px;
font-weight:normal;
}
.card .num{
font-size:30px;
font-weight:bold;
color:#00e676;
}
.menu{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:14px;
margin-top:8px;
}
.btn{
background:#1b2030;
padding:22px;
border-radius:18px;
text-align:center;
font-size:18px;
font-weight:bold;
text-decoration:none;
color:#fff;
border:1px solid rgba(255,255,255,.05);
transition:.2s;
display:block;
}
.btn:hover{
transform:translateY(-2px);
background:#00c853;
color:#000;
}
.panel{
margin-top:18px;
background:#171a21;
padding:18px;
border-radius:16px;
}
.panel h2{
font-size:20px;
margin-bottom:12px;
color:#00e676;
}
.list{
display:grid;
gap:10px;
}
.item{
padding:12px;
background:#0f131b;
border-radius:12px;
display:flex;
justify-content:space-between;
gap:10px;
font-size:14px;
}
.tag{
padding:4px 10px;
border-radius:999px;
font-size:12px;
font-weight:bold;
}
.wait{background:#ff9800;color:#000}
.work{background:#03a9f4;color:#000}
.done{background:#00e676;color:#000}
footer{
text-align:center;
padding:24px;
color:#8d97a6;
font-size:13px;
}
@media(max-width:600px){
header h1{font-size:22px}
.card .num{font-size:26px}
.btn{font-size:16px;padding:18px}
}
</style>
</head>
<body>
<button onclick="saveJob()">บันทึกรถเข้า</button>
<button onclick="loadJobs()">ดูข้อมูล</button>
<header>
<h1>NISA AUTO CAR SERVICE</h1>
<p>ระบบอู่ครบวงจร • รับรถ • งานซ่อม • รายรับ • ลูกค้า</p>
</header>

<div class="wrap">

<section class="stats">
<div class="card">
<h3>รถเข้าใหม่วันนี้</h3>
<div class="num">6</div>
</div>

<div class="card">
<h3>กำลังซ่อม</h3>
<div class="num">3</div>
</div>

<div class="card">
<h3>งานเสร็จแล้ว</h3>
<div class="num">4</div>
</div>

<div class="card">
<h3>รายได้วันนี้</h3>
<div class="num">฿18,500</div>
</div>
</section>

<section class="menu">
<a href="#" class="btn">📥 รับรถเข้า</a>
<a href="#" class="btn">🔧 งานซ่อม</a>
<a href="#" class="btn">👤 ลูกค้าเก่า</a>
<a href="#" class="btn">💰 รายรับ</a>
<a href="#" class="btn">📦 สต๊อกสินค้า</a>
<a href="#" class="btn">📞 ติดต่อร้าน</a>
</section>

<section class="panel">
<h2>งานล่าสุดวันนี้</h2>
<div class="list">

<div class="item">
<span>โตโยต้า วีโก้ • เปลี่ยนน้ำมันเครื่อง</span>
<span class="tag done">เสร็จแล้ว</span>
</div>

<div class="item">
<span>ฮอนด้า ซิตี้ • เปลี่ยนแบตเตอรี่</span>
<span class="tag work">กำลังทำ</span>
</div>

<div class="item">
<span>อีซูซุ ดีแม็กซ์ • เช็คเบรก</span>
<span class="tag wait">รอคิว</span>
</div>

</div>
</section>

</div>

<footer>
NISA AUTO CAR SERVICE © 2026
</footer>

</body>
</html>
