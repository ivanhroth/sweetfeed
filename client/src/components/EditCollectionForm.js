import React, { useEffect, useState } from 'react';

export default function EditCollectionForm(props) {

    let collection = {name: ""};

    //const retrieveCollection =

    useEffect(() => {
        async function retrieveCollection() {
            const res = await fetch(`/collections/${props.id}`);
            collection = await res.json();
            if (collectionFeeds === [] && collection.feeds) setCollectionFeeds(collection.feeds);
            if (collectionName && collection.name !== collectionName) console.log("change the name in the database");
        }
        retrieveCollection();
    }, []);

    const [collectionName, setCollectionName] = useState(collection.name)
    const [collectionFeeds, setCollectionFeeds] = useState([])
    const [currentResults, setCurrentResults] = useState([])
    const [newFeed, setNewFeed] = useState([]);

    const updateCollectionFeeds = feed => {
        // add the feed to the collection in the database
        setCollectionFeeds([...collectionFeeds, feed])
    }

    return <>
    <form className="edit-collection-form">
        <label htmlFor="name">Collection name</label>
        <input type="text" value={collectionName} name="name" onChange={e => {
            setCollectionName(e.target.value);
        }}></input>

        <label htmlFor="url">Enter URL</label>
        <input type="text" value={newFeed} name="url" onChange={e => {
            setNewFeed(e.target.value)
        }}></input><button onClick={async e => {
            e.preventDefault();
            const searchRes = await fetch(`/feedsearch/${newFeed}`);
            const resultsObj = await searchRes.json();
            const results = resultsObj.feeds;
            if (results) setCurrentResults(results);
            else setCurrentResults([]);
        }}>Add feed</button>
        <div className="feed-results">
            {currentResults.map(feed => {
                return <div className="feed-result" key={feed.id}>
                    <img src={feed.favicon} /> <span className="feed-name">{feed.title}</span>
                </div>
            })}
        </div>
    </form>
    </>
}
