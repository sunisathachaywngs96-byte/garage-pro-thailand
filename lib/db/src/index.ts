<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NISA AUTO CAR SERVICE</title>

<style>
body{
margin:0;
font-family:Arial;
background:#081018;
color:white;
}
header{
background:#00c853;
padding:20px;
text-align:center;
font-size:30px;
font-weight:bold;
}
.wrap{
padding:20px;
max-width:1200px;
margin:auto;
}
.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:15px;
margin-bottom:20px;
}
.card{
background:#111a2e;
padding:20px;
border-radius:14px;
}
button{
width:100%;
padding:16px;
border:none;
border-radius:12px;
background:#00c853;
font-size:20px;
font-weight:bold;
cursor:pointer;
}
input{
width:100%;
padding:12px;
margin:6px 0;
border-radius:8px;
border:none;
}
.list{
background:#111a2e;
padding:20px;
border-radius:14px;
margin-top:20px;
}
.item{
padding:10px;
border-bottom:1px solid #222;
}
</style>
</head>

<body>

<header>NISA AUTO CAR SERVICE</header>

<div class="wrap">

<div class="grid">
<div class="card">
<h2>รับรถเข้าใหม่</h2>
<input id="name" placeholder="ชื่อลูกค้า">
<input id="phone" placeholder="เบอร์โทร">
<input id="car" placeholder="รถรุ่น">
<input id="plate" placeholder="ทะเบียน">
<button onclick="saveCustomer()">บันทึกลูกค้า</button>
</div>

<div class="card">
<h2>สถิติวันนี้</h2>
<p id="count">ลูกค้า: 0</p>
</div>
</div>

<div class="list">
<h2>รายชื่อลูกค้าจริง</h2>
<div id="customerList"></div>
</div>

</div>

<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDAfm7eDJPFiWrUK_U0aqS7yl2Wt_PpjmA",
authDomain: "garage-system-41587.firebaseapp.com",
projectId: "garage-system-41587",
storageBucket: "garage-system-41587.firebasestorage.app",
messagingSenderId: "688480145767",
appId: "1:688480145767:web:f457e635675df0cbd91fc2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.saveCustomer = async function(){

const name = document.getElementById("name").value;
const phone = document.getElementById("phone").value;
const car = document.getElementById("car").value;
const plate = document.getElementById("plate").value;

await addDoc(collection(db,"customers"),{
name,
phone,
car,
plate,
time:new Date().toLocaleString()
});

alert("บันทึกสำเร็จ");
loadCustomers();
}

async function loadCustomers(){

const box = document.getElementById("customerList");
box.innerHTML = "";

const querySnapshot = await getDocs(collection(db,"customers"));

let total = 0;

querySnapshot.forEach((doc)=>{
total++;

const data = doc.data();

box.innerHTML += `
<div class="item">
${data.name} | ${data.phone} | ${data.car} | ${data.plate}
</div>
`;
});

document.getElementById("count").innerText="ลูกค้า: "+total;
}

loadCustomers();

</script>

</body>
</html>
