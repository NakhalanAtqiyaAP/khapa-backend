module.exports.createGoal = (db, goalData, callback) => {
    const sql = `
      INSERT INTO goal (
     date, text, user_id
      ) 
      VALUES (?, ?, ?)
    `;
    const values = [
     goalData.date,
     goalData.img,
     goalData.user_id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  };
  
module.exports.getGoal = (db, callback) => {
    const sql = `SELECT * FROM goal `;
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
  
  module.exports.getGoalById = (db, id, callback) => {
    const sql = `SELECT * FROM goal WHERE id = ?`;
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
  
  module.exports.updateGoal = (db, id, goalData, callback) => {
    const sql = `UPDATE goal SET date = ?, img = ?, user_id = ?, WHERE id = ?`;
    const values = [
      goalData.date,
      goalData.img,
      goalData.user_id,
      id
    ];
  
    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  };
  

  module.exports.deleteGoal = (db, id, callback) => {
    const sql = `DELETE FROM goal WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};


  