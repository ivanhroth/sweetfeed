import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import UserList from './components/UsersList';
import Login from './components/Login';
import CollectionView from './components/CollectionView';


function App() {

    const [user, setUser] = useState({})
    const [myCollections, setMyCollections] = useState([{name: "", feeds: [], id: 0}]);
    const [currentCollectionId, setCurrentCollectionId] = useState(0);
    const [currentView, setCurrentView] = useState(<></>);

    const retrieveCollections = async () => {
        if (myCollections[0].name === "") {
            //const res = await fetch(`/users/${user.id}/collections`);
            const res = await fetch(`/api/users/1/collections`); // for testing purposes only
            const collections = await res.json();
            setMyCollections(collections);
        }
    }

    useEffect(() => {
        retrieveCollections();
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
                    <div className="main-container">
                <div className="sidebar">
                    <div className="sidebar-box">
                        <h4>Collections</h4>
                    </div>
                    {myCollections.map(collection => <div key={collection.id} className="collection-option">
                        <button onClick={() => {
                        setCurrentView(<CollectionView id={collection.id} />);
                    }}>{collection.name}</button>
                    </div>)}
                </div>
                <div className="viewer-container">
                    {currentView}
                </div>
            </div>
                </Route>
            </Switch>
        </BrowserRouter>
  );
}

export default App;
