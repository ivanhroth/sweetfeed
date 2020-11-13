import React, { useEffect, useState } from 'react';

const FEEDS_CONTENT = 'FEEDS_CONTENT';

export default function CollectionView(props) {
    const [feedsContent, setFeedsContent] = useState(localStorage.getItem(FEEDS_CONTENT) ? JSON.parse(localStorage.getItem(FEEDS_CONTENT)): []);
    const [currentCollection, setCurrentCollection] = useState({ name: "", feeds: [], id: 0 });


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
                /* feedObj.entries.forEach(entry => {
                    if (!feedsContent.includes(entry)) setFeedsContent([...feedsContent, entry]);
                }) */
                setFeedsContent([...feedsContent, ...feedObj.entries])
            }
            setFeedsContent(feedsContent.sort((item1, item2) => item1.pubDate - item2.pubDate));
            localStorage.setItem(FEEDS_CONTENT, JSON.stringify(feedsContent));
        }
        retrieveCollection();
        if ((currentCollection.id !== 0) && (feedsContent.length === 0)){
            loadFeedsContent();
        }
    }, [currentCollection]);

    //console.log(feedsContent);
    return <>
            {feedsContent.map((item, i) => {
                return <div className="news-item" key={i}>
                        {item.title}
                       </div>
            })}
           </>
}
