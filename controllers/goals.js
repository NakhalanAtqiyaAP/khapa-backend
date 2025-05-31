const goalModel = require('../models/goals');
const { body, validationResult } = require('express-validator');

exports.createGoal = [
  body('date').notEmpty().withMessage('date Tidak Boleh Kosong'),
  body('text').notEmpty().withMessage('Text Tidak Boleh Kosong'),
  body('user_id').notEmpty().withMessage('user_id Tidak Boleh Kosong'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        rc: '43',
        success: false,
        msg: errors.array()[0].msg
      });
    }

    const goalData = {
      date: req.body.date,
      text: req.body.text,
      user_id: req.body.user_id
    };

    req.getConnection((err, db) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
        });
      }

      goalModel.createGoal(db, goalData, (err, result) => {
        if (err) {
          return res.status(500).json({
            rc: '99',
            success: false,
            msg: 'Terjadi Kesalahan Saat Menyimpan Data'
          });
        }

        res.json({
            rc: '00',
            success: true,
            msg: 'Data goal Berhasil Disimpan!',
            data: {
              id: result.insertId,
              ...goalData
            }
          });
        });
    });
  }
];
exports.getGoalById = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    goalModel.getGoalById(db, id, (err, result) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi Kesalahan Saat Mengambil Data'
        });
      }

      if (!result) {
        return res.status(404).json({
          rc: '44',
          success: false,
          msg: 'Data Tidak Ditemukan'
        });
      }

      res.json({
        rc: '00',
        success: true,
        data: result
      });
    });
  });
};

exports.getGoal = (req, res) => {
  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    goalModel.getGoal(db, (err, result) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi Kesalahan Saat Mengambil Data'
        });
      }

      res.json({
        rc: '00',
        success: true,
        data: result
      });
    });
  });
};

exports.deleteGoal = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    goalModel.deleteGoal(db, id, (err, result) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi Kesalahan Saat Menghapus Data'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          rc: '44',
          success: false,
          msg: 'Data Tidak Ditemukan'
        });
      }

      res.json({
        rc: '00',
        success: true,
        msg: 'Data Pengaitan Provinsi dan User Berhasil Dihapus!'
      });
    });
  });
};

exports.updateGoal = [
    body('date').optional(),
    body('text').optional(),
    body('user_id').optional(),

    (req, res) => {
      const { id } = req.params;
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          rc: '43',
          success: false,
          msg: errors.array()[0].msg
        });
      }
  
      const goalData = {
        date: req.body.date,
        text: req.body.text,
        user_id: req.body.user_id
      };
  
      req.getConnection((err, db) => {
        if (err) {
          return res.status(500).json({
            rc: '99',
            success: false,
            msg: 'Gagal menghubungkan ke database'
          });
        }
  
        goalModel.getGoalById(db, id, (err, result) => {
          if (err || !result) {
            return res.status(404).json({
              rc: '44',
              success: false,
              msg: 'Staff Province tidak ditemukan'
            });
          }
  
          goalModel.updateGoal(db, id, goalData , (err, result) => {
            if (err) {
              return res.status(500).json({
                rc: '99',
                success: false,
                msg: 'Gagal memperbarui komentar'
              });
            }
  
            res.json({
              rc: '00',
              success: true,
              msg: 'goal berhasil diperbarui',
              data: result
            });
          });
        });
      });
    }
  ];
  