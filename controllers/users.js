const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const userModel = require('../models/users');
const tokenBlacklist = require('../middleware/tokenOut');
const upload = require('../multerConfig');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

exports.getUser = (req, res) => {
  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    userModel.getUser(db, (err, user) => {
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
        data: user
      });
    });
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    userModel.getUserById(db, id, (err, result) => {
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

exports.loginUser = [
  body('username').notEmpty().withMessage('Username Tidak Boleh Kosong'),
  body('password').notEmpty().withMessage('Password Tidak Boleh Kosong'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        rc: '43',
        success: false,
        msg: errors.array()[0].msg
      });
    }

    const { username, password } = req.body;

    req.getConnection((err, db) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
        });
      }

      userModel.getUserByUsername(db, username, (err, user) => {
        if (err) {
          return res.status(500).json({
            rc: '99',
            success: false,
            msg: 'Terjadi Kesalahan Saat Mengambil Data Pengguna'
          });
        }

        if (!user) {
          return res.status(404).json({
            rc: '44',
            success: false,
            msg: 'User Tidak Ditemukan'
          });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return res.status(500).json({
              rc: '99',
              success: false,
              msg: 'Terjadi Kesalahan Saat Memeriksa Password'
            });
          }

          if (!isMatch) {
            console.error('SQL Error:', err);
            return res.status(400).json({
              rc: '44',
              success: false,
              msg: 'Username atau Password Salah'
            });
          }

          const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

          res.json({
            rc: '00',
            success: true,
            token,
            msg: 'Login Berhasil!',
            user: {
              id: user.id,
              username: user.username,
            }
          });
        });
      });
    });
  }
];

exports.updateUser = [
  upload.single('profile'), 
  body('username').optional(),
  body('password').optional(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        rc: '43',
        success: false,
        msg: errors.array()[0].msg
      });
    }

    const { id } = req.params;
    let { username, password } = req.body;
    let img_profile = req.file ? req.file.filename : undefined;

    req.getConnection((err, db) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
        });
      }

      userModel.getUserById(db, id, async (err, existingUser) => {
        if (err || !existingUser) {
          return res.status(404).json({
            rc: '44',
            success: false,
            msg: 'Data Tidak Ditemukan'
          });
        }

        const updatedUser = {
          username: username || existingUser.username,
          password: password ? await bcrypt.hash(password, 10) : existingUser.password,
          img_profile: img_profile || existingUser.img_profile,
        };

        userModel.updateUser(db, id, updatedUser, (err, result) => {
          if (err) {
            return res.status(500).json({
              rc: '99',
              success: false,
              msg: 'Terjadi Kesalahan Saat Memperbarui Data'
            });
          }

          res.json({
            rc: '00',
            success: true,
            msg: 'Data Berhasil Diperbarui!'
          });
        });
      });
    });
  }
];

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    userModel.deleteUser(db, id, (err, result) => {
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
        msg: 'Data Berhasil Dihapus!'
      });
    });
  });
};

exports.logoutUser = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    tokenBlacklist.addToken(token);
    res.json({
      rc: '00',
      success: true,
      msg: 'Logout Berhasil'
    });
  } else {
    res.status(400).json({
      rc: '43',
      success: false,
      msg: 'Token Tidak Ditemukan'
    });
  }
};