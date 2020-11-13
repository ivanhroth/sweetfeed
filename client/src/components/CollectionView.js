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

                for (let i=0; i < collection.feeds.length; i++){
                    const feed = collection.feeds[i];
                    const res = await fetch(`/feedcontent/${feed.id}`);
                    const feedObj = await res.json();
                    setFeedsContent([...feedsContent, ...feedObj.entries].sort((item1, item2) => item1.pubDate - item2.pubDate))
                }
                localStorage.setItem(FEEDS_CONTENT, JSON.stringify(feedsContent));
            }
        }

        retrieveCollection();
    }, [currentCollection]);

    return <>
            {feedsContent.map((item, i) => {
                console.log(item);
                return <div className="item-box">
                    <div className="item-header"><a href={item.link}>{item.title}</a></div>
                    <div className="item-byline">by {item.author} at {item.published}</div>
                    <div className="item-contents">
                    <p>{item.summary}</p>
                </div>
            </div>
            })}
           </>
}
