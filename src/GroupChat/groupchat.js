import React, {useRef, useState} from 'react';
import Picker  from 'emoji-picker-react';
import './groupchat.css'
import './groupchatres.css'
import firebase from 'firebase/app';
import ReactTooltip from 'react-tooltip';
import 'firebase/firestore';
import 'firebase/auth';
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
console.clear()
const db = firebase.database();
var grouid,
    groupname,
    groupimg;

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
    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })

function GroupChatbox(props) {
    const [isadmin] = useObjectVal(db.ref('GroupList/' + grouid + '/Admin/' + localStorage.getItem('justchatUser')));
    grouid = props.id;
    const [modalIsOpen,
        setIsOpen] = React.useState(false);
    const dummy = useRef();
    const [searchFriend,
        setsearchFriend] = useState('');
    const [showaddfriendList,
        setshowaddfriendList] = useState('')
    var [friendLiSt] = useListVals(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/FriendList'));
    const [messages] = useListVals(db.ref('GroupList/' + props.id + '/Message'));
    const [groupInfo,
        loadinginfo] = useObjectVal(db.ref('GroupList/' + props.id));
    if (!loadinginfo) {

        var {GroupName, GroupImage} = groupInfo
        groupname = GroupName;
        groupimg = GroupImage;
    }
    const [friend ] = useListVals(db.ref('GroupList/' + props.id + '/FriendList'));

    const [openDetail,
        setopenDetail] = useState(false);
    const [openaddFriend,
        setopenaddFriend] = useState(false);
    const [showEmojigroup,
        setshowEmojigroup] = useState(false);
    const [formValue,
        setFormValue] = useState('');
    const ref = useRef(null);
    const onEmojiClick = (event, emojiObject) => {
        const cursor = ref.current.selectionStart;
        const text = formValue.slice(0, cursor) + emojiObject.emoji + formValue.slice(cursor);
        setFormValue(text)
    };
  
    setTimeout(() => {
        try{ dummy.current.scrollIntoView({behavior: 'smooth'});
  
        }catch{
  
        }
            
      }, 300);
    const sendMessage = async(e) => {
        e.preventDefault();
        dummy.current.scrollIntoView({behavior: 'smooth'});
    

        var pushkey = db.ref('UserAccount/' + props.id + '/Message').push().key;
        var sendMsg = db.ref('GroupList/'+props.id+'/Message')
        sendMsg
            .child(pushkey)
            .set({
                "Msg": formValue,
                "Servertime": firebase.database.ServerValue.TIMESTAMP,
                "id": localStorage.getItem('justchatUser'),
                "SentTime": new Date().toLocaleString(),
                'Type' :0
            })


        setFormValue('');
    }

    const AddFriendfunc = async(e) => {
        e.preventDefault();
        if (searchFriend) 
            setshowaddfriendList(1)
            // setsearchFriend('')
        }
        const [dataUri,
            setDataUri] = useState('')
        const [file,
            setfile] = useState('')
    
     function closeModal(e) {
            if (e) {
                var pushkey = db.ref('UserAccount/' + props.id + '/Message').push().key;
                var sendMsg = db.ref('GroupList/'+props.id+'/Message')
                sendMsg
                    .child(pushkey)
                    .set({
                        "Msg": dataUri,
                        "Servertime": firebase.database.ServerValue.TIMESTAMP,
                        "id": localStorage.getItem('justchatUser'),
                        "SentTime": new Date().toLocaleString(),
                        'Type' :1
                    })
                setIsOpen(false)
                setDataUri('');
    
            } else {
                setIsOpen(false)
                setDataUri('');
            }
        }
    
        const onChange = (file) => {
            console.log(file)
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
                         //   setfileType(1)
                            setIsOpen(true)
                        }
                    });
                }
            } else {
                 alert("Currently only image is supported")
               
            }
        }
      //  console.clear()
    return (

        <div className="MessageSectiongroup">
            <div className="Headerchat">
                <p><img src={GroupImage} alt={GroupName}/> {GroupName}

                   {!openDetail ?  <span
                        class="material-icons"
                        data-tip="Group Info"
                        style={{
                        float: 'right',
                        margin: '20px 20px 20px 20px',
                        cursor:'pointer'
                    }}
                        onClick={() => setopenDetail(openDetail => !openDetail)}>
                        info
                    </span> :  <span
                        class="material-icons"
                        data-tip="Close Info"
                        style={{
                        float: 'right',
                        margin: '20px 20px 20px 20px',
                        cursor:'pointer'
                    }}
                        onClick={() => setopenDetail(openDetail => !openDetail)}>
                        close
                    </span>}
                </p>
            </div>
            <ReactTooltip
                    place="left"
                    type="light"
                    effect="solid"
                    backgroundColor="black"
                    textColor="#ffffff"/>
            <div
                className="infoDetail"
                style={{
                display: openDetail
                    ? 'block'
                    : 'none'
            }}>
                <div className="infoDetailImg">
                    <img src={GroupImage} alt={GroupName}/>
                </div>
                <p>{GroupName}
                {isadmin ?  <>  {!openaddFriend ?<span
                        class="material-icons"
                        data-tip="Add Friend"
                        onClick={() => setopenaddFriend(openaddFriend => !openaddFriend)}>
                        person_add
                    </span> : 
                    <span class="material-icons"   data-tip="Show Group" 
                    onClick={() => setopenaddFriend(openaddFriend => !openaddFriend)}> keyboard_return </span>

                  } </>:<></>}
                 
                </p>

                {!openaddFriend
                    ? <div className="infoDetail_FriendList">
                            <p>Friend List</p>
                            {friend && friend.map(msg => <GroupFriendNameList flist={msg}/>)}
                        </div>
                    : <div className="groupaddfreind">
                        <p>Add Friend
                        </p>
                        <div className="InputSearch">
                            <div className="addFriendInput">
                                <div className="input-group">
                                    <div className="form-outline">
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={searchFriend}
                                            onChange={(e) => setsearchFriend(e.target.value)}
                                            placeholder="Search by Email"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="material-icons" onClick={AddFriendfunc}>
                                    search
                                </span>
                            </div>
                        </div>
                        <div className="addFriendtogroup">
                            {showaddfriendList
                                ? <AddFriendList value={searchFriend}/>
                                : <div></div>}
                        </div>

                        <div className="myfriendlist">
                            {friendLiSt && friendLiSt.map(msg => <MyFriendList message={msg}/>)}
                        </div>

                    </div>
                    }
                
            </div>
            <div className="mainChatgroup">

                {messages && messages.map(msg => <ChatMessage  message={msg}/>)}
                <span ref={dummy}></span>

            </div>

            <form onSubmit={sendMessage} className="groupform">
                <div
                    className="showPickerDivgroup"
                   >
                    {showEmojigroup
                        ? <span class="material-icons"  onClick={() => setshowEmojigroup(showEmojigroup => !showEmojigroup)}>
                                cancel
                            </span>

                        : <span class="material-icons"  onClick={() => setshowEmojigroup(showEmojigroup => !showEmojigroup)}>
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
                <input
                    value={formValue}
                    ref={ref}
                    onKeyPress={e => {
                    if (e.key !== "Enter") 
                        return;
                    console.log(formValue);
                }}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="Text Message"/>
                <button type="submit" disabled={!formValue} className="btn btn-default">
                    <span className="material-icons micon">send</span>
                </button>
            </form>
            <div
                className="pickergroup"
                style={{
                display: showEmojigroup
                    ? 'block'
                    : 'none'
            }}>
                <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} native/>
            </div>

        </div>
    )
}

function MyFriendList(props) {
    // console.log(props.message.id)
    var add = 0;

    const addfriendtoList = (event) => {

        var user = db.ref('GroupList/' + grouid + '/FriendList')
        user
            .child(id)
            .update({id, Name, Image})

        var userinform = db.ref('UserAccount/' + id + '/GroupList/')
        userinform
            .child(grouid)
            .update({"Admin": 'false', "Groupid": grouid, "GroupName": groupname, "GroupImage": groupimg})
    }

    const removefriendtoList = (event) => {

        var user = db.ref('GroupList/' + grouid + '/FriendList')
        user
            .child(id)
            .remove();

        var userinform = db.ref('UserAccount/' + id + '/GroupList/')
        userinform
            .child(grouid)
            .remove();

    }

    var [friendLiStname,
        loading12] = useObjectVal(db.ref('UserAccount/' + props.message.id));
    if (!loading12) 
        var {Image, Name, id}
    = friendLiStname;

    var [friendLiSt,
        loading] = useObjectVal(db.ref('GroupList/' + grouid + '/FriendList/' + props.message.id));
    add = 0;
    if (!loading) 
        if (friendLiSt) 
            add = 1;

    return (
        <li><img src={Image} alt={Name}/> {Name}
            {!add
                ? <span className="material-icons addGroup" onClick={addfriendtoList}>add</span>
                : <span class="material-icons addGroup" onClick={removefriendtoList}>
                    close
                </span>}</li>

    )

}

function ChatMessage(props) {
    const {Msg, id, SentTime, Type} = props.message;
    // console.log(props.message)  const {id} = props.message;
    const messageClass = localStorage.getItem('justchatUser') === id
        ? 'sentgroup'
        : 'receivedgroup';

        return ( <> <div className={`message ${messageClass}`}>

        {Type === 0
            ? <>< p > {
                Msg
            } </p><br></br > <label>{SentTime}</label> </> 
            :Type === 1 ? <><p className="imageMessage"><a href={Msg} target="_blank" download={Msg}  data-tip="Click to download"> 
            <span class="material-icons">
            file_download
            </span > </a> < img src = {
                Msg
            }
            alt = "image" style = {{width:'70%'}}/> 
             </p > <br></br > < label > {
                SentTime
            } </label> </ >:<></>}

    </div> </>)

    
  }

function GroupFriendNameList(props){
    const removefriendtoList = (event) => {
       var user = db.ref('GroupList/'+grouid+'/FriendList')
 user.child(id).remove();

    var userinform = db.ref('UserAccount/' + id + '/GroupList/');
    userinform.child(grouid).remove();
}
const {Name, Image, id} = props.flist

const [admin] = useObjectVal(db.ref('GroupList/' + grouid + '/Admin/' + id));

const [selfadmin] = useObjectVal(db.ref('GroupList/' + grouid + '/Admin/' + localStorage.getItem('justchatUser')));
return (
    <li><img src={Image} alt={Name}/> {Name
}
        {localStorage.getItem('justchatUser') !== id ? 
        
           !admin ? !selfadmin ?<></> :<span class="material-icons addGroup" onClick={removefriendtoList}>
                        close
                    </span>
                :  <span class="admin">Admin</span >
            : !admin
                ? <></> : <span class="admin">Admin</span >}</li>

)
}
var userShow = 0;
var load = 0,
error = 2;

function AddFriendList(props) {
    const addfriendtoList = (event) => {

        var user = db.ref('GroupList/' + grouid + '/FriendList')
        user
            .child(id)
            .update({id, Name, Image})

        var userinform = db.ref('UserAccount/' + id + '/GroupList/')
        userinform
            .child(grouid)
            .update({"Admin": 'false', "Groupid": grouid, "GroupName": groupname, "GroupImage": groupimg})
    }

var email = props.value;
email = email.replace(/\./g, '(dot)');
email = email.replace(/\$/g, '(dollar)');
email = email.replace(/\[/g, '(left)');
email = email.replace(/\]/g, '(right)');
email = email.replace(/\//g, '(slash)')
const [addfriendLiStv] = useObjectVal(db.ref('UserMapping/' + email + '/id'));
const [friendLiSt,
    loading1] = useObjectVal(db.ref('UserAccount/' + addfriendLiStv));

if (!loading1) {
    if (load === 1) {
        try {
            var {Name, Image, id} = friendLiSt;
            error = 0;
        } catch (e) {
            error = 1;
        }
    }
} else {
    load = 1;
}
if (error === 0) {
    userShow = 1;
}

return ( <> {
    !userShow
        ? <div></div>
        : error === 1
            ? <li>NO Data Found</li >
            : <li><img src={Image} alt={Name}/> {Name}

                    {localStorage.getItem('justchatUser') !== addfriendLiStv
                        ? <span className="material-icons add" onClick={addfriendtoList}>
                                add
                            </span>
                        : <div></div>}
                </li>
} </>
  )

}

  export default GroupChatbox