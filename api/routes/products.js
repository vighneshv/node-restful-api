const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ) {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', productController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), productController.products_create_product);

router.get('/:productId', productController.products_get_product);

router.patch('/:productId', checkAuth, productController.products_edit_product);

router.delete('/:productId', checkAuth, productController.products_delete_product);

module.exports = router;