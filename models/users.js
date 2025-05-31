// module.exports.createUser = (db, userData, callback) => {
//     const sql = `
//       INSERT INTO users (
//        role, email, password
//       ) 
//       VALUES (?, ?, ?)
//     `;
//     const values = [
//      userData.role, 
//      userData.email,
//      userData.password
//     ];
  
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         return callback(err, null);
//       }
//       callback(null, result);
//     });
//   };
  
  module.exports.getUser = (db, callback) => {
    const sql = `SELECT * FROM users `;
    db.query(sql, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      callback(null, results);
    });
  };
  
  module.exports.getUserById = (db, id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      callback(null, results[0]);
    });
  };
  
  module.exports.getUserByUsername = (db, username, callback) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.query(sql, [username], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null);
      }
      callback(null, results[0]);
    });
  };
  
  module.exports.updateUser = (db, id, userData, callback) => {
    const sql = `UPDATE users SET username = ?, password = ?, img_profile = ? WHERE id = ?`;
    const values = [
      userData.username,
      userData.password,
      userData.img_profile,
      id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  };
  

  module.exports.deleteUser = (db, id, callback) => {
    const sql = `DELETE FROM users WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


  