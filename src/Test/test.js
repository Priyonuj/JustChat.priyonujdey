import React, {useState, useCallback, useEffect} from 'react';
import ReactTooltip from 'react-tooltip';
import firebase from 'firebase/app';
import 'firebase/database';

import 'firebase/firestore';
import 'firebase/analytics';
import {useListVals,useList, useObjectVal} from 'react-firebase-hooks/database';
import { useCollectionData,useDocumentData } from 'react-firebase-hooks/firestore';
import Tour from 'reactour'
import Modal from 'react-modal';
import Cropper from 'react-easy-crop'

import useSound from 'use-sound'
import { render } from '@testing-library/react';

firebase.initializeApp({
    apiKey: "AIzaSyA7HAuoJ7xAs42ATD5ExrKrf6f1JTascrs",
    authDomain: "justchat-b28c7.firebaseapp.com",
    databaseURL: "https://justchat-b28c7-default-rtdb.firebaseio.com",
    projectId: "justchat-b28c7",
    storageBucket: "justchat-b28c7.appspot.com",
    messagingSenderId: "893721470873",
    appId: "1:893721470873:web:fb8ea01ee608166f601508",
    measurementId: "G-RK2GT4BB4R"
  })

  const firestore = firebase.firestore();
const db = firebase.database();

function Test() {
    const [value, loading, error] = useDocumentData(firestore.collection('User').doc(localStorage.getItem('justchatUser')));
    console.log(value)

 return(
     
     <div>
         <h1>hello</h1>
     </div>

    )
}




export default Test