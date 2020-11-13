import React, { useEffect, useState } from 'react';

export default CollectionView(collectionId) {

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

    return <>
           </>
}
