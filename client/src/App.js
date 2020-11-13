import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import UserList from './components/UsersList';
import Login from './components/Login';


function App() {

    const [user, setUser] = useState({})
    const [myCollections, setMyCollections] = useState([{name: "", feeds: [], id: 0}]);

    useEffect(async () => {
        if (myCollections[0] === {}) {
            const res = await fetch(`/users/${user.id}/collections`);
            const collections = await res.json();
            setMyCollections(collections);
        }
    })

    return (
        <BrowserRouter>
            <nav>
                <ul>
                    <li><NavLink to="/" activeclass="active">Home</NavLink></li>
                    <li><NavLink to="/users" activeclass="active">Users</NavLink></li>
                </ul>
            </nav>
            <Switch>
                <Route path="/users">
                    <UserList />
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/">
                    <h1>My Home Page</h1>
                    <div class="main-container">
                <div class="sidebar">
                    <div class="sidebar-box">
                        <h4>Collections</h4>
                    </div>
                    {myCollections.map(collection => <div key={collection.id}><h4>{collection.name}</h4>
                    <div>{collection.feeds.map(feed => <></>)}</div>
                    </div>)}
                </div>
                <div class="viewer-container">
                </div>
            </div>
                </Route>
            </Switch>
        </BrowserRouter>
  );
}

export default App;
