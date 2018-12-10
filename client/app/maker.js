const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("Not all fields were filled out.");
        return false;
    }

    sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
        loadDomosFromServer();
    });

    return false;
};

// TODO: The next like 5 functions can be unified
const handleSettings = (e) => {
    e.preventDefault();

    sendAjax("POST", $("#settingsForm").attr("action"), $("#settingsForm").serialize(), function(){
        loadMainPage();
    });
    
    return false;
};

const handleMilestone = (e) => {
    e.preventDefault();

    sendAjax("POST", $("#milestoneForm").attr("action"), $("#milestoneForm").serialize(), function(){
        loadMainPage();
    });

    return false;
};

const handleRequirement = (e) => {
    e.preventDefault();

    sendAjax("POST", $(e.target).attr("action"), $(e.target).serialize(), function(){
        loadMainPage();
    });

    return false;
};

const handleDelete = (e) => {
    e.preventDefault();

    sendAjax("POST", '/deleteProj', $("#deleteForm").serialize(), function(){
        loadMainPage();
    });

    return false;
};

const DomoForm = (props) => {
    return(
            <form
                id="domoForm"
                onSubmit={handleDomo}
                name="domoForm"
                action="/maker"
                method="POST"
                className="mainForm"
            >
                <h1>New Project</h1>
                <label htmlFor="name">Name: </label>
                <div><input id="domoName" type="text" name="name" placeholder="Project Name"/></div>

                <label htmlFor="age">Description: </label>
                <div><textarea id="domoAge" className="projectDesc" type="text" name="description" placeholder="Description"></textarea></div>

                <input type="hidden" name="_csrf" value={props.csrf}/>

                <input className="formSubmit" type="submit" value="Create Project"/>
            </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0){
        return(
            <div className="domoList">
            <h1>Your Projects</h1>
                <div className="addDomo">
                    <h3>Create New Project</h3>
                </div>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return(
            <div key={domo._id} className="domo">
                <h3>{domo.name}</h3>
                <h4>Due {domo.deadline}</h4>
            </div>
        );
    });

    return(
        <div className="domoList">
        <h1>Your Projects</h1>
            {domoNodes}
            <div className="addDomo">
                <h3>Create New Project</h3>
            </div>
        </div>
    );
};

const FullProject = (props) => {
    if(!props.project.milestones || props.project.milestones.length === 0){
        return(
            <div className="fullProject">
                <form id="deleteForm" onSubmit={handleDelete}>
                    <input type="hidden" name="project" value={props.project.name}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>

                    <button type="submit">
                        <img src="assets/img/delete.png"/>
                    </button>
                </form>
                <h1>{props.project.name}</h1>
                <h3>Due {props.project.deadline}</h3>
                <p>{props.project.description}</p>
                <h2>No Milestones Defined</h2>
                <form
                id="milestoneForm"
                name="milestoneForm"
                onSubmit={handleMilestone}
                action="/milestone"
                method="POST"
                >
                    <label htmlFor="name">New Milestone: </label>
                    <div><input id="name" type="text" name="name" placeholder="Name"/></div>

                    <div><textarea id="MSDesc" type="text" name="description" placeholder="Description"></textarea></div>

                    <input type="hidden" name="project" value={props.project.name}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="formSubmit" type="submit" value="Create New Milestone"/>
                </form>
            </div>
        );
    }

    const milestoneNodes = props.project.milestones.map(function(milestone) {
        if(!milestone.requirements || milestone.requirements.length === 0){
            return(
                <div className="milestone">
                    <h2>{milestone.name}</h2>
                    <h4>Due {milestone.deadline}</h4>
                    <p>{milestone.description}</p>
                    <h3>No Requirements Defined</h3>
                    <form
                    id="requirementForm"
                    name="requirementForm"
                    onSubmit={handleRequirement}
                    action="/requirement"
                    method="POST"
                    >
                        <label htmlFor="name">New Requirement: </label>
                        <div><input id="name" type="text" name="name" placeholder="Requirement Name"/></div>

                        <input type="hidden" name="project" value={props.project.name}/>
                        <input type="hidden" name="milestone" value={milestone._id}/>
                        <input type="hidden" name="_csrf" value={props.csrf}/>
                        <input className="formSubmit" type="submit" value="Create New Requirement"/>
                    </form>
                </div>
            );
        }

        const requirementNodes = milestone.requirements.map(function(requirement) {
            return(
                <div className="requirement">
                    <label>{requirement.name}: </label>
                    <input type="checkbox" value={requirement.completed}/>
                </div>
            );
        });

        return(
            <div className="milestone">
                <h2>{milestone.name}</h2>
                <h4>Due {milestone.deadline}</h4>
                <p>{milestone.description}</p>
                <h3>Requirements:</h3>
                {requirementNodes}
                <form
                    id="requirementForm"
                    name="requirementForm"
                    onSubmit={handleRequirement}
                    action="/requirement"
                    method="POST"
                    >
                        <label htmlFor="name">New Requirement: </label>
                        <div><input id="name" type="text" name="name" placeholder="Requirement Name"/></div>

                        <input type="hidden" name="project" value={props.project.name}/>
                        <input type="hidden" name="milestone" value={milestone._id}/>
                        <input type="hidden" name="_csrf" value={props.csrf}/>
                        <input className="formSubmit" type="submit" value="Create New Requirement"/>
                </form>
            </div>
        );
    });

    return(
        <div className="fullProject">
            <form id="deleteForm" onSubmit={handleDelete}>
                <input type="hidden" name="project" value={props.project.name}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>

                <button type="submit">
                    <img src="assets/img/delete.png"/>
                </button>
            </form>
            <h1>{props.project.name}</h1>
            <h3>Due {props.project.deadline}</h3>
            <p>{props.project.description}</p>
            <h2>Milestones:</h2>
            {milestoneNodes}
            <form
                id="milestoneForm"
                name="milestoneForm"
                onSubmit={handleMilestone}
                action="/milestone"
                method="POST"
            >
                <label htmlFor="name">New Milestone: </label>
                <div><input id="name" type="text" name="name" placeholder="Name"/></div>

                <div><textarea id="MSDesc" type="text" name="description" placeholder="Description"></textarea></div>

                <input type="hidden" name="project" value={props.project.name}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Create New Milestone"/>
            </form>
        </div>
    );
};

const SettingsPage = (props) => {
    return(
        <form
            id="settingsForm"
            name="settingsForm"
            onSubmit={handleSettings}
            action="/settings"
            method="POST"
            className="mainForm"
        >
            <h1>Settings</h1>
            <label htmlFor="passChange">Change Password:</label>
            <div><input id="passChange" type="password" name="passChange" placeholder="new password"/></div>
            <div><input id="passChange2" type="password" name="passChange2" placeholder="confirm password"/></div>
            
            <div><label htmlFor="premiumBox">Premium Membership: </label>
            <input id="premiumBox" type="checkbox" name="premium"/></div>
            
            <div><label htmlFor="deleteBox">Delete Account: </label>
            <input id="deleteBox" type="checkbox" name="delete" /></div>
            
            <div><label htmlFor="passAuth">Type current password to authorize changes: </label></div>
            <div><input id="passAuth" type="password" name="passAuth" placeholder="password"/></div>
            
            <input type="hidden" name="_csrf" value={props.csrf}/>

            <input className="formSubmit" type="submit" value="Change Settings"/>
        </form>
    );
};

const loadDomosFromServer = () => {
    sendAjax("GET", "/getDomos", null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos}/>, document.querySelector("#content")  
        );

        const projects = document.querySelectorAll(".domo");
        for(var i = 0; i < projects.length; i++){
            const currentProject = data.domos[i];
            projects[i].addEventListener("click", (e) => {
                sendAjax("GET", "/getToken", null, (result) => {
                    e.preventDefault();
                    ReactDOM.render(
                        <FullProject csrf={result.csrfToken} project={currentProject} />, document.querySelector("#content")
                    );

                    return false;
                });
            });
        }
        
        const newProjectButton = document.querySelector(".addDomo");
        newProjectButton.addEventListener("click", (e) => {
            sendAjax("GET", "/getToken", null, (result) => {
                e.preventDefault();
                ReactDOM.render(
                    <DomoForm csrf={result.csrfToken}/>, document.querySelector("#content")
                );
                return false;
            });
        });
    });
};

const loadMainPage = (e) => {
    if(e){
        e.preventDefault();
    }

    ReactDOM.render(
        <DomoList domos={[]}/>, document.querySelector("#content")
    );

    loadDomosFromServer();

    document.querySelector("#errorMessage").innerHTML = "";

    return false;
};

const setup = function(csrf){
    const settingsLink = document.querySelector("#settingsLink");
    settingsLink.addEventListener("click", (e) => {
        e.preventDefault();

        sendAjax("GET", "/getAccount", null, (result) => {
            console.log(result);
            ReactDOM.render(
                <SettingsPage account={result} csrf={csrf}/>, document.querySelector("#content")
            );

            premiumBox = document.querySelector("#premiumBox");
            if(result.premium === true){
                premiumBox.setAttribute("checked", true);
            } else {
                premiumBox.removeAttribute("checked");
            }
        });

        document.querySelector("#errorMessage").innerHTML = "";

        return false;
    });

    const mainLink = document.querySelector("#mainLink");
    mainLink.addEventListener("click", loadMainPage);

    loadMainPage();
};

const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});