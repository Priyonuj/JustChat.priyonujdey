import React, {useRef, useState} from 'react';
import Picker from 'emoji-picker-react';
import './chatbox.css'
import './chatboxres.css'
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/analytics';
import config from '../firebasesdk/config'
import Modal from 'react-modal';
import Compressor from 'compressorjs'
import {useListVals, useObjectVal} from 'react-firebase-hooks/database';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
} else {
    firebase.app(); // if already initialized, use that one
}
const db = firebase.database();
const firestore = firebase.firestore();

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
console.clear()
const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        resolve(event.target.result)
    };
    reader.readAsDataURL(file);
})
var chatidglobal;
function Chatbox(props) {
    chatidglobal = props.id;
var notiremove = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/ChatNotification/'+props.id).remove();   
    const [fileType,
        setfileType] = useState(0)
    const dummy = useRef();
    const [modalIsOpen,
        setIsOpen] = React.useState(false);
    const [messages] = useListVals(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/Message/' + props.id));
    const [userInfo,
        loading] = useObjectVal(db.ref('UserAccount/' + props.id));
    if (!loading) 
        var {Name, Image,Status}
    = userInfo;
    const [showEmoji,
        setshowEmoji] = useState(false);
    const [formValue,
        setFormValue] = useState('');
    const ref = useRef(null);
    const onEmojiClick = (event, emojiObject) => {
        const cursor = ref.current.selectionStart;
        const text = formValue.slice(0, cursor) + emojiObject.emoji + formValue.slice(cursor);
        setFormValue(text)
    };
    const openModal = e => {
        setIsOpen(true);
    }
    const [dataUri,
        setDataUri] = useState('')
    const [filename,
        setfilename] = useState('')

    function closeModal(e) {
        if (e) {
            var pushkey = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/Message/' + props.id)
                .push()
                .key;
            var notipush = db.ref('UserAccount/' + props.id + '/ChatNotification/' + localStorage.getItem('justchatUser')).push().key;
            var noti = db.ref('UserAccount/' + props.id + '/ChatNotification/' + localStorage.getItem('justchatUser'))
            noti.child(notipush).set({
                "msg" : 'incoming message from ' +localStorage.getItem('justchatUser')
            })
            var sendMsg = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/Message/' + props.id)
            sendMsg
                .child(pushkey)
                .set({
                    "Msg": dataUri,
                    "Servertime": firebase.database.ServerValue.TIMESTAMP,
                    "id": localStorage.getItem('justchatUser'),
                    "SentTime": new Date().toLocaleString(),
                    "Type": 1,
                    "FileName":filename
                })
            var sendMsg2 = db.ref('UserAccount/' + props.id + '/Message/' + localStorage.getItem('justchatUser'))
            sendMsg2
                .child(pushkey)
                .set({
                    "Msg": dataUri,
                    "Servertime": firebase.database.ServerValue.TIMESTAMP,
                    "id": localStorage.getItem('justchatUser'),
                    "SentTime": new Date().toLocaleString(),
                    "Type": 1,
                    "FileName":filename
                })

            var recentName = db.ref("UserAccount/" + localStorage.getItem('justchatUser') + "/RecentChat")
            recentName
                .child(props.id)
                .update({"Servertime": firebase.database.ServerValue.TIMESTAMP, "id": props.id})
            var recentName2 = db.ref("UserAccount/" + props.id + "/RecentChat")
            recentName2
                .child(localStorage.getItem('justchatUser'))
                .update({
                    "Servertime": firebase.database.ServerValue.TIMESTAMP,
                    "id": localStorage.getItem('justchatUser')
                })
            setIsOpen(false)
            setDataUri('');
            setfilename('')

        } else {
            setIsOpen(false)
            setDataUri('');
            setfilename('')
        }
    }

    const onChange = (file) => {
        //console.log(file)
        setfilename(file.name)
        if (!file) {
            setDataUri('');
            return;
        }
        if (file.type == 'image/jpeg' || file.type == 'image/png') {
            if (file.size / 1024 > 1024) {
                alert("File size should be less than 1 MB")
            } else {
                var qt = 0.8;
                if (file.size / 1024 > 800) {
                    qt = 0.6
                }
                new Compressor(file, {
                    quality: qt, // 0.6 can also be used, but its not recommended to go below.
                    success: (compressedResult) => {
                        fileToDataUri(compressedResult).then(dataUri => {
                            setDataUri(dataUri)
                        })
                        setfileType(1)
                        setIsOpen(true)
                    }
                });
            }
        } else {
             alert("Currently only image is supported")
           
        }
    }
    const [openDetail,
        setopenDetail] = useState(false);
    const [chatfile,
        setshchatfile] = useState('')
    const fileUpload = e => {}
    // 0->text, 1-> Image, 2-> Video, 3-> PDF
 
    setTimeout(() => {
      try{ dummy.current.scrollIntoView({behavior: 'smooth'});

      }catch{

      }
          
    }, 300);
    const sendMessage = async(e) => {
     e.preventDefault();

     const recentSelf = firestore.collection('RecentChat').doc(localStorage.getItem('justchatUser'));
     recentSelf.set({
      "id" : localStorage.getItem('justchatUser'),
      "Servertime": firebase.firestore.FieldValue.serverTimestamp(),
       })
     const recentSuser = firestore.collection('RecentChat(',localStorage.getItem('justchatUser'),')').doc(props.id);
     recentSuser.set({
        "id" : props.id,
        "Servertime": firebase.firestore.FieldValue.serverTimestamp(),
         })
        /*   dummy
            .current
            .scrollIntoView({behavior: 'smooth'});
        var pushkey = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/Message/' + props.id)
            .push()
            .key;
            var notis = db.ref('UserAccount/' + props.id + '/ChatNotification')
            notis.child(localStorage.getItem('justchatUser')).set({
                "id" : localStorage.getItem('justchatUser'),
                'music' : 1
            })
            var notim = db.ref('UserAccount/' + props.id + '/ChatNotificationMusic')
            notim.child(localStorage.getItem('justchatUser')).set({
                'music' : 1
            })
            var noti = db.ref('UserAccount/' + props.id + '/ChatNotification/' + localStorage.getItem('justchatUser'))
            noti.push().set({
                "msg" : 'incoming message '
            })
        var sendMsg = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/Message/' + props.id)
        sendMsg
            .child(pushkey)
            .set({
                "Msg": formValue,
                "Servertime": firebase.database.ServerValue.TIMESTAMP,
                "id": localStorage.getItem('justchatUser'),
                "SentTime": new Date().toLocaleString(),
                "Type": 0
            })
        var sendMsg2 = db.ref('UserAccount/' + props.id + '/Message/' + localStorage.getItem('justchatUser'))
        sendMsg2
            .child(pushkey)
            .set({
                "Msg": formValue,
                "Servertime": firebase.database.ServerValue.TIMESTAMP,
                "id": localStorage.getItem('justchatUser'),
                "SentTime": new Date().toLocaleString(),
                "Type": 0
            })

        var recentName = db.ref("UserAccount/" + localStorage.getItem('justchatUser') + "/RecentChat")
        recentName
            .child(props.id)
            .update({"Servertime": firebase.database.ServerValue.TIMESTAMP, "id": props.id})
        var recentName2 = db.ref("UserAccount/" + props.id + "/RecentChat")
        recentName2
            .child(localStorage.getItem('justchatUser'))
            .update({
                "Servertime": firebase.database.ServerValue.TIMESTAMP,
                "id": localStorage.getItem('justchatUser')
            })*/

        setFormValue('');
    }
    //console.log(dummy)
    //console.clear()
    return (

        <div className="MessageSection">
            <div className="Headerchatindi">
                <p><img src={Image || '/image/undraw_male_avatar_323b.svg'} alt={Name}/> {Name}

                    {!openDetail
                        ? <span
                                class="material-icons"
                                data-tip="Group Info"
                                style={{
                                float: 'right',
                               
                                cursor: 'pointer'
                            }}
                                onClick={() => setopenDetail(openDetail => !openDetail)}>
                                info
                            </span>
                        : <span
                            class="material-icons"
                            data-tip="Close Info"
                            style={{
                            float: 'right',
                           
                            cursor: 'pointer'
                        }}
                            onClick={() => setopenDetail(openDetail => !openDetail)}>
                            close
                        </span>}
                </p>
            </div>
            <div
                className="infoDetailindi"
                style={{
                display: openDetail
                    ? 'block'
                    : 'none'
            }}>
                <div className="infoDetailImgindi">
                    <img src={Image || '/image/undraw_male_avatar_323b.svg'} alt={Name}/>

                </div>
                <p>{Name}</p>
                {Status ?  <><h4><label>Status</label>
                {Status}</h4></>: <></>}
               
            </div>
            <div className="mainChatindi" id="chatid">

                {messages && messages.map(msg => <ChatMessage key={messages.id} message={msg}/>)}
                <span ref={dummy}></span>

            </div>

            <form onSubmit={sendMessage} className="indiForm">
                <div className="showPickerDivindi">
                    {showEmoji
                        ? <span
                                class="material-icons"
                                onClick={() => setshowEmoji(showEmoji => !showEmoji)}>
                                cancel
                            </span>

                        : <span
                            class="material-icons"
                            onClick={() => setshowEmoji(showEmoji => !showEmoji)}>
                            sentiment_very_satisfied
                        </span>}

                </div>
                <div className="showPickerDivindi">
                    <label id="pict">
                        <span class="material-icons">
                            attach_file
                        </span>

                        <input
                            type="file"
                            name="image"
                            class="image"
                            id="picture"
                            onChange={(event) => onChange(event.target.files[0] || null)}/>
                    </label>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={e => closeModal(0)}
                        style={customStyles}
                        contentLabel="Example Modal">

                        <div className="showFilemodal text-center">
                            <img src={dataUri} alt="avatar"/>
                            <br></br>

                            <div className="buttonModal">
                                <button className="btn btn-default">
                                    <span class="material-icons" onClick={e => closeModal(0)}>
                                        close
                                    </span>

                                </button>
                                <button className="btn btn-default">
                                    <span class="material-icons" onClick={e => closeModal(1)}>
                                        send
                                    </span>

                                </button>
                            </div>
                        </div>

                    </Modal>
                </div>
              <textarea  value={formValue}
                    ref={ref}
                    onKeyPress={e => {
                    if (e.key !== "Enter") 
                        return;
                   // console.log(formValue);
                }}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="Text Message"></textarea>
                
                <button type="submit" disabled={!formValue} className="btn btn-default">
                    <span className="material-icons micon">send</span>
                </button>
            </form>
            <div
                className="picker"
                style={{
                display: showEmoji
                    ? 'block'
                    : 'none'
            }}>
                <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} native/>
            </div>

        </div>
    )
}

function ChatMessage(props) {
    const {Msg, id, SentTime, Type,FileName} = props.message;
    const messageClass = localStorage.getItem('justchatUser') === id
        ? 'sent'
        : 'received';

    return ( <> <div className={`message ${messageClass}`}>

        {Type === 0
            ? <>< p > {
                Msg
            } </p><br></br > <label>{SentTime}</label> </> 
            :Type === 1 ? <><p className="imageMessage"><a href={Msg} target="_blank" download={FileName} data-tip="Click to download"> 
            <span class="material-icons">
            file_download
            </span > </a> < img src = {
                Msg
            }
            alt = "image" style = {{width:'70%'}}/> 
             </p > <br></br > < label > {
                SentTime
            } </label> </>:<></>}

    </div> </>)
  }

  export default Chatbox