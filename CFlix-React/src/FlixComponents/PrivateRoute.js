import React from 'react'
import { Redirect, Route } from 'react-router'
import { isGuest, localStorageRetrieve } from '../utilities'

function PrivateRoute({ children, ...rest }) {
    return (
        <Route
        {...rest}
        render = {props =>{
            if(localStorageRetrieve("isAuth")){
                if(isGuest()) return children
                else if(localStorageRetrieve('session_id') != null) return children //is user
                else return <Redirect to="/"/>
            }
            else return <Redirect to="/"/>
        }}
        ></Route>
    )
}

export default PrivateRoute
