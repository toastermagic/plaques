'use strict';

var express = require('express');
var controller = require('./plaque.controller');

var router = express.Router();

router.get('/search/:searchTerm', controller.search);
router.get('/show/:plaqueId', controller.show);
router.get('/list', controller.get);
router.get('/tags', controller.tags);

module.exports = router;