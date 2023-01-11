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
    // citiesRef.update({
    //   user: 'new user'
    // }).then(()=>{
    //   console.log('updated user')
    // })
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
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    return null;
});
