const express = require('express');
const router = express.Router();
const word = require('../controllers/word-controller');

router.post('/api/words', word.postWord); // curl -X POST http://localhost:8080/api/words -H 'Content-Type: application/json' -d '{"word":"brush","category":["action","test"]}'
router.get('/api/words', word.getAllWords);
router.get('/api/words/:id', word.getWord);
// router.patch('/api/words/:id', word.updateWord);
router.delete('/api/words/:id', word.deleteWord);

// TODO: move this to scripts
router.get('/api/dev/words/definition', word.getWordsWithoutDefinitions);
router.get('/api/dev/words/oldDefinition', word.getWordsWithOldDefinition);
router.get('/api/dev/words/noCategory', word.getWordsWithNoCategory);

router.get('/liveops/ping', (req, res, next) => {
	res.status(200).send('pong\n');
})

module.exports = router;