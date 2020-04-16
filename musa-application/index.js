addEventListener('fetch', event =>{
  event.respondWith(handleRequest(event.request))
});

/**
 *  Send fetch request to url for assignment and return json parsed response
 * @param {Request} request 
 */
async function handleRequest(request){
  let urlArray = await fetchUrl('https://cfw-takehome.developers.workers.dev/api/variants');
  urlArray = urlArray.variants;
  console.log(urlArray);
  // let url1Response =  await fetchUrl(urlArray[0]);
  // let url2Response = await fetchUrl(urlArray[1]);

  return new Response("hello");
}

/**
 * Returns json response to fetch request
 * @param url - Used for fetch request
 */
async function fetchUrl(url){
  const urlRequestParams = {
    method: 'GET'
  }

  try{
    const response = await fetch(url, urlRequestParams);
    return response.json();
  }
  catch(err){
    console.log(err);
  }
}
