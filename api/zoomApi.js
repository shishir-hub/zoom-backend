const dotenv = require("dotenv");

dotenv.config();

const axios = require("axios");
const btoa = require("btoa");

const getToken = async () => {
    try {
        const base64 = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);

        const data = new URLSearchParams();
        data.append('grant_type', 'account_credentials');
        data.append('account_id', `${process.env.ACCOUNT_ID}`)


        const response = await axios.post(`https://zoom.us/oauth/token`, data, {
            headers: {
                "Authorization": `Basic ${base64}`,
            }
        })

        return response.data.access_token;

    } catch (error) {
        console.log("here error");
    }
}

const listZoomMeetings = async () => {
    try {
        const token = await getToken();
        const response = await axios.get(`https://api.zoom.us/v2/users/me/meetings`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        const meetings = response.data.meetings;
        return meetings;

    } catch (error) {
        console.log(error);
    }
}


const createZoomMeeting = async (meetingDetails) => {
    try {

        const token = await getToken();

        const data = JSON.stringify({
            topic: meetingDetails.topic,
            timezone: "(GMT+05:45) Kathmandu",
            start_time: meetingDetails.start_time,
            duration: meetingDetails.duration,
            type: meetingDetails.type,
        });

        const response = await axios.post("https://api.zoom.us/v2/users/me/meetings", data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const { id, password } = response.data;

        return {
            id: id,
            password: password,
        }
    } catch (error) {
        console.log(error);
    }
}

const getMeetingDetail = async (id) => {
    try {
        const token = await getToken();

        const response = await axios.get(`https://api.zoom.us/v2/meetings/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })


        return response.data;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createZoomMeeting,
    listZoomMeetings,
    getMeetingDetail,
}