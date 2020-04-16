 class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
 
  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('https://cloudflare.com', 'linkedin.com/in/musa-rafik') // Change the link from cloudflare to my linkedin account
      )
      element.setInnerContent("Check out Musa's Linkedin!"); // Change the text for link
    }
    else{
      element.setInnerContent("This is Musa's application for the full stack internship"); // Change title
    }
  }
}

// Change the link to point to my linkedin account instead of cloudflare and change title from variant # to this is musa's application ...
const rewriter = new HTMLRewriter()
  .on('a', new AttributeRewriter('href'))
  .on('title', new AttributeRewriter('title'));

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
    return rewriter.transform(response1);
  }
  else if(cookie && cookie.includes(`${NAME}=group2`)){
    return rewriter.transform(response2);
  }
  else{ // New user so create a cookie for them 
    let group = Math.random() < 0.5 ? 'group1': 'group2'; // Simualate A/B testing style
    let response = group === 'group1' ? response1: response2;
    response.headers.append('Set-Cookie', `${NAME}=${group}; path=/; domain=musarafik.workers.dev; SameSite=Lax;`);
    // return response;
    return rewriter.transform(response);

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

addEventListener('fetch', event =>{
  event.respondWith(handleRequest(event.request))
});
