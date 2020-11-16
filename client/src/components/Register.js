import React, { useState } from 'react';

const NONMATCHING_PASSWORDS = "Password fields do not match.";
const FILL_OUT_ALL_FIELDS = "All fields must be filled out.";

const Register = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errors, setErrors] = useState([]);

    const tryRegistration = async () => {
        if (password !== passwordConfirm) {
            if (!errors.includes(NONMATCHING_PASSWORDS)) setErrors([...errors, NONMATCHING_PASSWORDS]);
        } else if (!password || !username || !passwordConfirm) {
            if (!errors.includes(FILL_OUT_ALL_FIELDS)) setErrors([...errors, FILL_OUT_ALL_FIELDS])
        } else {
            const res = await fetch(`/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const outcome = await res.json();
            // if successful, redirect to the login page. otherwise, update with errors
        }
    }

    return <div className="login-container">
            <span className="login-header">Register an account</span>
            <form className="login-form">
                <div>
                <input type="text" onChange={e => setUsername(e.target.value)} value={username} name="username" placeholder="Username" />
                </div>

                <div>
                <input type="password" onChange={e => setPassword(e.target.value)} value={password} name="password" placeholder="Password" />
                </div>

                <div>
                <input type="password" onChange={e => setPasswordConfirm(e.target.value)} value={passwordConfirm} name="confirm-password" placeholder="Confirm password" />
                </div>

                <button type="submit" onClick={e => {
                    e.preventDefault();
                    tryRegistration();
                }}>Register</button>
            </form>
           </div>
}

export default Register;
