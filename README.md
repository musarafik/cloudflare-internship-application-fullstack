# cloudflare-internship-application-fullstack
This is my application for the Cloudflare Full Stack Internship.
- I haved used Cloudflare Workers to create an application that sends a user to one of two urls using A/B testing style.
- I have implemented cookies to save which url the user will see so instead of seeing a random url, they will go to the same one in the same browser session. If they close the browser the cookie will be deleted. 
- I have also use the Cloudflare HTMLRewriter api to change the title and link in the page. 

View the application at: https://musa-application.musarafik.workers.dev/