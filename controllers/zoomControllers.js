const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");

dotenv.config();

const KJUR = require("jsrsasign");

const { createZoomMeeting, listZoomMeetings, getMeetingDetail } = require("../api/zoomApi.js");


const getMdkSignature = asyncHandler(async (req, res) => {
    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: "HS256", typ: "JWT" };

    const oPayload = {
        sdkKey: process.env.ZOOM_MSDK_KEY,
        mn: req.body.meetingNumber,
        role: req.body.role,
        iat: iat,
        exp: exp,
        tokenExp: iat + 60 * 60 * 2,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const signature = KJUR.jws.JWS.sign(
        "HS256",
        sHeader,
        sPayload,
        process.env.ZOOM_MSDK_SECRET
    );

    res.json({
        signature: signature,
    })
});

const CreateMeeting = asyncHandler(async (req, res) => {
    const meetingDetails = { ...req.body };

    const { id, password } = await createZoomMeeting(meetingDetails);

    res.status(201).json({ id, password });
})

const ListMeeting = asyncHandler(async (req, res) => {
    const meetings = await listZoomMeetings();
    if (meetings === undefined) {
        res.status(400).send({ msg: "No meeting found" });
    } else {
        res.status(201).json({ meetings });
    }
})

const GetMeetingPassword = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const response = await getMeetingDetail(id);

    res.send({ msg: "id received", meeting: response });
})

module.exports = {
    getMdkSignature,
    CreateMeeting,
    ListMeeting,
    GetMeetingPassword,
}