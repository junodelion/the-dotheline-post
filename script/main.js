//GENERAL STUFFSES

//Creates a function that removes space from inputs
function trimInput(input) {
    return input.trim();
}

//Creates a variable called loggedIn that fetches its information from locelstorage, "loggenIn"
const loggedIn = localStorage.getItem("loggedIn");

//If someone is logged in, the "login-link" text changes to the text that's saved in loggedIn, aka the username.
if (loggedIn) {
    document.getElementById("login-link").textContent = loggedIn;
}

//REGISTER THYSELF

//If user is on the register page, use this code.
if (window.location.pathname.includes("register.html")) {
    const form = document.querySelector("#register-form");
    //Submit event makes submitting input possible
    form.addEventListener("submit", function (event) {
        event.preventDefault(); //Prevents browser from doing default action, just a failsafe
    
        const username = trimInput(document.getElementById("username").value);
        const password = trimInput(document.getElementById("password").value);
        const errorMessage = document.getElementById("register-error");
        //If there is a missing (!) username or password entered, send this error message and return.
        if (!username || !password) {
            errorMessage.textContent = "You must enter both a username and a password.";
            return;
        }
        //Created savedUser variable and saves that as "registeredUser" in localstorage. This can only be one user at a time,
        //so if you register again, that new user will overwrite the old one.
        const savedUser = {username, password};
        localStorage.setItem("registeredUser", JSON.stringify(savedUser));
        //Sends you to log in if registered successfully
        window.location.href = "../login/login.html"

    });
        
    }

//LOGETH IN

//If user is on the login page, use this code.
if (window.location.pathname.includes("login.html")) {
    const form = document.querySelector("#login-form");
    //Submit event makes submitting input possible
    form.addEventListener("submit", function (event) {
        event.preventDefault(); //Prevents browser from doing default action    

        const username = trimInput(document.getElementById("username").value);
        const password = trimInput(document.getElementById("password").value);
        const savedUser = JSON.parse(localStorage.getItem("registeredUser"));
        const errorMessage = document.getElementById("login-error");
        //If there is a missing (!) username or password entered, send this error message and return.
        if (!username || !password) {
            errorMessage.textContent = "You must enter both a username and a password.";
            return;
        }
        //If credentials do not match savedUser, send this error.
        if (!savedUser) {
            errorMessage.textContent = "The credentials do not match our database.";
            return;
        }
        //If the username matches the savedUser set "loggenIn" as username and go to index/front page
        else if (username === savedUser.username && password === savedUser.password) {
            localStorage.setItem("loggedIn", username);
            window.location.href = "../index.html";

        }
        //If anything else is wrong but didn't trigger the other errors send this one
        else {
            errorMessage.textContent = "Wrong username or password.";
            return;
        }

    });
}

//COMMENTSES

//If user is on a page ending with _article.html, use this code.
if (window.location.pathname.endsWith("_article.html")) {
    const commentForm = document.getElementById("comment-form")
    const loginToComment = document.getElementById("login-to-comment")
    const whatPageKey = "comments_" + window.location.pathname;
    const savedComments = JSON.parse(localStorage.getItem(whatPageKey)) || [];

    //This code rebuilds and inserts into html, the previous user comments by looping through the previously saved comments in localstorage.
    savedComments.forEach(function(comment) {
        const savedComment = document.createElement("article");
        savedComment.classList.add("comment");
        savedComment.innerHTML = `
            <h4>${comment.username}</h4>
            <p><i>Less than a minute ago</i></p>
            <p>${comment.text}</p>
        `;
        document.getElementById("comment-list").prepend(savedComment);
    });
    //Checks if someone is logged in. If yes, unhide the login to comment text.
    if (loggedIn) {
        loginToComment.hidden = true;
        commentForm.hidden = false;
    }
        else {
            loginToComment.hidden = false;
            commentForm.hidden = true;

        }
    //The event that makes submitting possible. Turns input into text.
    commentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const commentText = trimInput(document.getElementById("comment-input").value);
        const errorMessage = document.getElementById("comment-error");

        if (!commentText) {
            errorMessage.textContent = "You must write something to submit a comment."
            return;
        }

        errorMessage.textContent = "";
        //Takes the input and turns it into a comment and inserts it into the html.
        const newComment = document.createElement("article");
        newComment.classList.add("comment");

        newComment.innerHTML = `
            <h5>${loggedIn}</h5>
            <p class="comment-time"><i>Less than a minute ago</i></p>
            <p>${commentText}</p>
        `;

        document.getElementById("comment-list").prepend(newComment);
        //Saves the new user comment in localstorage so it can be retrieved later by previous loop
        const savedComments = JSON.parse(localStorage.getItem(whatPageKey)) || [];

        savedComments.push({username: loggedIn, text: commentText});
        localStorage.setItem(whatPageKey, JSON.stringify(savedComments));

        document.getElementById("comment-input").value = "";
    });
}