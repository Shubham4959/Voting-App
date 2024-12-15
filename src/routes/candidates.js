const express = require("express");
const { addCandidate, updateCandidate, vote, deleteCandidate, voteCount } = require("../controllers/candidates");
const router = express.Router();
const auth = require("../middlewares/auth").isValidToken;


router.post("/", auth, addCandidate);

router.put("/:candidateId", auth, updateCandidate);

router.delete("/:candidateId", auth, deleteCandidate);

router.post("/vote/:candidateId", auth, vote);

router.get("/vote/count", voteCount);



module.exports = router