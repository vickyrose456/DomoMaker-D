/*
 Inside of the login.jsx file in the client folder, add the following. First, we will require
our helper code into this file (which we can do because of webpack). Then we will
make a function for handling the submit event on the login form. Note that when we
call helper.sendPost we do not pass in a handler function as the third param. This is
because we do not need one. The built in redirect and error handling will work fine for
us
*/
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass)
    {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, _csrf});
    return false;
};//end handle login

const handleSignUp = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!username || !pass || !pass2)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2)
    {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, _csrf});
    return false;

};//end handle sign up clicks


/**
Since this is a simple component that will not update when the user
types into it, we will make a “functional stateless component” or FSC.
 */
const LoginWindow = (props) => {
    return(
        <form id = 'loginForm'
            name = 'loginForm'
            onSubmit = {handleLogin}
            action = '/login'
            method = "POST"
            className = 'mainForm'>

        <label htmlFor='username'>Username: </label>
        <input id='user' type= 'text' name='username' placeholder='username'/>
        
        <label htmlFor='password'>Password: </label>
        <input id='pass' type='password' name='pass' placeholder='password' />

        <input id='_csrf' type= 'hidden' name='_csrf' value={props.csrf} />

        <input className='formSubmit' type='submit' value='Sign in' />

        </form>
    );
};//loginwindow

const SignupWindow = (props) => {
    return(
        <form id = 'signupForm'
            name = 'signupForm'
            onSubmit = {handleSignUp}
            action = '/signup'
            method = "POST"
            className = 'mainForm'>

        <label htmlFor='username'>Username: </label>
        <input id='user' type= 'text' name='username' placeholder='username'/>
        
        <label htmlFor='pass'>Password: </label>
        <input id='pass' type='password' name='pass' placeholder='password' />

        <label htmlFor='pass2'>Password: </label>
        <input id='pass2' type='password' name='pass2' placeholder='retype password' />

        <input id='_csrf' type= 'hidden' name='_csrf' value={props.csrf} />

        <input className='formSubmit' type='submit' value='Sign in' />
        
        </form>
    );
};//sign up window

//initialize the page
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    //set up event listeners for when login/sign up is clicked
    //when user presses button, 'content' section will be filled
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(
            <LoginWindow csrf = {data.csrfToken} />,
            document.getElementById('content')
        );
        return false;
    });//login button event listener

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(
            <SignupWindow csrf = {data.csrfToken} />,
            document.getElementById('content')
        );
        return false;
    });//signup button event listener

    //want the user to be able to see something in the content section(ideally login)
    ReactDOM.render(
        <LoginWindow csrf = {data.csrfToken}/>,
        document.getElementById('content')
    );

};//init

window.onload = init;