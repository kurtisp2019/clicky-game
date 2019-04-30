/**
 * 
 *      giphyAPI.js
 * 
 */

import axios from "axios";

function getImages() { 

    var apiKey = "dc6zaTOxFJmzC";
    var searchQuery = "cheeseburgers";
    var limit = 10;
    var qs = "https://api.giphy.com//v1/gifs/search?q=" + searchQuery + "&limit=" + limit + "&api_key=" + apiKey;
    
    return axios.get(qs);
}

export default { getImages };