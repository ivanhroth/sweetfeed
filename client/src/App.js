import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, NavLink, useHistory, Redirect } from 'react-router-dom';
import Login, { SWEETFEED_JWT_TOKEN } from './components/Login';
import Register from './components/Register';
import CollectionView from './components/CollectionView';
import EditCollectionForm from './components/EditCollectionForm';
import Intro from './components/Intro';


function App() {

    const history = useHistory();

    const getUserFromToken = token => token ? JSON.parse(atob(token.split('.')[1])) : { id: 0, username: "" };

    const [user, setUser] = useState({ id: 0 });
    const [myCollections, setMyCollections] = useState([{name: "", feeds: [], id: 0}]);
    const [currentCollectionId, setCurrentCollectionId] = useState(0);
    const [currentView, setCurrentView] = useState(<></>);
    const [currentCollectionName, setCurrentCollectionName] = useState("");
    debugger
    const retrieveCollections = async () => {
            debugger
            const res = await fetch(`/api/users/${user.id}/collections`);
            const collections = await res.json();
            setMyCollections(collections);
    }

    const retrieveUser = async () => {
            debugger
            if (!localStorage.getItem(SWEETFEED_JWT_TOKEN)){
                if (!user.triedRetrieving) setUser({...user, triedRetrieving: true});
                return {};
            }
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
        setUser({ id: 0 });
        setCurrentCollectionId(0);
        setCurrentView(<></>);
    }

    useEffect(() => {
        if (user.id === 0){
            debugger
            const retrieveUserResult = retrieveUser();
            if (retrieveUserResult.error) history.push('/login');
        } else {
            debugger
            retrieveCollections();
        }
    }, [user, currentCollectionId, currentCollectionName])

    console.log(user);

    return (
        <BrowserRouter>
            <nav>
                <ul>
                    <li><NavLink to="/" exact activeclass="active"><img className="logo" src="/logo.png" onClick={() => setCurrentView(<Intro />)} /></NavLink></li>
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
                                <div className="collections-header">Collections</div>
                            </div>
                        {myCollections.map(collection =>{
                        if (collection.id !== 0) return (
                        <div key={collection.id} className="collection-option">
                                <span className='collection-name' onClick={() => {
                                    setCurrentCollectionId(collection.id);
                                    setCurrentView(<CollectionView id={collection.id} />);
                                }}>{collection.name}</span> <span className="edit-button" onClick={() => {
                                    setCurrentCollectionId(collection.id);
                                    setCurrentView(<EditCollectionForm id={collection.id} nameSetter={setCurrentCollectionName} />)
                                }}>(edit)</span> <span className="edit-button" onClick={async () => {
                                    const deletedId = collection.id
                                    await fetch(`/collections/${collection.id}/remove`);
                                    setMyCollections(myCollections.filter(c => c !== collection));
                                    if (currentCollectionId === deletedId) setCurrentView(<></>)
                                }}>(remove)</span>
                        </div>)})}
                        <button className="add-collection-button" onClick={async e => {
                            e.preventDefault();
                            const newCollectionRes = await fetch(`/api/users/${user.id}/addcollection`);
                            const newCollection = await newCollectionRes.json();
                            const newId = newCollection.id;
                            setMyCollections([...myCollections, newCollection]);
                            setCurrentView(<EditCollectionForm id={newId} nameSetter={setCurrentCollectionName} />);
                            setCurrentCollectionId(newId);
                        }}>Create a new collection</button>
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
