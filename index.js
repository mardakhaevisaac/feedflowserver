const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 1923
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./data.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

let sql;
let date = new Date();
let posts = {}
let id = 0;

// sql = 'CREATE TABLE IF NOT EXISTS "posts" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "username" TEXT NOT NULL, "content" TEXT NOT NULL, "date" TEXT NOT NULL)';
// db.run(sql);

app.use(cors());
app.use(express.json());

app.post('/newPost', (req, res) => {
    if (req.method !== 'POST')
        return;

    const { username, content } = req.body;

    posts[id] = { username, content, date: new Date() }; // Обновлено

    sql = 'INSERT INTO posts(username, content, date) VALUES (?, ?, ?)'; // Обновлено
    db.run(sql, [username, content, new Date().toISOString()], (err) => { // Обновлено
        if (err) return console.error(err.message);
    });

    id += 1;

    return res.status(200).json( { message: 'Alright' } );
});

app.get('/getPosts', (req, res) => {
    if (req.method !== 'GET') 
        return;

    sql = 'SELECT * FROM posts';

    db.all(sql, [], (err, rows) => { // Заменено с db.run на db.all
        if (err) return console.error(err.message);
        const formattedPosts = {};
        rows.forEach((row) => {
            formattedPosts[row.id] = row;
        });
        return res.status(200).json(formattedPosts);
    });
});

app.listen(port, () => console.log(`Server runnin' on port: ${port}...`));