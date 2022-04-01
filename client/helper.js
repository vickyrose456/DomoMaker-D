const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
  };//handle error
  
/**
We want to change sendPost to make it a little more versatile. We will be modifying
the version in helper.js. This new version will take in a third parameter called handler.
This will be a function we can pass in to add functionality to handling requests. We
call it at the bottom of sendPost, provided we passed something in for it
 */
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    document.getElementById('domoMessage').classList.add('hidden');
  
    if(result.error) {
      handleError(result.error);
    }

    if(result.redirect) {
      window.location = result.redirect;
    }

    if(handler)
    {
        handler(result);
    }
  
  };//send post

const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
}; //hide error

module.exports = {
    handleError,
    sendPost,
    hideError,
}