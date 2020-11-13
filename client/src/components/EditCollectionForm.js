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
    });

    const [collectionName, setCollectionName] = useState(collection.name)
    const [collectionFeeds, setCollectionFeeds] = useState([]) //should use the current list of feeds associated with that collection
    const [currentResults, setCurrentResults] = useState([])
    const [newFeed, setNewFeed] = useState([]);

    const updateCollectionFeeds = feed => {
        // add the feed to the collection in the database
        setCollectionFeeds([...collectionFeeds, feed])
    }

    //https://feedsearch.dev/api/v1/search?url
    return <>
    <form>
        <label for="name">Collection name</label>
        <input type="text" value={collectionName} name="name" onChange={e => {
            setCollectionName(e.target.value);
        }}></input>

        <input type="text" value={newFeed} onChange={e => {
            setNewFeed(e.target.value)
        }}></input><button onClick={async e => {
            e.preventDefault();
            const searchRes = await fetch(`/feedsearch/${newFeed}`);
            const resultsObj = await searchRes.json();
            const results = resultsObj.feeds;
            if (results) setCurrentResults(results);
            else setCurrentResults([]);
        }}>Search feeds</button>
        <div class="feed-results">
            {currentResults.map(feed => {
                return <div class="feed-result">
                    <img src={feed.favicon} /> <span class="feed-name">{feed.title}</span>
                </div>
            })}
        </div>
    </form>
    </>
}
