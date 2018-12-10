const handleLogin = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("user").val() == '' || $("#pass").val() == ''){
        handleError("Missing Username or Password.");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2") == ''){
        handleError("One of the fields wasn't filled out.");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords don't match.");
        return false;
    }

    sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const LoginWindow = (props) => {
    return(
        <form
                id="loginForm"
                name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="mainForm"
        >
            <h3>Log In</h3>
            <div><label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/></div>
            
            <div><label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/></div>
            
            <input type="hidden" name="_csrf" value={props.csrf}/>

            <input className="formSubmit" type="submit" value="Sign in"/>

            <p>Don't have an account? <a href="/signup" id="signupButton">Sign Up!</a></p>
        </form>
    );
};

const SignupWindow = (props) => {
    return(
        <form
            id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
            <h3>Sign Up</h3>

            <div><label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/></div>
            
            <div><label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/></div>
            
            <div><label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/></div>
            
            <input type="hidden" name="_csrf" value={props.csrf}/>

            <input className="formSubmit" type="submit" value="Sign Up"/>

            <p>Already have an account? <a href="/login" id="loginButton">Log In!</a></p>
        </form>
    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf}/>,
        document.querySelector("#content")
    );

    const signupButton = document.querySelector("#signupButton");
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    document.querySelector("#errorMessage").innerHTML = "";
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf}/>,
        document.querySelector("#content")
    );

    const loginButton = document.querySelector("#loginButton");
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    document.querySelector("#errorMessage").innerHTML = "";
};

const setup = (csrf) => {
    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
