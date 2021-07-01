import React, {useState, useCallback} from 'react';
import ReactTooltip from 'react-tooltip';
import Compressor from 'compressorjs';
import firebase from 'firebase/app';
import './manageaccount.css'
import 'firebase/database';
import config from '../firebasesdk/config'
//import 'firebase/firestore';
import 'firebase/analytics';
import {useListVals, useObjectVal} from 'react-firebase-hooks/database';

const db = firebase.database();
function ManageAccount() {
    const [userInfo,loading] = useObjectVal(db.ref('UserAccount/' + localStorage.getItem('justchatUser')));
    if (!loading) 
        var {Name, Email, Image}
    = userInfo;

    return (
        <div className="accountBody">

            <div className="accountContent">
                
                <p><img src={Image} alt={Name} /> {Name}

                <span class="material-icons">
                     edit
                </span>
               </p>

            </div>
        </div>
    )
}

export default ManageAccount