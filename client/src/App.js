import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import UserList from './components/UsersList';
import Login from './components/Login';
import Register from './components/Register';
import CollectionView from './components/CollectionView';
import EditCollectionForm from './components/EditCollectionForm';


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
                    <li><NavLink to="/" exact activeclass="active">Home</NavLink></li>
                    {user ? <li><NavLink to="/login" activeclass="active">Log in</NavLink> or <NavLink to="/register" activeclass="active">Register an account</NavLink></li> : <></>}
                </ul>
            </nav>
            <Switch>
                <Route path="/users">
                    <UserList />
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/register">
                    <Register />
                </Route>

                <Route path="/">
                    <div className="main-container">
                        <div className="sidebar">
                            <div className="sidebar-box">
                                <h4>Collections</h4>
                            </div>
                        {myCollections.map(collection => <div key={collection.id} className="collection-option">
                                <span onClick={() => {
                                    setCurrentView(<CollectionView id={collection.id} />);
                                }}>{collection.name}</span> <span className="edit-button" onClick={() => {
                                setCurrentView(<EditCollectionForm id={collection.id} />)
                                }}>(edit)</span>
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
