import React, { useEffect, useState } from 'react';

export default function EditCollectionForm(props) {

    const [currentResults, setCurrentResults] = useState([])
    const [newFeed, setNewFeed] = useState([]);
    const [collection, setCollection] = useState({name: "", feeds: []});
    const [collectionName, setCollectionName] = useState(collection.name);
    const [collectionFeeds, setCollectionFeeds] = useState(collection.feeds);
    const [collectionPrivate, setCollectionPrivate] = useState(collection.private);
    const [collectionDescription, setCollectionDescription] = useState(collection.description)

    const setCurrentCollectionName = props.nameSetter;

    async function retrieveCollection() {
        const res = await fetch(`/collections/${props.id}`);
        const retrievedCollection = await res.json();
        if (retrievedCollection.id !== collection.id){
            setCollection(retrievedCollection);
            setCollectionFeeds(retrievedCollection.feeds);
            setCollectionPrivate(retrievedCollection.private);
            setCollectionName(retrievedCollection.name);
            setCollectionDescription(retrievedCollection.description);
        }
    }

    useEffect(() => {
        retrieveCollection();
    }, [collection, collectionFeeds, collectionName]);

    const updateCollectionFeeds = async feed => {
        const res = await fetch(`/collections/${collection.id}/addfeed`,
                                  { method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(feed) });
    }

    const updateCollection = async changes => {
        const res = await fetch(`/collections/${collection.id}/update`,
                                {   method: 'PUT',
                                    headers: {
                                        "Content-Type": 'application/json'
                                    },
                                    body: JSON.stringify(changes) });
        const newCollection = await res.json();
        setCollection(newCollection);
        setCurrentCollectionName(newCollection.name);
    }

    console.log(collection);
    console.log(collection.name);
    console.log(collectionFeeds);

    return <>
        <form className="edit-collection-form">
            <div className="collection-name-container">
                <form onSubmit={e => e.preventDefault()}>
                <input type="text" value={collectionName} className="collection-name-field" placeholder="Collection name" name="name" onChange={e => {
                    setCollectionName(e.target.value);
                    updateCollection({ name: e.target.value });
            }}></input>
            </form>
            </div>

            <div className="collection-checkbox-container">
                <span className="collection-checkbox-label">Private?</span>
                <input type="checkbox" checked={collectionPrivate} onChange={e => {
                    setCollectionPrivate(e.target.checked);
                    updateCollection({ private: e.target.checked })
                }} />
            </div>

            <div className="collection-description-container">
                <textarea className="collection-description-field" value={collectionDescription} placeholder="Write a description of your feed collection here!" onChange={e => {
                    setCollectionDescription(e.target.value);
                    updateCollection({ description: e.target.value });
                }} />
            </div>

            {collectionFeeds.map(feed => <div className="feed-list-item collection-option">{feed.name} <button onClick={async e => {
                e.preventDefault();
                await fetch(`/collections/${collection.id}/removefeed/${feed.id}`);
                setCollectionFeeds(collectionFeeds.filter(f => f !== feed));
            }}>remove feed</button></div>)}

            <div className="feed-add-container">
            <input type="text" value={newFeed} name="url" placeholder="Enter feed URL" onChange={e => {
                setNewFeed(e.target.value);
            }}></input><button onClick={async e => {
                e.preventDefault();
                let cleanedURL = newFeed;
                if (cleanedURL.includes('http:') || cleanedURL.includes('https:')) cleanedURL = cleanedURL.split('/').slice(2).join('/');
                const searchRes = await fetch(`/feedsearch/${cleanedURL}`);
                const resultsObj = await searchRes.json();
                const results = resultsObj.feeds;
                if (results) setCurrentResults(results);
                else setCurrentResults([]);
            }}>Find</button>
            <div className="feed-results">
                {currentResults.map(feed => {
                    return <div className="feed-result" key={feed.id}>
                        <img src={feed.favicon} /> <span className="feed-name">{feed.title}</span> <button onClick={e => {
                            e.preventDefault();
                            setCollectionFeeds([...collectionFeeds, {name: feed.title}]);
                            updateCollectionFeeds(feed);
                        }
                            }>Add to collection</button>
                    </div>
                })}
            </div>
            </div>
        </form>
    </>
}
