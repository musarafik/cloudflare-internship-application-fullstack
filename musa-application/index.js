addEventListener('fetch', event =>{
  event.respondWith(handleRequest(event.request))
});

/**
 *  Get two urls from first url and send a response from one of the urls 
 *  Use cookies to store which url to send a response from (cookie is deleted when browser closes -> user will see same url response if they refresh page on same browser session)
 *  Use random number generator to simulate A/B testing by switching between two pages to show based off generated value
 * @param {Request} request 
 */
async function handleRequest(request){
  const NAME = 'cookie';
  let urlArray = await fetchUrl('https://cfw-takehome.developers.workers.dev/api/variants'); // Get the two urls

  urlArray = urlArray.variants;

  let response1 = new Response(await fetchUrl(urlArray[0])); // Get the response from the first url in the array
  let response2 = new Response(await fetchUrl(urlArray[1])); // Get response from second url

  // Get cookie and check which page to show based off value 
  const cookie = request.headers.get('cookie'); 
  if(cookie && cookie.includes(`${NAME}=group1`)){
    return response1;
  }
  else if(cookie && cookie.includes(`${NAME}=group2`)){
    return response2;
  }
  else{ // New user so create a cookie for them 
    let group = Math.random() < 0.5 ? 'group1': 'group2'; // Simualate A/B testing style
    let response = group === 'group1' ? response1: response2;
    response.headers.append('Set-Cookie', `${NAME}=${group}; path=/; domain=musarafik.workers.dev; SameSite=Lax;`);
    return response;

  }
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
