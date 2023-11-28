const express = require("express");
const { getMdkSignature, CreateMeeting, ListMeeting, GetMeetingPassword } = require("../controllers/zoomControllers");

const router = express.Router();

router.post("/msignature", getMdkSignature);
router.post("/create", CreateMeeting);
router.get("/listmeetings", ListMeeting);
router.get("/getmeeting/:id", GetMeetingPassword);

module.exports = router;