import React, { useEffect, useState } from 'react';

export default function CollectionView(props) {

    const [feedsContent, setFeedsContent] = useState([]);

    useEffect(() => {
        async function retrieveCollection() {
            if (currentCollection.id === 0){
                const res = await fetch(`/collections/${props.id}`);
                const collection = await res.json();
                setCurrentCollection(collection)
            }
        }
        async function loadFeedsContent() {
            for (let i=0; i < currentCollection.feeds.length; i++){
                const feed = currentCollection.feeds[i];
                const res = await fetch(`/feedcontent/${feed.id}`);
                const feedObj = await res.json();
                const feedContent = feedObj.entries;
                for (let i=0; i < feedContent.length; i++){
                    if (!feedsContent.includes(feedContent[i])) setFeedsContent([...feedsContent, feedContent[i]]);
                }
            }
        }
        retrieveCollection();
        loadFeedsContent();
    });

    const [currentCollection, setCurrentCollection] = useState({ name: "", feeds: [], id: 0 });

    return <>
            {feedsContent.map(feed => {
                return <div className="news-item">
                        News item
                       </div>
            })}
           </>
}
