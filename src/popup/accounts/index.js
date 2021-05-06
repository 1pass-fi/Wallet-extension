import React from 'react';
import './index.css';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import AccountHome from './accountHome'
import AccountImport from './accountImport'

const Account = () => {
    return (
        <Switch>
            <Route path="/account/home">
                <AccountHome />
            </Route>
            <Route path="/account/import">
                <AccountImport />
            </Route>
        </Switch>
    )
}

export default Account;
