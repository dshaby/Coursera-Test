// LECTURE 58 - PROCESSING JSON ***************************************************************



// LECTURES 57.2 & 57.3 - AJAX BASICS ************************************************************

//this library is for making AJAX requests to the server & process the response
//by giving our user (us) of the library the ability to give us a function
//that they will pass to us that will then get called when server returns the response

(function (global) {//this is an IIFE global object (window)

    // Set up a namespace for our utility
    var ajaxUtils = {};//an empty object that we can attach things to expose to the outside world
    //we only have sendGetRequest attached to it, which is expecting a request Url & a value of the responseHandler function
    // See MAIN FUNCTION below


    // Returns an HTTP request object
    //first function is NOT attached to ajaxUtils
    //when ajaxUtils is exposed outside this IIFE, this function will not be available to the user of ajaxUtils
    function getRequestObject() {
        if (global.XMLHttpRequest) {//checks what type of object is available
            //XMLHttpRequest is the most current version of the Ajax object there is
            return (new XMLHttpRequest()); //new object that will be used in our new function
        }
        else if (global.ActiveXObject) {
            // For very old IE browsers (optional)
            return (new ActiveXObject("Microsoft.XMLHTTP"));
        }
        else {
            global.alert("Ajax is not supported!");//this would be on window object
            return (null);
        }
    }

    //MAIN FUNCTION
    // Makes an Ajax GET request to 'requestUrl' (to the server)
    ajaxUtils.sendGetRequest =
        function (requestUrl, responseHandler, isJSONResponse) {//request url is one paramater, "where" to make the GET request on server (Url)
            //after server responds, responseHandler function will 'handle' the result of what the server returns
            // LECTURE 58: JSON - isJSONResponse --> another argument to preprocess response in ajaxUtils.js instead
            // to process JSON.parse(a variable) everytime inside of our custom script.js script.
            // isJsonResponse, as a client of this code, you could pass true or false or omit
            // if ommited, will asume you want JSON
            // if false also will aslo assume you want JSON (I think) ('will also work')

            var request = getRequestObject();//getting 'new' XMLHttpRequest() object, saving it in a local variable 'request'
            // it also looks like it's being executed

            request.onreadystatechange = //saving this request variable to different stages between browser and server. 
                // LECTURE 58: JSON - in the onreadystatechange property, 
                // we will go inside our Anonymous function below [function --> responseHandler);] (closure)
                // & pass isJSONResponse into the 'handleResponse' function

                function () {
                    handleResponse(request, responseHandler, isJSONResponse);//only when executing function, can you use paramters
                };//We're calling it the handleResponse function which is passed 'request' object/variable & responseHandler
            //when server comes back with a response, this is the function that gets called

            request.open("GET", requestUrl, true);
            //make the 'open' command with "GET" request (type of request, method of rquest), pass it to requestURL, 
            //and use 'true'. If false, it would be a "synchronous" request.
            //browser would freeze & wait for response b4 doing anything else. So we want browser to continue operating & be "asynchronous"

            request.send(null); // for POST only
        };//last step, executes request & sends it to server (everythign b4 were paramaters)
    //we use null bcz if "GET" were a POST request, our request *paramaters*
    // [I believe in request.open("GET", requestUrl, true);]
    // would not be 'requestUrl', but would be part of the 'body' of the request
    //body in 'null' spot. If you wanted to have name/value pairs for request paramaters,
    // would put that string saved in object & paste it in 'null' 


    // Only calls user provided 'responseHandler'
    // function if response is ready
    // and not an error
    function handleResponse(request, responseHandler, isJSONResponse) {//LECTURE 58 - JSON - Adding 3rd paramater
        //takes original request object & responseHandler function that the user is providing for us
        // request.readyState we want 4 states
        if ((request.readyState == 4) && //Handling real response and make sure we're in the last state, so no lower level communications, & we're ready to go
            (request.status == 200)) {//check that it's 200 (status code == everything's fine)

            // JSON - We must first check whether we will need to default isJSONResponse = true
            if (isJSONResponse == undefined) { //if nobody passes us anything
                isJSONResponse = true;//we will default response = true
            }
            // JSON
            if (isJSONResponse) {//if JSONResponse is true,
                responseHandler(JSON.parse(request.responseText));//responseHandler should be passed
                // when we execute the responseHandler, the script.js
                // what we're going to pass to responseHandler function is a parsed response
                // (response.Text parsed using JSON.parse)
                // arguments are parseJSON string, which will be a JS object

            }
            else {
                responseHandler(request.responseText);//if those two conditions are true, take responseHandler function &
                // pass it the request that the user of this library will pull out response from the server
                // JSON - responseText
                // if they don't want JSON be handled in responseHandler
                // we just get them the actual responseText
                // and they will handle responseHandler (whoever is the caller of this) however they want
            }
        }
    }

    // Expose utility to the global object
    global.$ajaxUtils = ajaxUtils;//dollar sign ajaxUtils will be exposed to global, and ajaxUtils is in local

})(window);

