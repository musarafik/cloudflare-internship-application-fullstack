addEventListener('fetch', event =>{
  event.respondWith(handleRequest(event.request))
});

/**
 *  Send fetch request to url for assignment and return response
 *  Use random number generator to simulate A/B testing by switching between two pages to show based off generated value
 * @param {Request} request 
 */
async function handleRequest(request){
  let urlArray = await fetchUrl('https://cfw-takehome.developers.workers.dev/api/variants');
  urlArray = urlArray.variants;
  let responseNumber = Math.round(Math.random()); // response to render will be randomly selected between 0 and 1 in the array

  return new Response(await fetchUrl(urlArray[responseNumber]));
}


/**
 * Returns response from fetch request of given url (checks if response type is json or html)
 * @param url - Used for fetch request
 */
async function fetchUrl(url){
  const urlRequestParams = {
    method: 'GET'
  }

  try{
    const response = await fetch(url, urlRequestParams);
    let contentType = response.headers.get("content-type");
    if(contentType === 'application/json'){ // If json response we have to parse it
      return response.json();
    }
    else if(contentType === 'text/html'){ // HTML response
      return response.text();
    }
  }
  catch(err){
    console.log(err);
  }
}
