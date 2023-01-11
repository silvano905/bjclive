import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAYPJo48Q1EHsWLBAQ04dNjuCTvpSVA4zs",
    authDomain: "bjclive-9393a.firebaseapp.com",
    projectId: "bjclive-9393a",
    storageBucket: "bjclive-9393a.appspot.com",
    messagingSenderId: "408989422224",
    appId: "1:408989422224:web:d1b3fb585b5b6f5ad0fe15"
};

initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()



export {db, auth}


