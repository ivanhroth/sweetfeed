import React, { useState } from 'react';

EditCollectionForm = (id) => {

    [collectionName, setCollectionName] = useState("")

    return <>
    <form>
        <label for="name">Collection name</label>
        <input type="text" value={collectionName} name="name" onChange={e => {
            setCollectionName(e.target.value);
        }}></input>
    </form>
    </>
}
