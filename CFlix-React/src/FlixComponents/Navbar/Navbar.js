import React, { useState, useEffect, useContext  } from "react";
import "./Navbar.css";
import { MenuItems } from "./MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import logo from "../Icons/CFlix.png";
import avatar from "../Icons/CFlix-avatar.png";
import languageIcon from "../Icons/language.svg";
import logoutIcon from "../Icons/logout.svg";
import profileIcon from "../Icons/profile.svg";
import searchIcon from "../Icons/search_icon.svg";
import notificationIcon from "../Icons/notification_Icon.svg";
import { NavLink, Link, useHistory } from "react-router-dom";
import { Badge } from "@material-ui/core";
import { UserContext } from "../../Context/userContext";
import { localStorageRetrieve, localStorageStore, refresh, logout } from "../../utilities";
import { translateNavbar } from "../../translate";

function Navbar({ callback}) {
  const [showBar, setShowBar] = useState(false);
  const context = useContext(UserContext)
  
  useEffect(() => {
    window.addEventListener("scroll", () => handleNavigation());

    return () => {
      // return a cleanup function to unregister our function since its gonna run multiple times
      window.removeEventListener("scroll", () => handleNavigation());
    };
  }, []);

  const handleNavigation = () => {
    if (window.scrollY > 100) {
      setShowBar(true);
    } else {
      setShowBar(false);
    }
  };

  return (
    <nav className={`${showBar ? "black" : ""}`}>
      <Link to="/">
        <img className="logo" src={logo} alt="CFlix logo" />
      </Link>
      {localStorageRetrieve("isAuth") && <>
      <ul className="nav-menu">
        {MenuItems.map((item) => {
          return (
            <li>
              <NavLink
                exact
                activeClassName="active"
                onlyActiveOnIndex
                to={item.url}
              >
                {item.title}
              </NavLink>
            </li>
          );
        })}
      </ul>
      </>}
      <Language/>
      {localStorageRetrieve("isAuth") && <>
      <SearchBar callback={callback} />
      {/* <Notification setNotificationCount={context.notification.setNotification} notificationCount={context.notification.notification?.length} /> */}
      <Account />
      </>}
    </nav>
  );
}

function Notification({setNotificationCount, notificationCount}) {
  const [notificationOpened, setNotificationOpened] = useState(false)
  return (
    <>
    <div className="notification">
      <Badge
        style={{ marginTop: "30px" }}
        color="secondary"
        badgeContent={notificationCount}
      >
        <img
          onClick={() => {
            setNotificationCount([]);
            setNotificationOpened(true)
          }}
          className="navIcon"
          src={notificationIcon}
          alt="Notification"
        />
      </Badge>
    </div>
    </>
  );
}

function SearchBar({ callback }) {
  return (
    <div className="searchBar">
      <img
        onClick={() => {
          callback();
        }}
        className="navIcon"
        src={searchIcon}
        alt="searchbar"
      />
    </div>
  );
}

function Account() {
  const context = useContext(UserContext)
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  

  return (
    <>
    <div className="avatar">
    <img
        onClick={handleClick}
        src={context.userInfo.userInfo?.photoURL? context.userInfo.userInfo?.photoURL : avatar}
        alt="avatar icon"
      />     
    </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled style ={{backgroundColor:"#222222", color:"white", cursor:"default"}}><img style={{marginRight:"10px", width:"30px", height:"30px"}} src={context.userInfo.userInfo?.photoURL? context.userInfo.userInfo?.photoURL : avatar}/>{context.userInfo.userInfo?.displayName} </MenuItem>
        <hr style={{border: "2px solid red"}} />
        <MenuItem style ={{backgroundColor:"#222222", color:"white"}} onClick={()=>{handleClose(); logout();}}><img style={{marginRight:"10px"}} src={logoutIcon}/>{translateNavbar().SignOut}</MenuItem>
      </Menu>
    </>
  );
}

function Language() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function setLanguage(lang){
    localStorageStore("language", lang)
  }

  return (
    <>
    <div className="language">
    <img
        onClick={handleClick}
        src={languageIcon}
        alt="avatar icon"
      />     
    </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem disabled style ={{backgroundColor:"#222222", color:"white", cursor:"default"}}>
          <img src={languageIcon} style={{marginRight:"4px"}} /> {translateNavbar().language} </MenuItem>
        <hr style={{border: "2px solid red"}} />
        {(localStorageRetrieve("language") == "en-US" || localStorageRetrieve("language") == null)?<MenuItem disabled style ={{backgroundColor:"#222222", color:"white", cursor:"default"}}>English - EN</MenuItem>:
        <MenuItem  style ={{backgroundColor:"#222222", color:"white"}} onClick={()=>{setLanguage('en-US'); handleClose(); refresh(1);}}>English - EN</MenuItem>}
        <hr/>
        {localStorageRetrieve("language") == "ar"? <MenuItem disabled style ={{backgroundColor:"#222222", color:"white", cursor:"default"}}>اللغة العربية - AR</MenuItem>:
        <MenuItem style ={{backgroundColor:"#222222", color:"white"}} onClick={()=>{setLanguage('ar'); handleClose(); refresh(1);}}>اللغة العربية - AR</MenuItem>}
      </Menu>
    </>
  );
}

export default Navbar;
