import React, { useEffect, useState } from 'react';

const FEEDS_CONTENT = 'FEEDS_CONTENT';

export default function CollectionView(props) {
    //const [feedsContent, setFeedsContent] = useState(localStorage.getItem(FEEDS_CONTENT) ? JSON.parse(localStorage.getItem(FEEDS_CONTENT)): []);
    const [feedsContent, setFeedsContent] = useState([]);
    const [currentCollection, setCurrentCollection] = useState({ name: "", feeds: [], id: 0 });


    useEffect(() => {
        async function retrieveCollection() {
            if (currentCollection.id === 0){
                const res = await fetch(`/collections/${props.id}`);
                const collection = await res.json();
                setCurrentCollection(collection)

                let newFeedsContent = feedsContent;

                for (let i=0; i < collection.feeds.length; i++){
                    const feed = collection.feeds[i];
                    const res = await fetch(`/feedcontent/${feed.id}`);
                    const feedObj = await res.json();
                    newFeedsContent = [...newFeedsContent, ...feedObj.entries].sort((item1, item2) => ((new Date(item2.published)) - new Date(item1.published)));
                }
                setFeedsContent(newFeedsContent);
            }
        }

        retrieveCollection();
    }, [currentCollection]);

    //localStorage.setItem(FEEDS_CONTENT, JSON.stringify(feedsContent));

    return <>
            <span className="collection-view-header">{currentCollection.name}</span>
            {feedsContent.map((item, i) => {
                console.log(item);
                return <div className="item-box">
                    <div className="item-header"><a href={item.link}>{item.title}</a></div>
                    <div className="item-byline">by {item.author} at {item.published}</div>
                    <div className="item-contents" dangerouslySetInnerHTML={{ __html: item.summary }}>
                </div>
            </div>
            })}
           </>
}
