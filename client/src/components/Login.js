import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router';

export const SWEETFEED_JWT_TOKEN = "SWEETFEED_JWT_TOKEN"

const validateForm = () => true;

const Login = props => {
    const [token, setToken] = useState(props.token);
    const [username, updateUsername] = useState("");
    const [password, updatePassword] = useState("");
    const history = useHistory();
    const setTokenSaved = props.setTokenSaved;
    const tokenSaved = props.tokenSaved;
    const tryLogin = async () => {
        const formIsValid = validateForm();
        if (formIsValid) {
            const loginAttempt = await fetch(`/session`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
        });
        if (loginAttempt.status === 200) {
            let { token: newToken } = await loginAttempt.json();
            localStorage.setItem(SWEETFEED_JWT_TOKEN, newToken);
            setTokenSaved(true);
            if (!token) setToken(newToken);
        }
        else console.error(loginAttempt.msg);
    }
      };

    return (
    <div className="login-container">
        { tokenSaved ? <Redirect to="/" /> : <></>}
        <div id="login-header-container" >
            <h2 className="login-header">Log in</h2>
        </div>
        <form className="login-form" onSubmit={e => {
            e.preventDefault();
            tryLogin();
        }}>
            <div className="login-button-container">
                <div>
                <input onChange={e => updateUsername(e.target.value)} type="username" placeholder="Username" required />
                </div>
                <div>
                <input onChange={e => updatePassword(e.target.value)} type="password" placeholder="Password" required />
                </div>
                <button type="submit">Log in</button>
                <a href='/register/' id="registration-link">Don't have an account? Click here to register</a>
            </div>
        </form>
  </div>
    )
}

export default Login;
