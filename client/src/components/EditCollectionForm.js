import React, { useEffect, useState } from 'react';

export default function EditCollectionForm(props) {

    let collection = {name: ""};

    async function retrieveCollection() {
        const res = await fetch(`/collections/${props.id}`);
        collection = await res.json();
        if (collectionFeeds === [] && collection.feeds) setCollectionFeeds(collection.feeds);
        if (collectionName && collection.name !== collectionName) console.log("change the name in the database");
    }

    useEffect(() => {
        retrieveCollection();
    }, []);

    const [collectionName, setCollectionName] = useState(collection.name)
    const [collectionFeeds, setCollectionFeeds] = useState([])
    const [currentResults, setCurrentResults] = useState([])
    const [newFeed, setNewFeed] = useState([]);

    const updateCollectionFeeds = async feed => {
        const rest = await fetch(`/collections/${props.id}/addfeed`,
                                  { method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(feed) });
        setCollectionFeeds([...collectionFeeds, feed])
    }

    return <>
    <form className="edit-collection-form">
        <input type="text" value={collectionName} placeholder="Collection name" name="name" onChange={e => {
            setCollectionName(e.target.value);
        }}></input>

        <input type="text" value={newFeed} name="url" placeholder="Enter URL" onChange={e => {
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
                    <img src={feed.favicon} /> <span className="feed-name">{feed.title}</span> <button onClick={() => updateCollectionFeeds(feed)}>Add to collection</button>
                </div>
            })}
        </div>
    </form>
    </>
}
