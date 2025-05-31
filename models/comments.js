module.exports = {
  createComment: (db, commentData, callback) => {
    const sql = `INSERT INTO comments (article_id, text, user_id) VALUES(?,?,?)`;
    const values = [
      commentData.article_id,
      commentData.text,
      commentData.user_id,
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  
  getCommentsByArticle: (db, article_id, callback) => {
    const sql = `SELECT c.*, u.username as author 
                 FROM comments c
                 JOIN users u ON c.user_id = u.id
                 WHERE c.article_id = ?
                 ORDER BY c.created_at DESC`;
    db.query(sql, [article_id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },
  
  updateComment: (db, id, commentData, callback) => {
    const sql = `UPDATE comments SET text = ? WHERE id = ?`;
    const values = [
      commentData.text,
      id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  },
  
  getCommentById: (db, id, callback) => {
    const sql = 'SELECT c.*, u.username as author FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      if (result.length === 0) {
        return callback(null, null);
      }
      callback(null, result[0]);
    });
  },
  
  deleteComment: (db, id, callback) => {
    const sql = `DELETE FROM comments WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  }
};