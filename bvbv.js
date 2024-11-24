document.getElementById('readingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/api/readings', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => alert(data.message));
});

document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/api/data', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => alert(data.message));
});
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد قاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username', // استبدل باسم المستخدم الخاص بك
    password: 'your_password', // استبدل بكلمة المرور الخاصة بك
    database: 'your_database' // استبدل باسم قاعدة البيانات الخاصة بك
});

// الاتصال بقاعدة البيانات
db.connect(err => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err);
        return;
    }
    console.log('تم الاتصال بقاعدة البيانات بنجاح');
});

// إعداد CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// نقطة النهاية لتسجيل القراءات
app.post('/api/readings', (req, res) => {
    const { name, stage, country, chapter, gospel } = req.body;
    const query = 'INSERT INTO readings (name, stage, country, chapter, gospel) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, stage, country, chapter, gospel], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل القراءة' });
        }
        res.status(200).json({ message: 'تم تسجيل القراءة بنجاح' });
    });
});

// نقطة النهاية لتسجيل بيانات المخدوم
app.post('/api/data', (req, res) => {
    const { name, country, phone, stage, confessor, birthDate } = req.body;
    const query = 'INSERT INTO data (name, country, phone, stage, confessor, birthDate) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, country, phone, stage, confessor, birthDate], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل البيانات' });
        }
        res.status(200).json({ message: 'تم تسجيل البيانات بنجاح' });
    });
});

// بدء تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على http://localhost:${PORT}`);
});