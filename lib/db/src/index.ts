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
font-size:28px;
font-weight:bold;
}

.wrap{
padding:15px;
}

.box{
background:#111827;
padding:15px;
border-radius:15px;
margin-bottom:15px;
}

input,button{
width:100%;
padding:12px;
margin:5px 0;
border:none;
border-radius:10px;
font-size:16px;
}

input{
background:#1f2937;
color:white;
}

button{
background:#00c853;
color:white;
font-weight:bold;
}

.card{
background:#0f172a;
padding:12px;
margin-top:10px;
border-radius:12px;
}

.red{background:#ff5252;}
.blue{background:#2196f3;}
.orange{background:#ff9800;}
</style>
</head>
<body>

<header>NISA AUTO CAR SERVICE</header>

<div class="wrap">

<div class="box">
<h2>รับรถเข้า</h2>

<input id="name" placeholder="ชื่อลูกค้า">
<input id="car" placeholder="รุ่นรถ">
<input id="plate" placeholder="ทะเบียน">
<input id="phone" placeholder="เบอร์โทร">

<button onclick="saveCustomer()">บันทึกเข้าระบบ</button>
</div>

<div class="box">
<h2>ลูกค้าทั้งหมด</h2>
<div id="list"></div>
</div>

</div>

<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const car = document.getElementById("car").value;
const plate = document.getElementById("plate").value;
const phone = document.getElementById("phone").value;

await addDoc(collection(db,"customers"),{
name,
car,
plate,
phone,
status:"รับรถใหม่",
time:new Date()
});

alert("บันทึกแล้ว");

loadData();
}

async function loadData(){

const querySnapshot = await getDocs(collection(db,"customers"));

let html="";

querySnapshot.forEach((docSnap)=>{

const d = docSnap.data();

html += `
<div class="card">
<b>${d.name}</b><br>
🚗 ${d.car}<br>
📌 ${d.plate}<br>
📞 ${d.phone}<br><br>

<button class="red" onclick="del('${docSnap.id}')">ลบ</button>
</div>
`;

});

document.getElementById("list").innerHTML = html;
}

window.del = async function(id){
await deleteDoc(doc(db,"customers",id));
loadData();
}

loadData();

</script>
</body>
</html>
