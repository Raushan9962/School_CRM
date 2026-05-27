const express = require('express');
const router = express.Router();
const hostelRoomController = require('../controllers/hostelRoomController');

router.post('/', hostelRoomController.createHostelRoom);
router.get('/', hostelRoomController.getAllHostelRooms);
router.get('/:id', hostelRoomController.getHostelRoomById);
router.put('/:id', hostelRoomController.updateHostelRoom);
router.delete('/:id', hostelRoomController.deleteHostelRoom);

module.exports = router;
