import React, { useEffect, useState } from 'react';
import EditCollectionForm from './EditCollectionForm';
import CollectionView from './CollectionView';

import User from './User';

function UsersList (props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/users/');
            const responseData = await response.json();
            setUsers(responseData.users);
        }
        fetchData();
    }, []);


    const userComponents = users.map((user) => <User key={user.id} user={user} />)
    return (
        <>
            <h1>User List: </h1>
            {userComponents}
            <CollectionView id="1" />
            <EditCollectionForm id="1" />
        </>
        );
}

export default UsersList;
