const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
  host: 'localhost',     // ganti sesuai konfigurasi
  user: 'root',
  password: 'BakaDesu511',          // isi jika ada
  database: 'khapa_db' // ganti sesuai nama database
});

const users = [
  { username: 'khalan_keren', password: 'khalan123' },
  { username: 'epaxlaufey', password: 'epa123' }
];

connection.connect(async (err) => {
  if (err) throw err;
  console.log('Terhubung ke database.');

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    connection.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, user.username],
      (err, result) => {
        if (err) {
          console.error(`Gagal update ${user.username}:`, err);
        } else {
          console.log(`Password untuk ${user.username} berhasil di-hash dan diperbarui.`);
        }
      }
    );
  }

  setTimeout(() => {
    connection.end();
    console.log('Koneksi ditutup.');
  }, 2000);
});
