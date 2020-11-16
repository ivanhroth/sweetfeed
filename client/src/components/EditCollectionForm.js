import React, { useEffect, useState } from 'react';

export default function EditCollectionForm(props) {

    const [collectionName, setCollectionName] = useState("");
    const [currentResults, setCurrentResults] = useState([])
    const [newFeed, setNewFeed] = useState([]);
    const [collection, setCollection] = useState({name: "", feeds: []});
    const [collectionFeeds, setCollectionFeeds] = useState(collection.feeds);


    async function retrieveCollection() {
        const res = await fetch(`/collections/${props.id}`);
        const retrievedCollection = await res.json();
        if (retrievedCollection.id !== collection.id){
            setCollection(retrievedCollection);
            setCollectionFeeds(retrievedCollection.feeds);
        }
        //if (collection.name && collectionName !== collection.name) console.log("change the name in the database");
    }

    useEffect(() => {
        retrieveCollection();
        if (collectionName === "") setCollectionName(collection.name);
        localStorage.removeItem('FEEDS_CONTENT'); // so that outdated feed content is not used
    }, [collection, collectionFeeds]);

    const updateCollectionFeeds = async feed => {
        const res = await fetch(`/collections/${props.id}/addfeed`,
                                  { method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(feed) });
    }

    const saveTitle = async title => {
        const res = await fetch(`/collections/${props.id}/editname`,
                                { method: 'PUT',
                                  headers: { 'Content-Type': 'application/json'},
                                  body: JSON.stringify({name: collectionName })});
        const newCollection = await res.json();
        setCollection(newCollection);
    }

    console.log(collection);
    console.log(collection.name);
    console.log(collectionFeeds);

    return <>
        <form className="edit-collection-form">
            <div className="collection-name-container"><input type="text" value={collectionName} className="collection-name-field" placeholder="Collection name" name="name" onChange={e => {
                setCollectionName(e.target.value);
            }}></input>
            <button onClick={e => {
                e.preventDefault();
                saveTitle(collection.name);
                }}>save title</button>
            </div>

            {collectionFeeds.map(feed => <div className="feed-list-item collection-option">{feed.name} <button onClick={async e => {
                e.preventDefault();
                await fetch(`/collections/${collection.id}/removefeed/${feed.id}`);
                setCollectionFeeds(collectionFeeds.filter(f => f !== feed));
            }}>remove feed</button></div>)}

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
                            setCollectionFeeds([...collectionFeeds, feed]);
                            updateCollectionFeeds(feed);
                        }
                            }>Add to collection</button>
                    </div>
                })}
            </div>
        </form>
    </>
}
