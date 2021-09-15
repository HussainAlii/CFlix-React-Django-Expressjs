import React from 'react'
import  './Footer.css'
import Grid from "@material-ui/core/Grid"
import themoviedb from "../Icons/themoviedb.jpg"
function Footer() {
    return (
        <footer>
            <div className="container">
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h4>My Email: HussainAAlmubarak@hotmail.com</h4>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <p>FAQ</p>
                        <p>Investor Relations</p>
                        <p>Ways to Watch</p>
                        <p>Corporate Information</p>
                        <p>Only on CFlix</p>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <div style={{display: "inline-block"}}>
                        <p>Help Center</p>
                        <p>Jobs</p>
                        <p>Terms of Use</p>
                        <p>Contact Us</p>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <p>Account</p>
                        <p>Redeem Gift Cards</p>
                        <p>Privacy</p>
                        <p>Speed Test</p>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <p>Media Center</p>
                        <p>Buy Gift Cards</p>
                        <p>Cookie Preferences</p>
                        <p>Legal Notices</p>
                    </Grid>
                
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <p style={{cursor:"context-menu"}}>CFlix Saudi Arabia</p>
                    </Grid>

                    <Grid style={{marginTop:"50px"}} items xs={4} sm={4} md={4} lg={4} xl={4}>
                            <a target="_blank" href="https://www.themoviedb.org/"><img width={"150px"} height={"150px"} src={themoviedb} /></a>
                            <p>The Movie Database API is used In This Project To Retrieve Movies and Tv shows Detailed Info</p>
                    </Grid>

                </Grid>
                <div className="spacing"/>
            </div>
        </footer>
    )
}

export default Footer

