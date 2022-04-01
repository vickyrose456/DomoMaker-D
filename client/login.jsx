/*
 Inside of the login.jsx file in the client folder, add the following. First, we will require
our helper code into this file (which we can do because of webpack). Then we will
make a function for handling the submit event on the login form. Note that when we
call helper.sendPost we do not pass in a handler function as the third param. This is
because we do not need one. The built in redirect and error handling will work fine for
us
*/
const helper = require('./helper.js');

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