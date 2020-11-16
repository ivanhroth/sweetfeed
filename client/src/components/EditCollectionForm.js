import React, { useEffect, useState } from 'react';

export default function EditCollectionForm(props) {

    const [collection, setCollection] = useState({name: ""});

    async function retrieveCollection() {
        const res = await fetch(`/collections/${props.id}`);
        const retrievedCollection = await res.json();
        if (retrievedCollection.id !== collection.id){
            setCollection(retrievedCollection);
        }
        if (collectionFeeds === [] && collection.feeds) setCollectionFeeds(collection.feeds);
        if (collectionName && collection.name !== collectionName) console.log("change the name in the database");
    }

    useEffect(() => {
        retrieveCollection();
        if (collectionName === "") setCollectionName(collection.name);
    }, [collection]);

    const [collectionName, setCollectionName] = useState(collection.name)
    const [collectionFeeds, setCollectionFeeds] = useState([])
    const [currentResults, setCurrentResults] = useState([])
    const [newFeed, setNewFeed] = useState([]);

    const updateCollectionFeeds = async feed => {
        const res = await fetch(`/collections/${props.id}/addfeed`,
                                  { method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(feed) });
        // check
        setCollectionFeeds([...collectionFeeds, feed])
    }

    const saveTitle = async title => {
        const res = await fetch(`/`); // TBD
    }

    console.log(collection);
    console.log(collectionName);

    return <>
        <form className="edit-collection-form">
            <div className="collection-name-container"><input type="text" value={collectionName} className="collection-name-field" placeholder="Collection name" name="name" onChange={e => {
                setCollectionName(e.target.value);
            }}></input>
            <button onClick={() => saveTitle(collectionName)}>save title</button>
            </div>

        {collectionFeeds.map(feed => <div>{feed.name}</div>)}

            <input type="text" value={newFeed} name="url" placeholder="Enter URL" onChange={e => {
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
                            updateCollectionFeeds(feed)}
                            }>Add to collection</button>
                    </div>
                })}
            </div>
        </form>
    </>
}
