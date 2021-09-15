import "./App.css";
import Navbar from "./FlixComponents/Navbar/Navbar";
import Footer from "./FlixComponents/Footer/Footer";
import Discover from "./FlixComponents/Discover";
import MyList from "./FlixComponents/MyList/MyList";
import SearchModel from "./FlixComponents/Navbar/SearchModel";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Popup from "./FlixComponents/PopupInfo/Popup";
import Display from "./FlixComponents/Display/Display";
import Play from "./FlixComponents/Play/Play";
import SignUp from "./FlixComponents/Sign/SignUp";
import UserContextProvider from "./Context/userContext";
import PrivateRoute from "./FlixComponents/PrivateRoute";
import { isGuest, localStorageRetrieve } from "./utilities";
import { UserContext } from "./Context/userContext";


function App() {
  // const context = useContext(UserContext);
  const [isSearchActive, setSearchStatus] = useState(false);
  const [popup, setPopup] = useState(null);
  let title = " - CFlix";
  function changeSearchStatus() {
    setSearchStatus(!isSearchActive);
  }

  return (
    <Router>
        <UserContextProvider>
      <div className="app">
          <Popup callback={setPopup} show={popup} />
          <Navbar callback={changeSearchStatus} />
        
        <SearchModel
          callback={{
            changeSearchStatus: changeSearchStatus,
            popupCallback: setPopup,
          }}
          isActive={isSearchActive}
        />

        <Switch>
        <Route exact path="/">
            <SignUp title={`Sign in${title}`} />
          </Route>
          <PrivateRoute exact path="/Discover">
            <Discover title={`Discover${title}`} setPopup={setPopup} />
          </PrivateRoute>
          <PrivateRoute exact path="/MyList">
              <MyList
                callback={{
                  popupCallback: setPopup,
                }}
                title={`MyList${title}`}
              />
          </PrivateRoute>
          <PrivateRoute exact path="/Display/:type">
            <Display title={`More${title}`} setPopup={setPopup} />
          </PrivateRoute>
          <PrivateRoute exact path="/Play/:id/:type">
            <Play
              callback={{
                popupCallback: setPopup,
              }}
              title={`Play${title}`}
            />
          </PrivateRoute>
          <Route path='/admin' component={() => { 
              window.location.href = 'https://localhost:3000/admin'; 
              return null;
          }}/>
          <Route exact={true} component={SignUp} />

        </Switch>
        <Footer />
      </div>
      </UserContextProvider>
    </Router>
  );
}

export default App;
