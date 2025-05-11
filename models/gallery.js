module.exports.createGallery = (db, galleryData, callback) => {
    const sql = `
      INSERT INTO gallery (
     text, img, user_id
      ) 
      VALUES (?, ?, ?)
    `;
    const values = [
     galleryData.text,
     galleryData.img,
     galleryData.user_id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  };
  
module.exports.getGallery = (db, callback) => {
    const sql = `SELECT * FROM gallery `;
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
  
  module.exports.getGalleryById = (db, id, callback) => {
    const sql = `SELECT * FROM gallery WHERE id = ?`;
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
  
  module.exports.updateGallery = (db, id, galleryData, callback) => {
    const sql = `UPDATE gallery SET text = ?, img = ?, user_id = ?, WHERE id = ?`;
    const values = [
      galleryData.text,
      galleryData.img,
      galleryData.user_id,
      id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  };
  

  module.exports.deleteGallery = (db, id, callback) => {
    const sql = `DELETE FROM gallery WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


  