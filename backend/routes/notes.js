const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    obj = {
        name: "Piya",
        number: 881528868
    };
    res.json(obj);
});

module.exports = router;