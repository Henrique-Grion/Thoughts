const express = require('express');
const router = express.Router()
const ThoughtController = require('../controllers/ThoughtController')

// helpers
const checkAuth = require('../helpers/auth.js').checkAuth

router.get('/add', checkAuth, ThoughtController.createThought)
router.post('/add', checkAuth, ThoughtController.createThoughtSave)

router.get('/dashboard', checkAuth, ThoughtController.dashboard)

router.get('/edit/:id', checkAuth, ThoughtController.editThought)
router.post('/edit', checkAuth, ThoughtController.editThoughtSave)

router.delete('/remove/:id', checkAuth, ThoughtController.removeThought)

router.get('/', ThoughtController.showThoughts)

module.exports = router;