import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import './Popup.css';
import Header from './header/header'
import Account from './accounts/index'

const Popup = () => {
    return (
        <div className="popup">
            <Router>
                <Header />
                <div className="content">
                    <Switch>
                        <Route path="/account" component={Account} />
                        <Route path="/assets">Assets</Route>
                        <Route path="/activity">Activity</Route>
                        <Route path="/">
                            <Redirect to="/account/home" />
                        </Route>
                    </Switch>
                </div>
            </Router>

        </div>
    )
}

export default Popup;
