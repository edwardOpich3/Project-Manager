"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("Not all fields were filled out.");
        return false;
    }

    sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

// TODO: The next like 5 functions can be unified
var handleSettings = function handleSettings(e) {
    e.preventDefault();

    sendAjax("POST", $("#settingsForm").attr("action"), $("#settingsForm").serialize(), function () {
        loadMainPage();
    });

    return false;
};

var handleMilestone = function handleMilestone(e) {
    e.preventDefault();

    sendAjax("POST", $("#milestoneForm").attr("action"), $("#milestoneForm").serialize(), function () {
        loadMainPage();
    });

    return false;
};

var handleRequirement = function handleRequirement(e) {
    e.preventDefault();

    sendAjax("POST", $(e.target).attr("action"), $(e.target).serialize(), function () {
        loadMainPage();
    });

    return false;
};

var handleDelete = function handleDelete(e) {
    e.preventDefault();

    sendAjax("POST", '/deleteProj', $("#deleteForm").serialize(), function () {
        loadMainPage();
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        {
            id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h1",
            null,
            "New Project"
        ),
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement(
            "div",
            null,
            React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Project Name" })
        ),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Description: "
        ),
        React.createElement(
            "div",
            null,
            React.createElement("textarea", { id: "domoAge", className: "projectDesc", type: "text", name: "description", placeholder: "Description" })
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Create Project" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h1",
                null,
                "Your Projects"
            ),
            React.createElement(
                "div",
                { className: "addDomo" },
                React.createElement(
                    "h3",
                    null,
                    "Create New Project"
                )
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement(
                "h3",
                null,
                domo.name
            ),
            React.createElement(
                "h4",
                null,
                "Due ",
                domo.deadline
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        React.createElement(
            "h1",
            null,
            "Your Projects"
        ),
        domoNodes,
        React.createElement(
            "div",
            { className: "addDomo" },
            React.createElement(
                "h3",
                null,
                "Create New Project"
            )
        )
    );
};

var FullProject = function FullProject(props) {
    if (!props.project.milestones || props.project.milestones.length === 0) {
        return React.createElement(
            "div",
            { className: "fullProject" },
            React.createElement(
                "form",
                { id: "deleteForm", onSubmit: handleDelete },
                React.createElement("input", { type: "hidden", name: "project", value: props.project.name }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement(
                    "button",
                    { type: "submit" },
                    React.createElement("img", { src: "assets/img/delete.png" })
                )
            ),
            React.createElement(
                "h1",
                null,
                props.project.name
            ),
            React.createElement(
                "h3",
                null,
                "Due ",
                props.project.deadline
            ),
            React.createElement(
                "p",
                null,
                props.project.description
            ),
            React.createElement(
                "h2",
                null,
                "No Milestones Defined"
            ),
            React.createElement(
                "form",
                {
                    id: "milestoneForm",
                    name: "milestoneForm",
                    onSubmit: handleMilestone,
                    action: "/milestone",
                    method: "POST"
                },
                React.createElement(
                    "label",
                    { htmlFor: "name" },
                    "New Milestone: "
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", { id: "name", type: "text", name: "name", placeholder: "Name" })
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("textarea", { id: "MSDesc", type: "text", name: "description", placeholder: "Description" })
                ),
                React.createElement("input", { type: "hidden", name: "project", value: props.project.name }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { className: "formSubmit", type: "submit", value: "Create New Milestone" })
            )
        );
    }

    var milestoneNodes = props.project.milestones.map(function (milestone) {
        if (!milestone.requirements || milestone.requirements.length === 0) {
            return React.createElement(
                "div",
                { className: "milestone" },
                React.createElement(
                    "h2",
                    null,
                    milestone.name
                ),
                React.createElement(
                    "h4",
                    null,
                    "Due ",
                    milestone.deadline
                ),
                React.createElement(
                    "p",
                    null,
                    milestone.description
                ),
                React.createElement(
                    "h3",
                    null,
                    "No Requirements Defined"
                ),
                React.createElement(
                    "form",
                    {
                        id: "requirementForm",
                        name: "requirementForm",
                        onSubmit: handleRequirement,
                        action: "/requirement",
                        method: "POST"
                    },
                    React.createElement(
                        "label",
                        { htmlFor: "name" },
                        "New Requirement: "
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement("input", { id: "name", type: "text", name: "name", placeholder: "Requirement Name" })
                    ),
                    React.createElement("input", { type: "hidden", name: "project", value: props.project.name }),
                    React.createElement("input", { type: "hidden", name: "milestone", value: milestone._id }),
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { className: "formSubmit", type: "submit", value: "Create New Requirement" })
                )
            );
        }

        var requirementNodes = milestone.requirements.map(function (requirement) {
            return React.createElement(
                "div",
                { className: "requirement" },
                React.createElement(
                    "label",
                    null,
                    requirement.name,
                    ": "
                ),
                React.createElement("input", { type: "checkbox", value: requirement.completed })
            );
        });

        return React.createElement(
            "div",
            { className: "milestone" },
            React.createElement(
                "h2",
                null,
                milestone.name
            ),
            React.createElement(
                "h4",
                null,
                "Due ",
                milestone.deadline
            ),
            React.createElement(
                "p",
                null,
                milestone.description
            ),
            React.createElement(
                "h3",
                null,
                "Requirements:"
            ),
            requirementNodes,
            React.createElement(
                "form",
                {
                    id: "requirementForm",
                    name: "requirementForm",
                    onSubmit: handleRequirement,
                    action: "/requirement",
                    method: "POST"
                },
                React.createElement(
                    "label",
                    { htmlFor: "name" },
                    "New Requirement: "
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement("input", { id: "name", type: "text", name: "name", placeholder: "Requirement Name" })
                ),
                React.createElement("input", { type: "hidden", name: "project", value: props.project.name }),
                React.createElement("input", { type: "hidden", name: "milestone", value: milestone._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { className: "formSubmit", type: "submit", value: "Create New Requirement" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "fullProject" },
        React.createElement(
            "form",
            { id: "deleteForm", onSubmit: handleDelete },
            React.createElement("input", { type: "hidden", name: "project", value: props.project.name }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement(
                "button",
                { type: "submit" },
                React.createElement("img", { src: "assets/img/delete.png" })
            )
        ),
        React.createElement(
            "h1",
            null,
            props.project.name
        ),
        React.createElement(
            "h3",
            null,
            "Due ",
            props.project.deadline
        ),
        React.createElement(
            "p",
            null,
            props.project.description
        ),
        React.createElement(
            "h2",
            null,
            "Milestones:"
        ),
        milestoneNodes,
        React.createElement(
            "form",
            {
                id: "milestoneForm",
                name: "milestoneForm",
                onSubmit: handleMilestone,
                action: "/milestone",
                method: "POST"
            },
            React.createElement(
                "label",
                { htmlFor: "name" },
                "New Milestone: "
            ),
            React.createElement(
                "div",
                null,
                React.createElement("input", { id: "name", type: "text", name: "name", placeholder: "Name" })
            ),
            React.createElement(
                "div",
                null,
                React.createElement("textarea", { id: "MSDesc", type: "text", name: "description", placeholder: "Description" })
            ),
            React.createElement("input", { type: "hidden", name: "project", value: props.project.name }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Create New Milestone" })
        )
    );
};

var SettingsPage = function SettingsPage(props) {
    return React.createElement(
        "form",
        {
            id: "settingsForm",
            name: "settingsForm",
            onSubmit: handleSettings,
            action: "/settings",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h1",
            null,
            "Settings"
        ),
        React.createElement(
            "label",
            { htmlFor: "passChange" },
            "Change Password:"
        ),
        React.createElement(
            "div",
            null,
            React.createElement("input", { id: "passChange", type: "password", name: "passChange", placeholder: "new password" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement("input", { id: "passChange2", type: "password", name: "passChange2", placeholder: "confirm password" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { htmlFor: "premiumBox" },
                "Premium Membership: "
            ),
            React.createElement("input", { id: "premiumBox", type: "checkbox", name: "premium" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { htmlFor: "deleteBox" },
                "Delete Account: "
            ),
            React.createElement("input", { id: "deleteBox", type: "checkbox", name: "delete" })
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { htmlFor: "passAuth" },
                "Type current password to authorize changes: "
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement("input", { id: "passAuth", type: "password", name: "passAuth", placeholder: "password" })
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Settings" })
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax("GET", "/getDomos", null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#content"));

        var projects = document.querySelectorAll(".domo");

        var _loop = function _loop() {
            var currentProject = data.domos[i];
            projects[i].addEventListener("click", function (e) {
                sendAjax("GET", "/getToken", null, function (result) {
                    e.preventDefault();
                    ReactDOM.render(React.createElement(FullProject, { csrf: result.csrfToken, project: currentProject }), document.querySelector("#content"));

                    return false;
                });
            });
        };

        for (var i = 0; i < projects.length; i++) {
            _loop();
        }

        var newProjectButton = document.querySelector(".addDomo");
        newProjectButton.addEventListener("click", function (e) {
            sendAjax("GET", "/getToken", null, function (result) {
                e.preventDefault();
                ReactDOM.render(React.createElement(DomoForm, { csrf: result.csrfToken }), document.querySelector("#content"));
                return false;
            });
        });
    });
};

var loadMainPage = function loadMainPage(e) {
    if (e) {
        e.preventDefault();
    }

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#content"));

    loadDomosFromServer();

    document.querySelector("#errorMessage").innerHTML = "";

    return false;
};

var setup = function setup(csrf) {
    var settingsLink = document.querySelector("#settingsLink");
    settingsLink.addEventListener("click", function (e) {
        e.preventDefault();

        sendAjax("GET", "/getAccount", null, function (result) {
            console.log(result);
            ReactDOM.render(React.createElement(SettingsPage, { account: result, csrf: csrf }), document.querySelector("#content"));

            premiumBox = document.querySelector("#premiumBox");
            if (result.premium === true) {
                premiumBox.setAttribute("checked", true);
            } else {
                premiumBox.removeAttribute("checked");
            }
        });

        document.querySelector("#errorMessage").innerHTML = "";

        return false;
    });

    var mainLink = document.querySelector("#mainLink");
    mainLink.addEventListener("click", loadMainPage);

    loadMainPage();
};

var getToken = function getToken() {
    sendAjax("GET", "/getToken", null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
