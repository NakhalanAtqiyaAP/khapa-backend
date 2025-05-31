const { body, validationResult } = require('express-validator');
const galleryModel = require('../models/gallery');
const upload = require('../multerConfig');

exports.createGallery = [
  upload.single('gallery'),
  body('text').notEmpty().withMessage('Text tidak boleh kosong'),
  body('user_id').notEmpty().withMessage('User ID tidak boleh kosong'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        rc: '43',
        success: false,
        msg: errors.array()[0].msg
      });
    }

    if (!req.file) {
      return res.status(400).json({
        rc: '43',
        success: false,
        msg: 'Gambar tidak boleh kosong'
      });
    }

    const galleryData = {
      text: req.body.text,
      img: req.file.filename,
      user_id: req.body.user_id
    };

    req.getConnection((err, db) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi kesalahan saat menghubungkan ke database'
        });
      }

      galleryModel.createGallery(db, galleryData, (err, result) => {
        if (err) {
          console.error('Database Error: ', err);
          return res.status(500).json({
            rc: '99',
            success: false,
            msg: 'Gagal menyimpan data gallery'
          });
        }

        res.json({
          rc: '00',
          success: true,
          msg: 'Gallery berhasil disimpan!'
        });
      });
    });
  }
];

exports.getGalleries = (req, res) => {
  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi kesalahan saat menghubungkan ke database'
      });
    }

    galleryModel.getGallery(db, (err, result) => {
      if (err) {
        console.error('Database Error: ', err);
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Gagal mengambil data gallery'
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

exports.getGalleryById = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi kesalahan saat menghubungkan ke database'
      });
    }

    galleryModel.getGalleryById(db, id, (err, result) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi kesalahan saat mengambil data gallery'
        });
      }

      if (!result) {
        return res.status(404).json({
          rc: '44',
          success: false,
          msg: 'Data gallery tidak ditemukan'
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

exports.updateGallery = [
  upload.single('img'),
  body('text').optional(),
  body('user_id').optional(),

  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        rc: '43',
        success: false,
        msg: errors.array()[0].msg
      });
    }

    const galleryData = {
      text: req.body.text,
      user_id: req.body.user_id
    };

    if (req.file) {
      galleryData.img = req.file.filename;
    }

    req.getConnection((err, db) => {
      if (err) {
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Terjadi kesalahan saat menghubungkan ke database'
        });
      }

      galleryModel.updateGallery(db, id, galleryData, (err, result) => {
        if (err) {
          console.error('Database Error: ', err);
          return res.status(500).json({
            rc: '99',
            success: false,
            msg: 'Gagal memperbarui data gallery'
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            rc: '44',
            success: false,
            msg: 'Data gallery tidak ditemukan'
          });
        }

        res.json({
          rc: '00',
          success: true,
          msg: 'Data gallery berhasil diperbarui'
        });
      });
    });
  }
];

exports.deleteGallery = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, db) => {
    if (err) {
      return res.status(500).json({
        rc: '99',
        success: false,
        msg: 'Terjadi kesalahan saat menghubungkan ke database'
      });
    }

    galleryModel.deleteGallery(db, id, (err, result) => {
      if (err) {
        console.error('Database Error: ', err);
        return res.status(500).json({
          rc: '99',
          success: false,
          msg: 'Gagal menghapus data gallery'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          rc: '44',
          success: false,
          msg: 'Data gallery tidak ditemukan'
        });
      }

      res.json({
        rc: '00',
        success: true,
        msg: 'Data gallery berhasil dihapus'
      });
    });
  });
};

// exports.filterGalleries = (req, res) => {
//   const { user_id } = req.query;

//   req.getConnection((err, db) => {
//     if (err) {
//       return res.status(500).json({
//         rc: '99',
//         success: false,
//         msg: 'Terjadi kesalahan saat menghubungkan ke database'
//       });
//     }

//     galleryModel.filterGalleries(db, { user_id }, (err, result) => {
//       if (err) {
//         return res.status(500).json({
//           rc: '99',
//           success: false,
//           msg: 'Gagal memfilter data gallery'
//         });
//       }

//       if (!result || result.length === 0) {
//         return res.status(404).json({
//           rc: '44',
//           success: false,
//           msg: 'Data gallery tidak ditemukan'
//         });
//       }

//       res.json({
//         rc: '00',
//         success: true,
//         data: result
//       });
//     });
//   });
// };