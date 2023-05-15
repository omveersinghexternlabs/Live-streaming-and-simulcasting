
// import Agora from 'agora-access-token';
// import axios from 'axios';
// import ListingModel from '@/models/listing.model';
// import { Types } from 'mongoose';
const Agora = require("agora-access-token");
const axios = require("axios");
// const s3Utility = require('../utilities/fileUploaderS3')
// const live =require('../utilities/live')
// const Types = require('mongoose')


//  userService = new userService();
// const list = ListingModel;
// const appId = process.env.AGORA_APP_ID;
// const appCertificate = process.env.AGORA_APP_CERTIFICATE;
// const customerId = process.env.AGORA_CUSTOMER_ID;
// const customerSecretKey = process.env.AGORA_CUSTOMER_SECRET_KEY;



// const facebookId = process.env.NEWFACEBOOK;
// const facebook_secret = process.env.NEWFACEBOOK_SECRET;

let AGORA_APP_ID = '94a7516d9ef7476f94ad3530c8f9d686';
let AGORA_APP_CERTIFICATE = '2566f69a5a754ef698410af597e511ca';
let AGORA_CUSTOMER_ID = '48b4159a2bbb43349c4b0a26a422f885';
let AGORA_CUSTOMER_SECRET_KEY = '6458ad5e126d4367b70374add9c50e40';
module.exports = {
    async rtcToken(ch) {
        try {
            const isPublisher = true;
            const expirationTimeInSeconds = 3600;
            const uid = Math.floor(Math.random() * 100000); //UID need to pass to the SDK in the front-end while joining the channel.
            const role = true;
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

            const token = Agora.RtcTokenBuilder.buildTokenWithUid(
                AGORA_APP_ID,
                AGORA_APP_CERTIFICATE,
                ch,
                0,
                role,
                expirationTimestamp,
            );
            // console.log("token-----", uid, token);
            return { uid, token };
        } catch (error) {
            console.log(error);
        }
    },

    async rtmToken(useraccount) {
        try {
            const userAccount = useraccount.toString();
            const role = Agora.RtmRole.Rtm_User;
            const expirationTimeInSeconds = 3600;
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;
            const token = Agora.RtmTokenBuilder.buildToken(
                AGORA_APP_ID,
                AGORA_APP_CERTIFICATE,
                userAccount,
                role,
                expirationTimestamp,
            );
            // console.log("token of rtm:", token)
            return { token }; // message: 'success', res:
        } catch (error) {
            // next(error);
            console.log(error.message);
        }
    },
    async getResourceId(channel, uid) {
        try {
            // console.log('Inside Aquire');
            const customerKey = AGORA_CUSTOMER_ID;
            // Customer secret
            const customerSecret = AGORA_CUSTOMER_SECRET_KEY;
            // Concatenate customer key and customer secret and use base64 to encode the concatenated string
            const plainCredential = customerKey + ':' + customerSecret;
            // Encode with base64
            const encodedCredential = Buffer.from(plainCredential).toString('base64');
            const authorizationField = 'Basic ' + encodedCredential;
            //const Authorization = `Basic ${Buffer.from(`${this.customerId}:${this.customerSecretKey}`).toString('base64')}`;

            // console.log('channel', channel, 'uid', uid);
            // console.log("-----------  authorizationField  --------- :", authorizationField);


            const acquire = await axios.post(
                `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/acquire`,
                {
                    cname: channel,
                    uid: uid.toString(),
                    clientRequest: {
                        resourceExpiredHour: 24,
                    },
                },
                {
                    headers: {
                        Authorization: authorizationField,
                        'Content-Type': 'application/json',
                    },
                },
            );

            // console.log({ data: acquire.data });
            return acquire.data;
        } catch (error) {
            console.log(" error ",error);
        }
    },
    async startRecording(resourceId, channel, uid, rtctoken) {
        try {
            // console.log('resoures----------------', resourceId);
            const Authorization = `Basic ${Buffer.from(`${AGORA_CUSTOMER_ID}:${AGORA_CUSTOMER_SECRET_KEY}`).toString('base64')}`;
            const resource = resourceId;
            const mode = 'individual';
            const start = await axios.post(
                `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resource}/mode/${mode}/start`,

                {
                    cname: channel,
                    uid: uid.toString(),
                    clientRequest: {
                        token: rtctoken,
                        recordingConfig: {
                            channelType: 0,
                            streamTypes: 2,
                            videoStreamType: 0,
                            streamMode: 'standard',
                            maxIdleTime: 120,
                            subscribeVideoUids: ['#allstream#'],
                            subscribeAudioUids: ['#allstream#'],
                            subscribeUidGroup: 0,
                        },
                        storageConfig: {
                            
                            vendor: 1,
                            region: 14,
                            bucket:'sheideo-cloudrecording',
                            accessKey: 'AKIAUU5KTXH7EB3ENGFP',
                            secretKey: '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',
                            fileNamePrefix: [
                                "live",
                                "videos"
                            ]
                        },
                    },
                },

                { headers: { Authorization } },
            );
            return start.data;
        } catch (error) {
            console.log(error);
        }
    }
}