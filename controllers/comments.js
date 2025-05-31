const commentModel = require('../models/comments');
const { body, validationResult } = require('express-validator');

exports.createComment = [
  body('article_id').notEmpty().withMessage('article_id Tidak Boleh Kosong'),
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

    const commentData = {
      article_id: req.body.article_id,
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

      commentModel.createComment(db, commentData, (err, result) => {
        if (err) {
          return res.status(500).json({
            rc: '99',
            success: false,
            msg: 'Terjadi Kesalahan Saat Menyimpan Data'
          });
        }

        commentModel.getCommentById(db, result.insertId, (err, newComment) => {
          if (err) {
            return res.status(500).json({
              rc: '99',
              success: false,
              msg: 'Data berhasil disimpan tetapi gagal mengambil detail'
            });
          }

          res.json({
            rc: '00',
            success: true,
            msg: 'Komentar Berhasil Disimpan!',
            data: newComment
          });
        });
      });
    });
  }
];

exports.getCommentsByArticle = (req, res) => {
  const { article_id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    commentModel.getCommentsByArticle(db, article_id, (err, results) => {
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
        data: results
      });
    });
  });
};

exports.getCommentById = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    commentModel.getCommentById(db, id, (err, result) => {
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

exports.deleteComment = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi Kesalahan Saat Menghubungkan ke Database'
      });
    }

    commentModel.deleteComment(db, id, (err, result) => {
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
        msg: 'Komentar Berhasil Dihapus!'
      });
    });
  });
};

exports.updateComment = [
  body('text').notEmpty().withMessage('Text Tidak Boleh Kosong'),

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

    const commentData = {
      text: req.body.text
    };

    req.getConnection((err, db) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Gagal menghubungkan ke database'
        });
      }

      commentModel.getCommentById(db, id, (err, existingComment) => {
        if (err || !existingComment) {
          return res.status(404).json({
            rc: '44',
            success: false,
            msg: 'Komentar tidak ditemukan'
          });
        }

        commentModel.updateComment(db, id, commentData, (err, result) => {
          if (err) {
            return res.status(500).json({
              rc: '99',
              success: false,
              msg: 'Gagal memperbarui komentar'
            });
          }
          commentModel.getCommentById(db, id, (err, updatedComment) => {
            if (err) {
              return res.status(500).json({
                rc: '99',
                success: false,
                msg: 'Komentar berhasil diperbarui tetapi gagal mengambil detail'
              });
            }

            res.json({
              rc: '00',
              success: true,
              msg: 'Komentar berhasil diperbarui',
              data: updatedComment
            });
          });
        });
      });
    });
  }
];