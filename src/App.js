import './App.css';
import Test from './Test/test'
import Mainbody from './mainbody/mainbody'
import React, {useState} from 'react';
import GoogleLogin from 'react-google-login';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import config from './firebasesdk/config'
import 'firebase/analytics';
import Modal from 'react-modal';
if (!firebase.apps.length) {
    firebase.initializeApp(config);
} else {
    firebase.app(); // if already initialized, use that one
}
const firestore = firebase.firestore();
//localStorage.removeItem('justchatUser')
const db = firebase.database();
//.clear()
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
var ren = 0;
function App() {
    ////console.clear();
    const [modalIsOpen,
        setIsOpen] = React.useState(false);
        if(ren == 0)
        {
            if(window.innerWidth < 500)
            {
                setIsOpen(true)
            }
            ren++;
        }
   

    const [verify,
        setverify] = useState('');

    const responseGoogle = (response) => {
      /*  const messagesRef = firestore.collection('RecentChat',response.profileObj.email).doc(response.profileObj.email);
        messagesRef.set({
           "Email" : response.profileObj.email,
           "Name": response.profileObj.givenName + ' ' + response.profileObj.familyName,
           "Image": response.profileObj.imageUrl,
           "GoogleID": response.profileObj.googleId,
           "Status" : 'Hello, nice to meet you' 
          }).then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        setverify(1)
        localStorage.setItem('justchatUser', response.profileObj.email);*/
       var email = response.profileObj.email
        email = email.replace(/\./g, '(dot)')
        email = email.replace(/\$/g, '(dollar)')
        email = email.replace(/\[/g, '(left)')
        email = email.replace(/\]/g, '(right)')
        email = email.replace(/\//g, '(slash)')
        var docRef = db.ref("UserMapping/" + email + '/id');
        docRef.once("value", snapshot => {
            if (snapshot.val() === null) {
                var id = db
                    .ref("UserAccount/" + email)
                    .push()
                    .key;
                var mapping = db
                    .ref()
                    .child('UserMapping');
                mapping
                    .child(email)
                    .update({"id": id});

                var insert = db
                    .ref()
                    .child('UserAccount/');
                insert
                    .child(id)
                    .update({
                        "Name": response.profileObj.givenName + ' ' + response.profileObj.familyName,
                        "Email": response.profileObj.email,
                        "id": id,
                        "Image": response.profileObj.imageUrl,
                        "GoogleID": response.profileObj.googleId,
                        "Status" : 'Hello, nice to meet you'
                    });
                localStorage.setItem('justchatUser', id);
                localStorage.setItem('newjustchatUser', id);
                setverify(1)
            } else {

                localStorage.setItem('justchatUser', snapshot.val());
                setverify(1)
            }
        })

    }
const closeModal = e =>
{
    setIsOpen(false)
}
//console.clear();
    return (localStorage.getItem('justchatUser') || verify === 1
        ? <Mainbody/>
        : <div>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={e => closeModal()}
                style={customStyles}
               >

                <div className="welcomeMsg text-center">
                    <p>Recommended <br></br>
                        Laptop / Desktop<br></br>
                         View for <br></br>
                         Better Experience</p>
                         <button className="btn btn-default" onClick={e => closeModal()}>Close</button>
                </div>

            </Modal>
            <div className="appmainsection">
            <div className="bgImg">
                <img src="/image/pexels-anni-roenkae-2457284.jpg" alt=""/>
            </div>
            <div id="login_div" className="main-div text-center">
                <h3>
                    Welcome to JustChat</h3>
                <p>
                    <label>Chat with your Friends and Family</label>
                    
                </p>
                <br/>
                <br/>
                <div className="button"><GoogleLogin
                    clientId="893721470873-484ogvdp79ceu9kl4oruojddnbqu2trf.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={responseGoogle}
                    onFailure={ responseGoogle}
                    cookiePolicy={'single_host_origin'}/>
                </div>
            </div>
            <p className="beta">Beta Website ...... Under Working</p>
            </div>
           
        </div>)
}

export default App
