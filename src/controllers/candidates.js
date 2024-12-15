const { default: mongoose } = require("mongoose");
const { sendResponse } = require("../helpers/handleResponse");
const Candidate = require("../models/candidates");
const { formatDate } = require("../helpers/formatDate");
const users = require("../models/users");

const addCandidate = async (req, res) => {
    try {
        const user = req["AuthenticateUser"]
        if (user.role != "admin") {
            return sendResponse(res, 400, false, "user has not admin role")
        }
        const newCandidate = await Candidate.create(req.body);
        return sendResponse(res, 200, true, "candidate added succesfully");
    } catch (error) {
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }

}

const updateCandidate = async (req, res) => {
    try {
        const user = req["AuthenticateUser"]
        if (user.role != "admin") {
            return sendResponse(res, 400, false, "user has not admin role")
        }
        const checkCandidate = await Candidate.findByIdAndUpdate(req.params.candidateId, req.body);
        if (!checkCandidate) {
            return sendResponse(res, 400, false, "candidate not found");
        }
        return sendResponse(res, 200, true, "candidate updated succesfully");
    } catch (error) {
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }

}

const deleteCandidate = async (req, res) => {
    try {
        const user = req["AuthenticateUser"]
        if (user.role != "admin") {
            return sendResponse(res, 400, false, "user has not admin role")
        }
        const checkCandidate = await Candidate.findByIdAndDelete(req.params.candidateId);
        if (!checkCandidate) {
            return sendResponse(res, 400, false, "candidate not found");
        }
        return sendResponse(res, 200, true, "candidate deleted succesfully");
    } catch (error) {
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }

}

const vote = async (req, res) => {
    try {
        const user = req["AuthenticateUser"];
        const candidateId = req.params.candidateId
        if (!candidateId) {
            return sendResponse(res, 400, false, "candidate id required")
        }
        if (user.role == "admin") {
            return sendResponse(res, 400, false, "admin can not vote")
        }
        const checkUser = await users.findById(user._id);
        if (checkUser.isVoted == true) {
            return sendResponse(res, 400, false, "user already voted");
        }
        const checkCandidate = await Candidate.findById(req.params.candidateId)
        if (!checkCandidate) {
            return sendResponse(res, 400, false, "candidate not found");
        }

        await Candidate.findByIdAndUpdate(candidateId, { $push: { votes: { userId: user._id } } });
        checkCandidate.voteCount++;
        checkUser.isVoted = true
        await checkUser.save()
        await checkCandidate.save()

        console.log('checkCandidate', checkCandidate)

        return sendResponse(res, 200, true, "vote saved succesfully");
    } catch (error) {
        console.log('error', error)
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }

}

const voteCount = async (req, res) => {
    try {
        const allCandidates = await Candidate.find().sort({ voteCount: "desc" });
        const voteCountData = allCandidates.map((data) => {
            return {
                party: data.party,
                voteCount: data.voteCount
            }
        })
        sendResponse(res, 200, true, "vote count data found", voteCountData)
    } catch (error) {
        console.log('error', error)
        if (error.name === "ValidationError") {
            return sendResponse(res, 400, false, error.message);
        }
        sendResponse(res, 500, false, "Internal server error.");
    }
}

module.exports = { addCandidate, updateCandidate, deleteCandidate, vote, voteCount }