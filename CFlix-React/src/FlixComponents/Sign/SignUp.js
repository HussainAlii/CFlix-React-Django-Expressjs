import React, { useState, useEffect, useContext } from "react";
import background from "../Icons/background.jpg"
import logo from "../Icons/CFlix.png";
import googleColored from "../Icons/google_colored.png";
import googleGrayscale from "../Icons/google_grayscale.png";
import guest from "../Icons/guest.gif";
import {googleProvider} from "../../config/authProviders"
import {authentication} from "../../auth/auth"
import "./SignUp.css"

import { useHistory } from "react-router-dom";
import { localStorageStore, refresh } from "../../utilities";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {login} from "../../requests"

import { UserContext } from "../../Context/userContext";

import { localStorageRetrieve } from "../../utilities";
import { popupLoginWarning, translateLoginPage } from "../../translate";

function SignUp() {
    const context = useContext(UserContext)
    const history = useHistory();

    const [mouseOverGoogle, setMouseOverGoogle] = useState(false)
    const [mouseOverGuest, setMouseOverGuest] = useState(false)

    const [open, setOpen] = React.useState(false);
    const [openGuest, setOpenGuest] = React.useState(false);
    const [message, setMessage] = React.useState(null);

    const handleClose = () => {
      setOpen(false);
    };

    const handleCloseGuest = () => {
      setOpenGuest(false);
    };

    async function handleProvider(provider){
      const res = await authentication(provider)
      if(res.uid && res.email){
         await login({uid:res.uid , email:res.email, displayName:res.displayName,photoURL:res.photoURL })
      }else{
        setMessage(res.message)
        setOpen(true);
      }
      
    }

    function handleGuest(){
      handleCloseGuest()
      context.loadGuestData()
      // if(!localStorageRetrieve("isNew") == true)
      //   context.pushNotification({
      //         id: 1,
      //         from: "CFlix",
      //         title: "Welcome!",
      //         message: "Welcome to CFlix!",
      //       },)
      localStorageStore("isAuth", true)
      localStorageStore("isNew", false)
      localStorageStore("uid", "guest")
      history.push("/Discover");
    }

    useEffect(async () => {
      if(localStorageRetrieve("isAuth")){
          history.push("/Discover");
      }
            
    },[]);

    return (
      <>
      {openGuest&&<AlertDialog action={handleGuest} open={openGuest} handleClose={handleCloseGuest} message={popupLoginWarning().message} title={popupLoginWarning().title}/>}
      <AlertDialog open={open} handleClose={handleClose} message={message} title={"Error!"}/>
        <div className="signup">
            <div className="overlay-sign"/>
            <img className="background" src={background} alt="showcase"/>
        
            <div className="sign-content">
                <img className="sign-logo" src={logo} alt="CFlix logo" />
                {translateLoginPage().header}
                <button onClick={()=>handleProvider(googleProvider)} className={mouseOverGoogle? "sign-button-google-hover sign-button" : "sign-button sign-button-google" } onMouseLeave={(e)=>{setMouseOverGoogle(false)}} onMouseOver={(e)=>{setMouseOverGoogle(true)}}>
                {mouseOverGoogle? 
                (
                //mouse is over
                <> 
                <img className="google-logo-colored" src={googleColored}/>
                </>
                ):
                (
                // mouse left
                <> 
                <img className="google-logo" src={googleGrayscale}/><p className="sign-button-desc">{translateLoginPage().googleButton}</p>
                <div></div>
                </>
                )}
              </button>

              <button onClick={()=>setOpenGuest(true)} className="sign-button sign-button-guest" onMouseLeave={(e)=>{setMouseOverGuest(false)}} onMouseOver={(e)=>{setMouseOverGuest(true)}}>
                {!mouseOverGuest&&<span/>}
                <img className={`guest ${!mouseOverGuest&&"stop-animate-guest"}`} src={guest}/><p className="sign-button-desc-guest">{translateLoginPage().guestButton}</p><div/>
              </button>
              <div class="description">
                {translateLoginPage().description}
              </div>
            </div>
        </div>
        </>
    )
}

export default SignUp

export function AlertDialog({action=null, open, handleClose, message, title}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{backgroundColor:"#334",color:"lightgray"}} id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent style={{backgroundColor:"#334"}}>
          <DialogContentText style={{color:"darkgray"}} id="alert-dialog-description">
            <div dangerouslySetInnerHTML={{__html: message}}></div>

          </DialogContentText>
        </DialogContent>
        <DialogActions style={{backgroundColor:"#334"}}>
          <Button onClick={action?action:handleClose} style={{color:"white"}} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}