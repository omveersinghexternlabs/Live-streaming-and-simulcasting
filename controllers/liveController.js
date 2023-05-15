const live = require('../utilities/live')

class liveController {
    static getlive = async (req, res) => {
        res.send("getting all live streams...");
    }

    static live = async (req, res, next) => {
        // res.send("post live method called...");
        let { channel } = req.body;
        let AllDATA = {};

        // RTC
        const RTC_Data = await live.rtcToken(channel);
        AllDATA['rtcdata'] = { ...RTC_Data, channel };

        //RTM
        const RTM_Data = await live.rtmToken(RTC_Data.uid);
        AllDATA['rtmdata'] = RTM_Data;

        // Acquire
        const acquiredata = await live.getResourceId(channel, RTC_Data.uid);
        // console.log("acquiredata.resourceId :", acquiredata.resourceId);
        AllDATA['resourceId'] = acquiredata.resourceId;

        //start Recording
        const startRecording = await live.startRecording(acquiredata.resourceId, channel, RTC_Data.uid, RTC_Data.token);
        AllDATA['startrecording'] = startRecording;

        console.log("AllDATA :", AllDATA);
        res.send(AllDATA);
    }
}

module.exports = liveController;