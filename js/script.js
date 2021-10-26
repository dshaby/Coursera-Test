// LECTURE 59 - FIXING MOBILE NAV MENU AUTOMATIC COLLAPSE

// we want when clicking outside the nav menu button on devices < 768px
// the nav menu button to collapse (since its out of focus)
// We must use EventHandler "onblur"

//we want this functionality to work once the DOM Content is Loaded
// straightforward JS won't work, we need jquery library
// since collapse menu is a plugin hosted in bootstrap.min.js
// which is depenedent on jquery

$(function () {//same as document.addEventListener("DOMContentLoaded"...)
    // the jquery function name is '$'
    // '$' function executed then function following it is being executed
    // executing $ sign function 'against' the next function below
    // $ sign function is the same as document.addEventListener("DOMContentLoaded"..)
    // so anything inside of this $ function, it will get executed when HTML is processed
    // but b4 CSS & images are loaded
    // basically DOMContentLoaded event

    // Same as document.querySelector(".navbar-toggle").addEventListener("blur", ... )
    $(".navbar-toggle").blur(function (event) {
        //reusing $ sign function. jQuery of dollar sign function also 
        // has functionality of "querySelector" if we put $()
        // something with quotes inside of parens after $, serves as a selector
        // so, $(".navbarToggle") = document.querySelector(".navbarToggle")

        // we're selecting an element with class navbarToggle
        // blur (loses focus) (blur is the event in addEventListener)
        // so when 'blur' happens, execute the following function!
        var screenWidth = window.innerWidth;
        // using window.innerWidth = width of browser window itself
        // not entire screen of monitor

        if (screenWidth < 768) {//if this var we created and is true (lost focus)
            $("#collapsable-nav").collapse('hide');
            // select #collapsable-nav which is the menu items
            // i.e. home, menu categories, About, Awards

            // applying collapse function with value of 'hide'
        }
    });
    $(".navbar-toggle").click(function (event) {
        $(event.target).focus();
    });
});

// LECTURE 60 - DYNAMICALLY LOADING HOME VIEW CONTENT ********************
// IIFE - Immediatley Invoked Function Expression
(function (global) {//global here is window object
    var dc = {};//dc for David Chu's :)
    //we will expose dc at the end, global (which is window)
    // global.$dc = dc;
    // $dc is what we want to expose this as (global object)
    // dc is our internal namespace (private variable)

    var homeHtml = "snippets/home-snippet.html";
    //url where this snippet will sit

    // LECTURE 61.2 - DYNAMICALLY LOADING MENU CATEGORIES VIEW **************
    // 61 - More URLs:
    var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
    // 61 - url where we get the JSOn that will return all the categories that we have in our menu as a JSON string
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    // 61 - path to our snippets
    var categoryHtml = "snippets/category-snippet.html";


    // Convenience function for inserting innerHTML for 'select'
    //so we don't write several times

    var insertHtml = function (selector, html) {//if you give me a selector and html
        var targetElem = document.querySelector(selector);//take that selector element
        // and set its innerHtml to html string you send me
        targetElem.innerHtml = html;
        //a convenience method to say insert html variable, pass it a selector & html string
        // will insert it inside targetElem(ent)
    };
    // Show loading icon inside element identified by 'selector'.
    // another function we need:
    var showLoading = function (selector) { //give me a selector to which I should attach this loading gif icon
        var html = "<div class='text-center'>";//setting up a div, and placing the gif inside it
        html += "<img src='images/ajax-loader.gif'></div>";//ajax request
        // is going to be done asynchronosouly and go out to server
        // bringing us some content

        // we want an animated icon showing the user that something is going on
        // (so it's not blank on webpage), using ajax-loader.gif (a gif!)
        insertHtml(selector, html);//reusing insertHtml that just defined & inserting that into the particular selector
        // using rotating ajax gif inside selector we choose/pass in
    };
    // LECTURE 61.2 - DYNAMICALLY LOADING MENU CATEGORIES VIEW **************
    // 61 - Return substitute of '{{propName}}'
    // with propValue in given 'string'
    // we will grab 'category-snippet.html' as a string using AJAX request
    // and then will have this html as a string
    // substitue every property with double {{}} with a value/function

    var insertProperty = function (string, propName, propValue) {//asking it for a string, propName, & propValue
        // 'string' is where we're going to insert things into
        // propName & propValue are going to RETURN the string already with those property values inserted (instead of property names there)
        var propToReplace = "{{" + propName + "}}";
        // set up property name with curly braces
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        // replace function of string class using Regular Expression object
        // the property to replace that property we've set up (propToReplace variable)
        // purpose of regular expression object is to specify this flag 'g' which tells us to
        // replace propValue *everywhere* you find in this string
        // not just first place you find ({{name}}) but second time as well/i.e. all of them
        // property value with which you should replace that particular string
        // then return string
        return string;
        //taking snippet and populating it with property values (propValue)
    }

    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {

        // On first load, show home view (start executing selector queries)
        // selectorqueries that will find things
        // obviously would only work once html is loaded
        showLoading("#main-content");//showLoading will insert it inside #main-content innerHtml of that element
        $ajaxUtils.sendGetRequest(//once finished, will issue $ajax request
            homeHtml,//give us somethng we defined above: where snippet is sitting
            // var homeHtml = "snippets/home-snippet.html";
            // MAIN CONTENT AJAX SEND REQUEST
            function (responseText) {
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false);//false means don't preprocess this as JSON (bcz its an HTML snippet)
        // what will come back in our Handler function above 
        // (from function (responseText) to responseText; }, )
        // is some text, i.e. responseText, responseHtml
        // once comes back select #main-content element and set its innerHtml to 
        // what responseText came out to be
    });

    // LECTURE 61.2 - DYNAMICALLY LOADING MENU CATEGORIES VIEW **************
    // Load the menu categories function that will be triggered to pull categories into the page
    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
        //'build...HTML" is a value of a function defined below
        // we don't need 'true' because (off) so this function will get first 
        // argument in the function  (categories)
        // an object that is converted from the JSON string
        // a full blown object
    };

    // Builds HTML for the categories page based on the data from server
    function buildAndShowCategoriesHTML(categories) {
        // Load *title* snippet of categories page first
        $ajaxUtils.sendGetRequest(categoriesTitleHtml,//requesting this html
            function (categoriesTitleHtml) {
                // Retrieve single category snippet next
                $ajaxUtils.sendGetRequest(categoryHtml,
                    //inside parent $ajaxUtils b/c we want this to happen right after parent
                    function (categoryHtml) {
                        var categoriesViewHtml = buildCategoriesViewHtml(categories,//calling/creating 
                            // buildCategoriesViewHtml (new) function
                            // passing it categories object, title snippet, & category snippet
                            categoriesTitleHtml, categoryHtml);
                        //all this will be stored in categoriesViewHtml variable
                        // all this is a synchronous call, so once done
                        insertHtml("#main-content", categoriesViewHtml);
                        // all to be inserted into insertHtml to place it inside elmennt with id main content
                        // and categoriesViewHtml is the string we're placing inside of it
                    },
                    false);//false since we don't want ajaxutility to process as JSON
            },
            false);//false for same reason as above
    }

    // Using categories data & snippets html
    // buildCategoriesViewHtml to be inserted into page
    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {

        var finalHtml = categoriesTitleHtml;//grabs categories title first
        finalHtml += "<section class='row'>";//must put everything into a row
        // since all the category-snippets are loop multiple times
        // INSIDE a row (that we just added)

        // Loop over categories object
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = categoryHtml;//copying categoryHtml everytime
            // snippet that has the properties in it into html
            // copy by value 
            // everytime through the loop, we get a new copy in 'html'
            // and insert new values to it once again (name, short_name)
            var name = "" + categories[i].name; //everytime pulling out name
            var short_name = categories[i].short_name; //everytime pulling out short_name
            html = insertProperty(html, "name", name);//then insertProperty
            // inserting property everytime there's a "name" property
            // gets replaced with name 'value'
            // same for short_name below
            html = insertProperty(html, "short_name", short_name);
            // finally we're done, and looping this over 
            finalHtml += html;
        }
        finalHtml += "</section>";
        //closing section tag once done
        return finalHtml; //thats built up
        //once finished, goes back into :insertHtml("#main-content", categoriesViewHtml);
    }

    global.$dc = dc;

})(window);