const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');

router.post('/', homeworkController.createHomework);
router.get('/', homeworkController.getAllHomeworks);
router.get('/:id', homeworkController.getHomeworkById);
router.put('/:id', homeworkController.updateHomework);
router.delete('/:id', homeworkController.deleteHomework);

module.exports = router;
