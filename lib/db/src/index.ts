<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NISA AUTO CAR SERVICE</title>

<style>
body{
font-family:Arial;
background:#0a0f1c;
color:white;
margin:0;
padding:0;
}
header{
background:#00c853;
padding:20px;
text-align:center;
font-size:28px;
font-weight:bold;
}
.box{
padding:20px;
}
input,button{
padding:12px;
margin:5px;
border:none;
border-radius:8px;
}
input{
width:220px;
}
button{
background:#00c853;
color:white;
font-weight:bold;
}
.card{
background:#111827;
padding:15px;
margin-top:10px;
border-radius:12px;
}
</style>
</head>
<body>

<header>NISA AUTO CAR SERVICE</header>

<div class="box">

<h2>รับรถเข้า</h2>

<input id="car" placeholder="ทะเบียนรถ">
<input id="job" placeholder="งานซ่อม">
<button onclick="saveJob()">บันทึก</button>

<div id="list"></div>

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

window.saveJob = async function(){

const car = document.getElementById("car").value;
const job = document.getElementById("job").value;

await addDoc(collection(db,"jobs"),{
car,
job,
time:new Date()
});

loadData();
}

async function loadData(){

const snap = await getDocs(collection(db,"jobs"));

let html = "";

snap.forEach(doc=>{
let d = doc.data();
html += `<div class="card">${d.car} - ${d.job}</div>`;
});

document.getElementById("list").innerHTML = html;
}

loadData();

</script>
</body>
</html>
