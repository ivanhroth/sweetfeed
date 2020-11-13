import React, { useEffect, useState } from 'react';

export default function CollectionView(props) {

    const [feedsContent, setFeedsContent] = useState([]);

    useEffect(() => {
        async function retrieveCollection() {
            if (currentCollection.id === 0){
                const res = await fetch(`/collections/${props.id}`);
                collection = await res.json();
                setCurrentCollection(collection)
            }
        }
        async function loadFeedsContent() {
            for (let i=0; i < currentCollection.feeds.length; i++){
                const feed = currentCollection.feeds[i];
                const res = await fetch(`/api/feedcontent/${feed.id}`);
                const feedObj = await res.json();
                const feedContent = feedObj.entries;
                setFeedsContent([...feedsContent, feedContent]);
            }
        }
        retrieveCollection();
        loadFeedsContent();
    });

    const [currentCollection, setCurrentCollection] = useState({ name: "", feeds: [], id: 0 });

    return <>
            {feedsContent}
           </>
}
