import React, { useEffect, useState } from 'react';

export default function CollectionView(collectionId) {

    useEffect(() => {
        async function retrieveCollection() {
            if (currentCollection.id === 0){
                const res = await fetch(`/collections/${props.id}`);
                collection = await res.json();
                setCurrentCollection(collection)
            }
        }
        retrieveCollection();
    });

    const [currentCollection, setCurrentCollection] = useState({ name: "", feeds: [], id: 0 });

    let feedsContent = [];

    const loadFeedsContent = async () => {
        for (let i=0; i < currentCollection.feeds.length; i++){
            const res = await fetch(`/api/feedcontent/${feed.id}`);
            const feedContent = await res.json();
            feedsContent = [...feedsContent, feedContent]; // will have to be sorted by timestamp later
        }
    }

    return <>
           </>
}
