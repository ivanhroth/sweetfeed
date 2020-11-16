import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router';

export const SWEETFEED_JWT_TOKEN = "SWEETFEED_JWT_TOKEN"

const validateForm = () => true;

const Login = props => {
    const token = props.token
    console.log(token);
    const [username, updateUsername] = useState("");
    const [password, updatePassword] = useState("");
    const history = useHistory();
    const tryLogin = async () => {
        const formIsValid = validateForm();
        if (formIsValid) {
        const loginAttempt = await fetch(`/session`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (loginAttempt.status === 200) {
            const { token } = await loginAttempt.json();
            localStorage.setItem(SWEETFEED_JWT_TOKEN, token);
            history.push('/');
        }
        else console.error(loginAttempt.msg);
    }
      };

    if (token) return <Redirect to="/"/>

    return (
    <div>
        <h2>Log in</h2>
        <form>
            <div>
            <input onChange={updateUsername} type="username" placeholder="Username" required />
            </div>
            <div>
            <input onChange={updatePassword} type="password" placeholder="Password" required />
            </div>
            <div>
            <button onClick={e => {
                e.preventDefault();
                tryLogin();
            }}>Log in</button>
            <a href='/register/' id="registration-link">Don't have an account? Click here to register</a>
            </div>
        </form>
  </div>
    )
}

export default Login;
