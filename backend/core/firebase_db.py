import pyrebase

firebaseConfig = {
 
  "apiKey": "AIzaSyAgreXLtAs0qsWBbXpR_nQNWYXatEJ9Ky8",
 
  "authDomain": "quizy-3d149.firebaseapp.com",
 
  "projectId": "quizy-3d149",
 
  "storageBucket": "quizy-3d149.appspot.com",
 
  "messagingSenderId": "818217105784",
 
  "appId": "1:818217105784:web:72d8863dd9367db554b08d",
 
  "measurementId": "G-YYLSSHE0XL"
 
}

firebase= pyrebase.initialize_app(firebaseConfig)
database=firebase.database()

database.get()