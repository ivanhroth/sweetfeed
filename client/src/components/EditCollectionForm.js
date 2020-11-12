import React, { useEffect, useState } from 'react';

export default function EditCollectionForm(props) {

    let collection = {name: ""};

    //const retrieveCollection =

    useEffect(() => {
        async function retrieveCollection() {
            const res = await fetch(`/collections/${props.id}`);
            collection = await res.json();
            if (collectionName && collection.name !== collectionName) console.log("change the name in the database");
        }
        retrieveCollection();
    });

    const [collectionName, setCollectionName] = useState(collection.name)
    const [collectionFeeds, setCollectionFeeds] = useState([]) //should use the current list of feeds associated with that collection
    const [currentResults, setCurrentResults] = useState([])
    const [newFeed, setNewFeed] = useState([]);

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
            const searchRes = await fetch(`https://feedsearch.dev/api/v1/search?url=${newFeed}`);
            const results = await searchRes.json();
            setCurrentResults(results);
        }}>Search feeds</button>
        <div class="feed-results">
            {currentResults.map(feed => {
                return <div class="feed-result">
                    <img src={feed.favicon} />
                </div>
            })}
        </div>
    </form>
    </>
}
