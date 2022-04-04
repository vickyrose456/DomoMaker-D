const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const _csrf = e.target.querySelector('#_csrf').value;

    if(!name || !age)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, _csrf}, loadDomosFromServer);

    return false;

};//handle domo

const DomoForm = (props) => {
    return (
        <form id='domoForm'
            onSubmit={handleDomo}
            name = 'domoForm'
            action='/maker'
            method='POST'
            className='domoForm'
        >            
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />

            <label htmlFor='domoAge'>Age: </label>
            <input id='domoAge' type='numebr' min='0' name='age' placeholder='Domo Age'/>

            <input id='_csrf' type='hidden' name='_csrf' value={props.csrf} />

            <input className='makeDomoSubmit' type='submit' value='Make Domo' />

        </form>
    );
};//domo form

//create component to display list of domos

const DomoList = (props) => {
    if(props.domos.length === 0){
        return(
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        return(
            <div key={domo._id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt ='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name} </h3>
                <h3 className='domoAge'>Age: {domo.age} </h3>
            </div>
        );
    });//domo nodes

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );

};//domo list

//fns to load domos from the server
const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();

    ReactDOM.render(
        <DomoList domos ={data.domos} />,
        document.getElementById('domos')
    );
};//end load domos from server

//get csrf token to render the domos to the page
const init = async() =>{
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(
        <DomoForm csrf ={data.csrfToken} />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos ={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
};//init

window.onload = init;