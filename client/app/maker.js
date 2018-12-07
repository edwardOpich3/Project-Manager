const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width: 'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == ''){
        handleError("RAWR! All fields are required");
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
        <div>
            <form
                id="domoForm"
                onSubmit={handleDomo}
                name="domoForm"
                action="/maker"
                method="POST"
                className="domoForm"
            >
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Project Name"/>
                <label htmlFor="age">Description: </label>
                <input id="domoAge" type="text" name="description" placeholder="Description"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="makeDomoSubmit" type="submit" value="Create Project"/>
            </form>
            <button id="closeButton">Back to Project View</button>
        </div>
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
            <div>
                <form id="deleteForm" onSubmit={handleDelete}>
                    <input type="hidden" name="project" value={props.project.name}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>

                    <input type="submit" value="Delete Project"/>
                </form>
                <h3>{props.project.name}</h3>
                <h4>Due {props.project.deadline}</h4>
                <p>{props.project.description}</p>
                <h4>No Milestones Defined</h4>
                <form
                id="milestoneForm"
                name="milestoneForm"
                onSubmit={handleMilestone}
                action="/milestone"
                method="POST"
                className="mainForm"
                >
                    <label htmlFor="name">Name: </label>
                    <input id="name" type="text" name="name" placeholder="Milestone Name"/>
                    <input id="MSDesc" type="text" name="description" placeholder="Description"/>

                    <input type="hidden" name="project" value={props.project.name}/>
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="formSubmit" type="submit" value="Create New Milestone"/>
                </form>
                <button id="closeButton">Return to List</button>
            </div>
        );
    }

    const milestoneNodes = props.project.milestones.map(function(milestone) {
        if(!milestone.requirements || milestone.requirements.length === 0){
            return(
                <div>
                    <h4>{milestone.name}</h4>
                    <h5>Due {milestone.deadline}</h5>
                    <p>{milestone.description}</p>
                    <h5>No Requirements Defined</h5>
                    <form
                    id="requirementForm"
                    name="requirementForm"
                    onSubmit={handleRequirement}
                    action="/requirement"
                    method="POST"
                    className="mainForm"
                    >
                        <label htmlFor="name">Name: </label>
                        <input id="name" type="text" name="name" placeholder="Requirement Name"/>

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
                <div>
                    <h5>{requirement.name}</h5>
                    <input type="checkbox" value={requirement.completed}/>
                </div>
            );
        });

        return(
            <div>
                <h4>{milestone.name}</h4>
                <h5>Due {milestone.deadline}</h5>
                <p>{milestone.description}</p>
                {requirementNodes}
                <form
                    id="requirementForm"
                    name="requirementForm"
                    onSubmit={handleRequirement}
                    action="/requirement"
                    method="POST"
                    className="mainForm"
                    >
                        <label htmlFor="name">Name: </label>
                        <input id="name" type="text" name="name" placeholder="Requirement Name"/>

                        <input type="hidden" name="project" value={props.project.name}/>
                        <input type="hidden" name="milestone" value={milestone._id}/>
                        <input type="hidden" name="_csrf" value={props.csrf}/>
                        <input className="formSubmit" type="submit" value="Create New Requirement"/>
                </form>
            </div>
        );
    });

    return(
        <div>
            <form id="deleteForm" onSubmit={handleDelete}>
                <input type="hidden" name="project" value={props.project.name}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>

                <input type="submit" value="Delete Project"/>
            </form>
            <h3>{props.project.name}</h3>
            <h4>Due {props.project.deadline}</h4>
            <p>{props.project.description}</p>
            {milestoneNodes}
            <form
                id="milestoneForm"
                name="milestoneForm"
                onSubmit={handleMilestone}
                action="/milestone"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="name">Name: </label>
                <input id="name" type="text" name="name" placeholder="Milestone Name"/>
                <input id="MSDesc" type="text" name="description" placeholder="Description"/>

                <input type="hidden" name="project" value={props.project.name}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Create New Milestone"/>
            </form>
            <button id="closeButton">Return to List</button>
        </div>
    );
};

const SettingsPage = (props) => {
    return(
        <div>
            <h1>Settings</h1>
            <form
                id="settingsForm"
                name="settingsForm"
                onSubmit={handleSettings}
                action="/settings"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="passChange">Change Password: </label>
                <input id="passChange" type="password" name="passChange" placeholder="new password"/>
                <input id="passChange2" type="password" name="passChange2" placeholder="confirm password"/>
                <label htmlFor="premiumBox">Premium Membership: </label>
                <input id="premiumBox" type="checkbox" name="premium" value={props.account.premium} />
                <label htmlFor="deleteBox">Delete Account: </label>
                <input id="deleteBox" type="checkbox" name="delete" />

                <label htmlFor="passAuth">Type current password to authorize changes: </label>
                <input id="passAuth" type="password" name="passAuth" placeholder="password"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Change Settings"/>
            </form>
        </div>
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

                    const closeButton = document.querySelector("#closeButton");
                    closeButton.addEventListener("click", loadMainPage);

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
                const closeButton = document.querySelector("#closeButton");
                closeButton.addEventListener("click", loadMainPage)
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
        });

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