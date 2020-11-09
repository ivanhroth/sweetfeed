import React, { useEffect, useState } from 'react';

export default function EditCollectionForm(props) {

    let collection = {name: ""};

    //const retrieveCollection =

    useEffect(() => {
        async function retrieveCollection() {
            const res = await fetch(`/collections/${props.id}`);
            collection = await res.json();
        }
        retrieveCollection();
    });

    const [collectionName, setCollectionName] = useState(collection.name)

    return <>
    <form>
        <label for="name">Collection name</label>
        <input type="text" value={collectionName} name="name" onChange={e => {
            setCollectionName(e.target.value);
        }}></input>

        {}

        <button>Add Feed</button>
    </form>
    </>
}
