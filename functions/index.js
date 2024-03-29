const functionsFirebase = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
exports.helloWorld = functionsFirebase.https.onRequest((request, response) => {
  functionsFirebase.logger.info("Hello logs!", {structuredData: true});
  response.send("hello");
});

exports.cleanReservations = functionsFirebase.pubsub.schedule('every day 22:00').onRun(async context => {
    let citiesRef = await admin.firestore().collection('appointments').doc('vRDaxyIRohFyDLEigl5o');
    let citiesRefTwo = await admin.firestore().collection('appointments').doc('ZuARxTzUiLMQ1FMJDsnp');

    // citiesRef.update({
    //   user: 'new user'
    // }).then(()=>{
    //   console.log('updated user')
    // })
    let allCitiesTwo = await citiesRefTwo.get()
    let allCities = citiesRef.get()
        .then(snapshot => {
            let list = snapshot.data().times
            for (let i = 0; i < list.length; i++) {
                if(list[i].reserved){
                    list[i].reserved = false
                    list[i].user = ''
                }
            }
            citiesRef.update({
                times: list
            })

            let listTwo = allCitiesTwo.data().times
            for (let i = 0; i < list.length; i++) {
                if(list[i].time===listTwo[i].time&&listTwo[i].reserved){
                    list[i].reserved = true
                    list[i].user = listTwo[i].user

                    listTwo[i].reserved = false
                    listTwo[i].user = ''
                }
            }
            citiesRefTwo.update({
                times: listTwo
            })


        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    return null;
});


exports.sendSMS = functionsFirebase.runWith({ secrets: ["TWILIO_SID", "TWILIO_AUTH"] }).firestore
    .document('jumps/{jumpId}')
    .onCreate(async (snap, context) => {
        const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
        // Get the new jump document
        const newJump = snap.data();
        // Get the jumpId
        const jumpId = context.params.jumpId;
        const link = `https://bjclive-9393a.web.app/jump/${jumpId}`
        await client.messages
            .create({
                body: `you requested a jump start service at: ${newJump.address}.
                \nThe driver will arrive soon.
                \nClick the link for Live tracking, to cancel jump service or to send a message to the driver.
                \n`+ link,
                messagingServiceSid: 'MG4001653e7657f5be3fd3dadf497d2941',
                to: '+17085489664'
            })
        return null;
    });
