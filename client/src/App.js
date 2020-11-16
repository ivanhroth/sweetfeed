import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink, useHistory, Redirect } from 'react-router-dom';
import Login, { SWEETFEED_JWT_TOKEN } from './components/Login';
import Register from './components/Register';
import CollectionView from './components/CollectionView';
import EditCollectionForm from './components/EditCollectionForm';


function App() {

    const history = useHistory();

    const getUserFromToken = token => token ? JSON.parse(atob(token.split('.')[1])) : { id: 0, username: "" };

    const [user, setUser] = useState({ id: 0 });
    const [myCollections, setMyCollections] = useState([{name: "", feeds: [], id: 0}]);
    const [currentCollectionId, setCurrentCollectionId] = useState(0);
    const [currentView, setCurrentView] = useState(<></>);

    const retrieveCollections = async () => {
        if (myCollections[0].name === "") {
            const res = await fetch(`/api/users/${user.id}/collections`);
            const collections = await res.json();
            setMyCollections(collections);
        }
    }

    const retrieveUser = async () => {
            const tokenParsed = getUserFromToken(localStorage.getItem(SWEETFEED_JWT_TOKEN))
            const res = await fetch(`/api/users/${tokenParsed.identity}`);
            console.log(res);
            if (res.status === 500) setUser({...user, triedRetrieving: true})
            const currentUser = await res.json();
            setUser(currentUser);
            return {};
    }

    const logOut = () => {
        localStorage.removeItem(SWEETFEED_JWT_TOKEN);
        setUser({});
        setCurrentCollectionId(0);
        setCurrentView(<></>);
    }

    useEffect(() => {
        if (user.id === 0){
            const retrieveUserResult = retrieveUser();
            if (retrieveUserResult.error) history.push('/login');
        } else {
            retrieveCollections();
        }
    }, [user.id])

    console.log(user);

    return (
        <BrowserRouter>
            <nav>
                <ul>
                    <li><NavLink to="/" exact activeclass="active">Home</NavLink></li>
                    {!user.id ? <li><NavLink to="/login" activeclass="active">Log in</NavLink> or <NavLink to="/register" activeclass="active">Register an account</NavLink></li> : <li><NavLink to='/login' activeclass='active' onClick={logOut}>Log out</NavLink></li>}
                </ul>
            </nav>
            <Switch>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/register">
                    <Register />
                </Route>

                <Route path="/">
                    {(user.id === 0 && user.triedRetrieving) ? <Redirect to='/login' /> : <></>}

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
