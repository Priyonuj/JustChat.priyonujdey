import React, {useState, useCallback, useEffect} from 'react';
import ReactTooltip from 'react-tooltip';
import './mainbody.css'
import './mainbodyRes.css'
import firebase from 'firebase/app';
import 'firebase/database';
import config from '../firebasesdk/config'
import Loadingscreen from '../loadingScreen/loadingscreen'
import Chatbox from '../chatbox/chatbox'
import GroupChatbox from '../GroupChat/groupchat'
import 'firebase/analytics';
import {useListVals,useList, useObjectVal} from 'react-firebase-hooks/database';

import Tour from 'reactour'
import Modal from 'react-modal';
import Cropper from 'react-easy-crop'

import useSound from 'use-sound'

if (!firebase.apps.length) {
    firebase.initializeApp(config);
} else {
    firebase.app(); // if already initialized, use that one
}
const db = firebase.database();

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
const croppieOptions = {
    showZoomer: true,
    enableOrientation: true,
    mouseWheelZoom: "ctrl",
    viewport: {
      width: 300,
      height: 200,
      type: "square"
    },
    boundary: {
      width: "50vw",
      height: "50vh"
    }
  };
  

//var c = new Croppie(croppie, croppieOptions);
if(window.innerWidth > 500){
    var steps = [
        {
            selector: '.controlMenu',
            content: 'Menu section'
        }, {
            selector: '.changebackgroudcolormode',
            content: 'Change Background Mode'
        }, {
            selector: '.recentchaticon',
            content: 'Show Recent Chat '
        }, {
            selector: '.grouplisticon',
            content: 'Show Group List '
        }, {
            selector: '.addfreindicon',
            content: 'Add Friend '
        }, {
            selector: '.creategroupicon',
            content: 'Create Group '
        }, {
            selector: '.logouticon',
            content: 'Logout '
        }, {
            selector: '.userSetting',
            content: 'Manage Account'
        }, {
            selector: '.menuSection',
            content: 'Activity Section ( Recent Chat List / Add friend / Group Creation etc...)'
        }, {
            selector: '.chatSection',
            content: 'Chat Section'
        }, {
            selector: '.friendSection',
            content: 'Freind List Section'
        },
    
        // ...
    ];
}
else{
    var steps = [
        {
            selector: '.controlMenu',
            content: 'Menu section'
        }, {
            selector: '.changebackgroudcolormode',
            content: 'Change Background Mode'
        }, {
            selector: '.recentchaticon',
            content: 'Show Recent Chat '
        }, {
            selector: '.grouplisticon',
            content: 'Show Group List '
        }, {
            selector: '.addfreindicon',
            content: 'Add Friend '
        }, {
            selector: '.creategroupicon',
            content: 'Create Group '
        }, {
            selector: '.logouticon',
            content: 'Logout '
        }, {
            selector: '.userSetting',
            content: 'Manage Account'
        }, {
            selector: '.menuSection',
            content: 'Activity Section ( Recent Chat List / Add friend / Group Creation etc...)'
        }, {
            selector: '.friendSectionresopen',
            content: 'Show Friend List '
        },
    
        // ...
    ];
}


var ren = 0,userren = 0,firen = 0,musicren = 0,recentren = 0;
var chatidname ;
function Mainbody() {
   // const [play] = useSound('/image/hey-im-here-too-147.mp3');
    const [isTourOpen,
        setIsTourOpen] = useState(false);
    const [loadingscreen,
        setLoadingscreen] = useState(true)
    const [modalIsOpen,
        setIsOpen] = React.useState(false);
    useEffect(() => {
        setTimeout(() => setLoadingscreen(false), 3000)
    }, [loadingscreen])

    if (ren === 0) {
        if (!loadingscreen) {
            if (localStorage.getItem('newjustchatUser')) {
                setIsOpen(true)
                ren = 1;
                localStorage.removeItem('newjustchatUser')
            }

        }

    }
    //undraw_male_avatar_323b.svg
    const [show,
        setShow] = useState(0);
    /* Name, Image ,Email    */
    const [username,
        setusername] = useState("");
    const [userimage,
        setuserimage] = useState("")
    const [userAccountstatus,
        setuserAccountstatus] = useState("")
    const [saveButton,
        setsaveButton] = useState(false)
    const [isdark,
        setisdark] = useState(true)

 
    var [groupLiSt,
        loadinggrouplist] = useListVals(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/GroupList'));
    if (!loadinggrouplist) 
        if (!groupLiSt.length) 
            groupLiSt = [
                {
                    id: ''
                }
            ]

var [friendLiSt,
        loadingfrienlist] = useListVals(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/FriendList'));
    if (!loadingfrienlist) 
        if (!friendLiSt.length) 
            friendLiSt = [
                {
                    id: ''
                }
            ]
const recentRef = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/RecentChat');
    const [userInfo, loading] = useObjectVal(db.ref('UserAccount/' + localStorage.getItem('justchatUser')))
    if (!loading) {
    
        var {Name, Email, Image, Status} = userInfo
        if (!username) 
         if(userren === 0)
            setusername(Name)
        if (!userimage) 
          if(userren === 0)
            setuserimage(Image)
       if (!userAccountstatus) 
               if(userren === 0) 
                setuserAccountstatus(Status)
         
             

                
                userren ++;
     
        
    }

    const [themeRef,
        loadingtheme] = useObjectVal(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/Theme'))
    if (!loadingtheme) 
        if (themeRef != null) {
            //if(themeRef !== isdark)  setisdark(themeRef)
        }
    const query = recentRef.orderByChild('Servertime')
    
    var [recentList,
        loadingrecentlist] = useListVals(recentRef);
    if (!loadingrecentlist) {
        
        if (!recentList.length) 
          recentList = [ { id: ''}]
         
    }
    
  
    const [searchFriend,
        setsearchFriend] = useState('');
    const [createGroup,
        setcreateGroup] = useState('');
    const [showaddfriendList,
        setshowaddfriendList] = useState('')
    const [chatName,
        setchatName] = useState('')
    const [GroupchatName,
        setGroupchatName] = useState('')

    const AddFriendfunc = async(e) => {
        e.preventDefault();
        if (searchFriend) 
            setshowaddfriendList(1)
            // setsearchFriend('')
        }

    musicren++;
    const CreateGroupfunc = (e) => {
       if(createGroup.length > 0){
        var pushkey = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/GroupList')
        .push()
        .key;
    var creategalist = db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/GroupList')
    creategalist
        .child(pushkey)
        .update({"Admin": 'True', "GroupName": createGroup, "Groupid": pushkey, "GroupImage": '/image/undraw_community_8nwl.svg'})
    var createg = db.ref('GroupList')
    createg
        .child(pushkey)
        .update({
            "Createdtime": new Date().toLocaleString(),
            "Groupid": pushkey,
            "GroupName": createGroup,
            "GroupImage": '/image/undraw_community_8nwl.svg',
            "Servertime": firebase.database.ServerValue.TIMESTAMP,
            "CreatedBy": localStorage.getItem('justchatUser')
        })
    var creategadmin = db.ref('GroupList')
    creategadmin
        .child(pushkey + '/Admin/' + localStorage.getItem('justchatUser'))
        .update({
            "AdminId": localStorage.getItem('justchatUser'),
            Name,
            Image
        })
    var creategfriend = db.ref('GroupList')
    creategfriend
        .child(pushkey + '/FriendList/' + localStorage.getItem('justchatUser'))
        .update({
            "id": localStorage.getItem('justchatUser'),
            Name,
            Image
        })
    changeDivval(3);
    alert("Group created");
    setcreateGroup('')
       }
     
    }

    const openModal = e => {
        setIsOpen(true);
    }

    function closeModal(e) {
        if (e === 1) 
            setIsTourOpen(true)
        setIsOpen(false);
    }


    const changeDivval = async(e) => {
       // play()
        setShow(e)
        if (window.innerWidth < 500) 
          {  setrespmenuSection(0)
            setTimeout(() => {
                setchatName('')
            }, 200);
            
          }
    }

    const saveUSerInfo = (e) => {
        var change = db.ref('UserAccount')
        change.child(localStorage.getItem('justchatUser')).update({
            'Name': username,
            'Status' : userAccountstatus
        })
        userren = 0;
    setsaveButton(false)
    }
    const divView = (e) => {
      
        if (show === e) 
            return 'block'
        else 
            return 'none'
    }
    const borderLeftColor = (e) => {
        if (show === e) 
            return '2px solid'
        else 
            return 'none'
    }


    const setgroupIdchat = (e) => {
        setchatName('')
        setGroupchatName(e)
        chatidname = e;
        if (window.innerWidth < 500) 
            setrespmenuSection(1)
    }
    const setchatIdchat = (e) => {
        setchatName(e)
        setGroupchatName('')
        chatidname = e;
        if (window.innerWidth < 500) {
            setrespmenuSection(1)
            setopenFriendsection(0)
        }

    }



    const Logoutfunc = (e) => {
        localStorage.removeItem('justchatUser');
        window
            .location
            .reload();
    }
    /* Responsive Const */
    const [respmenuSection,
        setrespmenuSection] = useState(false);
    const [openFriendsection,
        setopenFriendsection] = useState(false);

        function CropImgcloseModal(e) {
            setCropImagemodalIsOpen(false)
        }     
       
       
       // const croppie = document.getElementById("croppieImg");
       // console.log(croppie)
        var file = React.createRef();
      //  croppie = React.createRef();
        var img = React.createRef();
        var c;  
//const c = new Croppie(croppie, croppieOptions);
      
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
  
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      console.log(croppedArea, croppedAreaPixels)
    }, [])
    const [uploadInputImage ,setuploadInputImage] =useState('')
    const [CropImagemodalIsOpen ,setCropImagemodalIsOpen] =useState(false)
    const onChangeprofileImage = (file) => {
        console.log(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);
  
        setCropImagemodalIsOpen(true)
    }
    const onResult = e => {
        c.result("base64").then(base64 => {
          this.setState(
            { croppedImage: base64 },
            () => (this.img.current.src = base64)
          );
        });
      };
   // console.clear()


    return (
        <div className="mainBody">
          
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={e => closeModal(0)}
                style={customStyles}
                contentLabel="Example Modal">

                <div className="welcomeMsg text-center">
                    <p>Welcome to Justchat</p>
                    <p>Chat with your Freinds and Family</p>
                    <button className="btn btn-default" onClick={e => closeModal(1)}>Take a Small Tour</button>
                    <button className="btn btn-default" onClick={e => closeModal(0)}>Close</button>
                </div>

            </Modal>
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}/> {loadingscreen
                ? <Loadingscreen/>
                : <><div
            className = "openfriendListclass friendSectionresopen"
            onClick = {
                e => setopenFriendsection(openFriendsection => !openFriendsection)
            } > {
                openFriendsection
                    ? <span className="material-icons">
                            close
                        </span>
                    : <span className="material-icons">
                            people
                        </span>
            } </div>
         
            <div className="controlMenu text-center">
                <div className="controlMenuListIcon">
                    {isdark
                        ? <span
                        className="material-icons changebackgroudcolormode"
                                onClick={() => setisdark(isdark => !isdark)}
                                style={{
                                cursor: 'pointer'
                            }}>
                                light_mode
                            </span > : <span
                className="material-icons"
                onClick={() => setisdark(isdark => !isdark)}
                style={{
                cursor: 'pointer'
            }}>
                dark_mode
            </span>
        } < span
        className = "material-icons recentchaticon" style = {{borderLeft:borderLeftColor(0),borderRight:borderLeftColor(0)}}
        data-tip = "Chat list"
        onClick = {
            (e) => changeDivval(0)
        } > chat </span>

                    <span
                        className="material-icons grouplisticon" style={{borderLeft:borderLeftColor(3),borderRight:borderLeftColor(3)}}
                        data-tip="Group list"
                        onClick={(e) => changeDivval(3)}>
                        groups
                    </span > <span
            className="material-icons addfreindicon"
            style={{
            borderLeft: borderLeftColor(1),
            borderRight: borderLeftColor(1)
        }}
            data-tip="Add Friend"
            onClick={(e) => changeDivval(1)}>
            person_add
        </span> < span
        className = "material-icons creategroupicon" style = {{borderLeft:borderLeftColor(2),borderRight:borderLeftColor(2)}}
        data-tip = "Create Group"
        onClick = {
            (e) => changeDivval(2)
        } > group_add </span>
                    <hr></hr > <span
            class="material-icons logouticon"
            data-tip="Logout"
            onClick={(e) => Logoutfunc(e)}>
            logout
        </span>
      

     


         < ReactTooltip
        place = "right"
        type = "light"
        effect = "solid"
        backgroundColor = "black"
        textColor = "#ffffff" /> </div> </div>

            <div
                className={!respmenuSection
                ? isdark
                    ? 'menuSectiondark menuSection'
                    : 'menuSectionlight menuSection'
                : isdark
                    ? 'menuSectiondark menuSectionres'
                    : 'menuSectionlight menuSectionres'}>
                <h1
                    className={isdark
                    ? 'justChat justChatdark'
                    : 'justChat justChatlight'}>
                    JustChat

                </h1 > <div
            className={isdark
            ? 'recentChat recentChatdark'
            : 'recentChat'}
            style={{
            display: divView(0),
            color: isdark
                ? 'white'
                : 'black'
        }}>

            {recentList && recentList.map(msg => <RecentList recent={msg} onNameChange={e => setchatIdchat(e)}/>)}
        </div> < div
        className = "addFriend"
        style = {{
                    display: divView(1)
                }} > <div className="InputSearch">
            <div className="addFriendInput">
                <div className="input-group">
                    <div className="form-outline">

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Search by Email"
                            value={searchFriend}
                            onChange={(e) => setsearchFriend(e.target.value)}
                            style={{
                            color: isdark
                                ? 'white'
                                : 'black'
                        }}/>
                    </div>
                </div>
            </div>
            <div
                className={!isdark
                ? 'addFriendSearch materialiconhdark'
                : 'addFriendSearch'}>
                <span className="material-icons" onClick={AddFriendfunc}>
                    search
                </span>
            </div>
        </div> < div
        className = {
            isdark
                ? 'addfriendList addfriendListdark'
                : 'addfriendList'
        } > {
            showaddfriendList
                ? <AddFriendList value={searchFriend}/>
                : <div></div>
        } </div>
                </div > <div
            className="createRoom "
            style={{
            display: divView(2)
        }}>
            <div className="InputSearch">
                <div className="">

                    <div className="addFriendInput">
                        <div className="input-group">
                            <div className="form-outline">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Group Name"
                                    value={createGroup || ''}
                                    style={{
                                    color: isdark
                                        ? 'white'
                                        : 'black'
                                }}
                                    onChange={(e) => setcreateGroup(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div
                        className={!isdark
                        ? 'addFriendSearch materialiconhdark'
                        : 'addFriendSearch'}>
                        <span className="material-icons" onClick={CreateGroupfunc}>
                            add
                        </span>
                    </div>
                </div>

            </div>

        </div> < div
        className = {
            isdark
                ? 'groupList groupListdark'
                : 'groupList'
        }
        style = {{
                    display: divView(3)
                }} > {
            groupLiSt && groupLiSt.map(msg => <GroupListName  group={msg} groupClick={e => setgroupIdchat(e)}/>)
        } </div>
                <div
                    className={isdark
                    ? 'selfInfo selfInfodark '
                    : 'selfInfo selfInfolight materialiconhdark'}>
                    <p><img src={Image} alt={Name}/> {
            Name
        } < span
        className = "material-icons userSetting"
        data-tip = "Manage Account"
        onClick = {
            (e) => changeDivval(4)
        } > manage_accounts </span>

                    </p> </div> <div
        className = "manageAccount "
        style = {{
                    display: divView(4)
                }} > 
                
                <div className="form-outlineImage">
                     <img src={Image || '/image/undraw_male_avatar_323b.svg'} className="img-circle"/>
                <label id="pict" style={{display:'none'}}>
                       <img src={Image} className="img-circle"/>

                        <input
                            type="file"
                            name="image"
                            class="image"
                            id="picture"
                            onChange={(event) => onChangeprofileImage(event.target.files[0] || null)}
                           />
                    </label>
               
                    
             <Modal
                isOpen={CropImagemodalIsOpen}
            onRequestClose={e => CropImgcloseModal()}
                style={customStyles}
                contentLabel="Example Modal">

                <div className="welcomeMsg text-center">
                <Cropper
      image={Image}
      crop={crop}
      zoom={zoom}
      aspect={4 / 3}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
    />
               
                    <button className="btn btn-default" onClick={e => CropImgcloseModal()}>Close</button>
                </div>

            </Modal>
             </div>

            

{!saveButton ?<span class="material-icons" 
                style={{float:'right', cursor:'pointer'}}  
                data-tip = "Edit Info" 
                 onClick={() =>setsaveButton(saveButton => !saveButton) }>
                  edit
               </span> :<span class="material-icons"  
                style={{float:'right', cursor:'pointer'}}  
                data-tip = "Cancel" 
                 onClick={() =>setsaveButton(saveButton => !saveButton) }>
                 highlight_off
               </span>}
                
               

                < div className = "form-outline" > 
                     {!saveButton ? <><label>Name</label> <p className="userifo">{Name}</p> </>: <> <label>Name</label> < input
        type = "text"
        className = "form-control"
       
        value = {username }
        onChange = {
            (e) => setusername(e.target.value)
        }
        style = {{
                            color: isdark
                                ? 'white'
                                : 'black'
                        }}/>
                     </>}
                     </div >
                    <div className="form-outline">
            <label>Email</label>
            <p className="userifo">{Email}</p>
        </div> < div className = "form-outline" > 
        
        {!saveButton ? <><label>Status</label> <p className="userifo">{Status}</p> </>: <><label>Status</label> < input
        type = "Status"
        className = "form-control"
        placeholder = "Status"
        value = {
            userAccountstatus || ''
        }
        style = {{
                            color: isdark
                                ? 'white'
                                : 'black'
                     }}
                     
                     onChange = {
                        (e) => setuserAccountstatus(e.target.value)
                    }/>
                     </>}
        


                    </div > {
            saveButton
                ? <button className="btn btn-default btn-save" onClick={saveUSerInfo}>Save Change</button>
                : <div></div>
        } </div>

            </div > <div
            className={isdark
            ? 'chatSectiondark chatSection'
            : 'chatSectionlight chatSection'}>
            {!GroupchatName
                ? !chatName
                    ? <div
                            className={isdark
                            ? 'chatImage chatImagedark'
                            : 'chatImage '}>
                            <img src="/image/undraw_quick_chat_re_bit5.svg" alt="logo"/>
                            <div className="scanlines"></div>
                            <p>Start a Conversation</p>
                        </div>
                    : <Chatbox id={chatName}/>
                : <GroupChatbox id={GroupchatName}/>}

        </div> < div
        className = {
            !openFriendsection
                ? isdark
                    ? 'friendSectiondark friendSection'
                    : 'friendSectionlight friendSection' : isdark
                        ? 'friendSectiondark friendSectionres'
                        : 'friendSectionlight friendSectionres'
        } > <div
            className='friendName text-center'
            style={{
            color: isdark
                ? 'white'
                : 'black'
        }}>
            <p style={{
                textAlign: 'center'
            }}>Friend List</p>
            <hr></hr>
          

            {friendLiSt && friendLiSt.map(msg => <FriendList  message={msg} onNameChange={e => setchatIdchat(e)}/>)}

        </div> </div></>
}

        </div>

    )
}


function FriendList(props) {
    var empty = 0;
    const handleInputChange = useCallback(event => {
        props.onNameChange(event)
    }, [props.onNameChange])

    var [friendLiStname,
        loading] = useObjectVal(db.ref('UserAccount/' + props.message.id));
    if (!loading) {
        var {Image, Name, id} = friendLiStname;
        if (id == null) 
            empty = 1;
        }
    
    return (<> {
        empty
            ? <p className="nouser">Add Friend to your List</p>
            : <p><img src={Image || '/image/undraw_male_avatar_323b.svg'} alt={Name} onClick={(e) => handleInputChange(id)}/>
                    <span className="rersName">{Name}</span>
                </p>
    } </>)

}
var playren = 0;
function RecentList(props) {
    let myAudioElement = new Audio('/image/hey-im-here-too-147.mp3');
    const [play] = useSound('/image/hey-im-here-too-147.mp3');
    const addfriendtoList = (event) => {

        var user = db.ref("UserAccount/" + localStorage.getItem('justchatUser') + '/FriendList')
 user.child(id).update({id})
}
var notification=false;
var [noti1 ,load12] = useObjectVal(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/ChatNotification/'+props.recent.id+'/id'));
if(!load12)
{
    if(noti1)
     {notification = true;
        if(playren > 0 ){
            if(noti1 != chatidname){
                //play()
               // myAudioElement.play()
                
             }
        }
     
    }
     else
     notification=false;
     playren= 1;
}


//var [noti1music ,load] = useObjectVal(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/ChatNotification/'+props.recent.id+'/music'));
var empty = 0,
    freindpresent = 1;
const handleInputChange = useCallback(event => {
    props.onNameChange(event)
}, [props.onNameChange])

var [recentLiSt1name,loading] = useObjectVal(db.ref('UserAccount/' + props.recent.id));
if (!loading) {
    var {Image, Name, id} = recentLiSt1name;
    if (id == null) 
        empty = 1;
    freindpresent = 1
    var checkfriend = db.ref("UserAccount/" + localStorage.getItem('justchatUser') + '/FriendList/' + recentLiSt1name.id)
    checkfriend.once('value', snap => {
        if (!snap.val()) {
            freindpresent = 0;
        } else {
            freindpresent = 1;
        }
    })
}

return ( <> {
    empty
        ? <p className="nouser">No Recent Chat</p>
        : <div
                className="recentNameImgName"
                style={{
                whiteSpace: 'nowrap',
                cursor: 'pointer'
            }}
                onClick={(e) => handleInputChange(id)}>
                <div style={{
                    display: 'inline'
                }}>
                    <img src={Image || '/image/undraw_male_avatar_323b.svg'} alt={Name}/>
                </div>
                <div
                    className="text"
                    style={{
                    display: 'inline',
                    whiteSpace: 'nowrap'
                }}>{Name} {!freindpresent
                        ? <><span className="material-icons add" onClick={addfriendtoList}>
                                add
                            </span></>
                        : <></>}{notification?<span class="material-icons add blinkspan" style={{fontSize:'15px',color:'yellow',marginTop:'15px'}}>
                        mark_chat_unread
                 </span> : <></>} </div>
            </div>
} </>
    )
}


/* Add Friend Function */
var userShow = 0;
var load = 0,
    error = 2;

function AddFriendList(props) {
var present = 0;
    const addfriendtoList = (event) => {

        var user = db.ref("UserAccount/" + localStorage.getItem('justchatUser') + '/FriendList')
 user.child(id).update({id})

//alert("It's ok now!");

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
const [checkFriend,
checkLoading] = useListVals(db.ref('UserAccount/' + localStorage.getItem('justchatUser') + '/FriendList/' + addfriendLiStv))
if (!checkLoading) 
if (checkFriend.length === 0) 
    present = 1;
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
        : <li><img src={Image || '/image/undraw_male_avatar_323b.svg'} alt={Name}/> {Name}

                {localStorage.getItem('justchatUser') !== addfriendLiStv
                    ? present === 1
                        ? <span className="material-icons add" onClick={addfriendtoList}>
                                add
                            </span>
                        : <></>
                        : <div></div >}
            </li>
} </>
  )

}

function GroupListName(props)
{
    var empty = 0;
    const handleInputChange = useCallback(event => {
        props.groupClick(event)
    }, [props.groupClick])
    if(props.group.id === '')
    {
        empty = 1
    }
    else{
        empty = 0
        var {GroupName,Groupid,GroupImage} = props.group
    }
//console.log(props.group)
   
    return ( <>{empty ? <li className="text-center">No Group</li > : <li onClick={(e) => handleInputChange(Groupid)}><img src={GroupImage} alt={GroupName}/> {GroupName
}
</li>
} </>
)

}

export default Mainbody