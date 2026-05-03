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
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:15px;
}
.card{
background:#111827;
padding:20px;
border-radius:14px;
font-size:22px;
}
h2{
color:#00e676;
padding:20px;
}
.list{
padding:20px;
}
.job{
background:#111827;
margin-bottom:10px;
padding:15px;
border-radius:10px;
}
</style>
</head>
<body>

<header>NISA AUTO CAR SERVICE</header>

<div class="wrap">
<div class="card">ลูกค้า <br><span id="customer">0</span></div>
<div class="card">งานซ่อม <br><span id="jobs">0</span></div>
<div class="card">รายรับ <br>฿<span id="money">0</span></div>
</div>

<h2>งานล่าสุด</h2>
<div class="list" id="jobList"></div>

<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDAfm7eDJPFiWrUK_U0aqS7yl2Wt_PpjmA",
authDomain: "garage-system-41587.firebaseapp.com",
projectId: "garage-system-41587",
storageBucket: "garage-system-41587.appspot.com",
messagingSenderId: "688480145767",
appId: "1:688480145767:web:f457e635675df0cbd91fc2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadData(){

const customers = await getDocs(collection(db,"customers"));
document.getElementById("customer").innerText = customers.size;

const jobs = await getDocs(collection(db,"jobs"));
document.getElementById("jobs").innerText = jobs.size;

let html="";
jobs.forEach(doc=>{
const d = doc.data();
html += `<div class="job">${d.car || "-"} • ${d.job || "-"}</div>`;
});
document.getElementById("jobList").innerHTML = html;

const money = await getDocs(collection(db,"money"));
let total = 0;
money.forEach(doc=>{
total += Number(doc.data().amount || 0);
});
document.getElementById("money").innerText = total.toLocaleString();

}

loadData();

</script>
</body>
</html>
