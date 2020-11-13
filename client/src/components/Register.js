import React from 'react';

const NONMATCHING_PASSWORDS = "Password fields do not match."

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errors, setErrors] = useState([]);

    const tryRegistration = async () => {
        if (password !== passwordConfirm) {
            if (!errors.includes(NONMATCHING_PASSWORDS)) setErrors([...errors, NONMATCHING_PASSWORDS]);
        } else {
            const res = await fetch(`/api/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const outcome = await res.json();
            // if successful, redirect to the login page. otherwise, update with errors
        }
    }

    return <>
           </>
}
