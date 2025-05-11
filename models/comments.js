module.exports.createComment = (db, commentData, callback) => {
    const sql = `INSERT INTO comments (article_id, gallery_id, text, user_id) VALUES(?,?,?,?)`;
    const values = [
      commentData.article_id,
      commentData.gallery_id,
      commentData.text,
      commentData.user_id,
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  };
  
module.exports.getComment = (db, callback) => {
    const sql = `SELECT * FROM comments`;
    db.query(sql, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  };
  
  module.exports.updateComment = (db, id, commentData, callback) => {
    const sql = `UPDATE comments SET article_id = ?, gallery_id = ?, text = ?, user_id = ? WHERE id = ?`;
    const values = [
        commentData.article_id,
        commentData.gallery_id,
        commentData.text,
        commentData.user_id,
        id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  };
  exports.getCommentById = (db, id, callback) => {
    const sql = 'SELECT * FROM comments WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (result.length === 0) {
        return callback(null, null);
      }
      callback(null, result[0]);
    });
  };
  module.exports.deleteComment = (db, id, callback) => {
    const sql = `DELETE FROM comments WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


// exports.getCommentsWithUser = (db, report_id, callback) => {
//   const query = `
//     SELECT c.*, u.email as user_email 
//     FROM comments c
//     JOIN users u ON c.user_id = u.id
//     WHERE c.report_id = ?
//     ORDER BY c.created_at DESC
//   `;
//   db.query(query, [report_id], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results);
//   });
// };

// exports.createCommentWithUser = (db, commentData, callback) => {
//   const insertQuery = `
//     INSERT INTO comments (report_id, comment, user_id) 
//     VALUES (?, ?, ?)
//   `;

//   db.query(insertQuery, [commentData.report_id, commentData.comment, commentData.user_id], (err, insertResult) => {
//     if (err) return callback(err);

//     const selectQuery = `
//       SELECT c.*, u.email as user_email 
//       FROM comments c
//       JOIN users u ON c.user_id = u.id
//       WHERE c.id = ?
//     `;

//     const insertedId = insertResult.insertId;

//     db.query(selectQuery, [insertedId], (err, selectResult) => {
//       if (err) return callback(err);
//       callback(null, selectResult[0]);
//     });
//   });
// };
