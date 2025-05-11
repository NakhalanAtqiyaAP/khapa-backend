module.exports.createArticle = (db, articleData, callback) => {
    const sql = `
      INSERT INTO articles (
       judul, text, user_id
      ) 
      VALUES (?, ?, ?)
    `;
    const values = [
     articleData.judul, 
     articleData.text,
     articleData.user_id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  };
  
module.exports.getArticle = (db, callback) => {
    const sql = `SELECT * FROM articles `;
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
  
  module.exports.getArticleById = (db, id, callback) => {
    const sql = `SELECT * FROM articles WHERE id = ?`;
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
  
  module.exports.updateArticle = (db, id, articleData, callback) => {
    const sql = `UPDATE articles SET judul = ?, text = ?, user_id = ? WHERE id = ?`;
    const values = [
      articleData.judul,
      articleData.text,
      articleData.user_id,
      id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  };
  

  module.exports.deleteArticle = (db, id, callback) => {
    const sql = `DELETE FROM articles WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


  