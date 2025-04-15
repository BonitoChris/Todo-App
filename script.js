// Enclosure
const todoApp = (function () {
  //#region Initialization Region

  // Collection of Task
  let taskCollection = [];

  // Collection of Workspace
  let collectionOfWorkspace = [];

  // As soon as the tasks and workspaces were loaded
  // the last key for both task and workspace were already counted
  let keyCount = 1;
  let keyCountWorkspace = 1;

  //Colors
  let honeyYellow = "#f9cd6b";
  let royalPurple = "#4840a3";
  let skyLavander = "#9cbbfc";
  let lightSkyBlue = "#d8eff7";
  let pearl = "#fbfcf8";
  let silverGray = "#afafaf";
  let dimGray = "#6e6e6e";
  let blackShadow = "rgba(46, 46, 46, 0.3)";
  //#endregion

  // #region Factory Region
  // Factory Function
  // This will create the objects
  // This factory function create an object of these parameters for Task
  function createTodoObj(title, deadline, priority, workspace) {
    return {
      title,
      deadline,
      priority,
      workspace,
    };
  }

  // Create
  function createWorkspaceObj(key, workspaceTitle) {
    return {
      key,
      workspaceTitle,
    };
  }

  function creatingTodoItem(key, objTodo) {
    return {
      key,
      status: "Pending",
      title: objTodo.title,
      deadline: objTodo.deadline,
      priority: objTodo.priority,
      workspace: objTodo.workspace,
    };
  }

  function collectionOfElementsFactory(select, input) {
    return { select, input };
  }
  // End Factory Function
  //#endregion

  //#region Local Storage Section
  // Renedering Element based on the Values of
  function saveToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(taskCollection));
    localStorage.setItem("workspace", JSON.stringify(collectionOfWorkspace));
  }

  function loadWorkspaces(
    lastTodoHeaderChild,
    rightContainer,
    cbCreateWorkspace
  ) {
    const savedWorkspace = localStorage.getItem("workspace");
    workspaceCollection = JSON.parse(savedWorkspace);
    collectionOfWorkspace = workspaceCollection ? workspaceCollection : [];
    let largestKey = 0;
    console.log(collectionOfWorkspace);
    if (savedWorkspace) {
      workspaceCollection.forEach((obj) => {
        let node = cbCreateWorkspace(obj.key, obj.workspaceTitle);

        rightContainer.insertBefore(node, lastTodoHeaderChild);
        if (largestKey < obj.key) {
          largestKey = obj.key;
        }
      });
      keyCountWorkspace = collectionOfWorkspace.length ? largestKey + 1 : 1;
    }
  }

  function loadFromLocalStorage(workspaces, cbGenerateTask) {
    const savedTodos = localStorage.getItem("todoList");

    taskCollection = JSON.parse(savedTodos);
    let largestKey = 0;
    taskCollection.forEach((obj) => {
      if (largestKey < obj.key) {
        largestKey = obj.key;
      }
    });

    if (savedTodos) {
      taskCollection.forEach((obj) => {
        appendToWorkspace(obj, workspaces, cbGenerateTask);
      });

      keyCount = taskCollection.length ? largestKey + 1 : 1;
    }
  }

  //#endregion

  // Been Using

  //#region EVENT HANDLERS
  function useStateInput(initialValue) {
    let state = initialValue;

    function getState() {
      return state;
    }

    function setState(newValue) {
      state = newValue;
    }

    return [getState, setState];
  }
  //#endregion

  //#region Workspace
  function onClickCreateOrCancelButton(
    isSaveVisible,
    createButton,
    buttonContainer,
    cbChangeH3Element,
    h3Element
  ) {
    // Ensure the elements exist
    if (!createButton || !buttonContainer) {
      console.error("Invalid DOM elements passed to the function");
      return;
    }
    if (!isSaveVisible) {
      createButton.style.display = "none";
      buttonContainer.style.display = "block";
      h3Element.textContent = "";
      h3Element.setAttribute("placeholder", "Enter Workspace Title");
      h3Element.focus();
      changeH3Element(h3Element, true);
    } else {
      createButton.style.display = "block";
      buttonContainer.style.display = "none";
      h3Element.textContent = "Create Workspace";
      changeH3Element(h3Element, false);
    }
  }

  function changeH3Element(h3Element, boolean) {
    h3Element.setAttribute("contenteditable", boolean);
    h3Element.classList.toggle("todo-input");
    h3Element.setAttribute("type", "text");
  }

  function createWorkspace(key, elementValue) {
    // Why INI some vars? for READIBILITY
    let h3Title = elementValue;

    let DivTodoHeader = document.createElement("div");
    let DivTextContainer = document.createElement("div");
    let DivTaskContainer = document.createElement("div");
    let HR = document.createElement("hr");
    let H3 = document.createElement("h3");
    let I = document.createElement("i");
    let BUTTON = document.createElement("button");
    //Array
    let iconClass = ["fa-solid fa-ellipsis fa-xl"];
    const h3TitleFormat = h3Title.split(" ").join("-").toLowerCase();
    let todoHeaderClasses = ["todo-header", "workspace", h3TitleFormat];
    todoHeaderClasses.forEach((element, index) => {
      DivTodoHeader.classList.add(...todoHeaderClasses[index].split(" "));
    });
    DivTodoHeader.setAttribute("data-key", key);

    //
    DivTextContainer.classList.add("text-container");
    DivTaskContainer.classList.add("task-container");

    H3.textContent = h3Title;

    iconClass.forEach((element, index) => {
      I.classList.add(...iconClass[index].split(" "));
    });
    BUTTON.classList.add("field");
    BUTTON.classList.add("option-workspace");
    BUTTON.appendChild(I);

    DivTodoHeader.appendChild(DivTextContainer);
    DivTodoHeader.appendChild(HR);

    DivTodoHeader.appendChild(DivTaskContainer);

    DivTextContainer.appendChild(H3);
    DivTextContainer.appendChild(BUTTON);

    return DivTodoHeader;
  }

  function saveWorkspaceTitle(
    cbGetElementValue,
    cbCreateWorkspace,
    cbSaveToLocalStorage,
    cbCreateWorkspaceObj
  ) {
    let workspaceKey = keyCountWorkspace++;
    let workspaceTitle = cbGetElementValue();

    let workspaceObject = cbCreateWorkspaceObj(workspaceKey, workspaceTitle);

    let clonedWorkspaceCollection = [...collectionOfWorkspace];

    clonedWorkspaceCollection.push(workspaceObject);

    collectionOfWorkspace = clonedWorkspaceCollection;

    cbSaveToLocalStorage();
    return cbCreateWorkspace(workspaceKey, workspaceTitle);
  }

  function saveChangesWorkspace(data, cbSaveToLocalStorage) {
    const [key, workspaceTitle] = data;

    const clonedWorkspaceCollection = [...collectionOfWorkspace];

    const findWorkspaceTitle = clonedWorkspaceCollection.find(
      (obj) => obj.key == key
    );
    findWorkspaceTitle.workspaceTitle = workspaceTitle;

    collectionOfWorkspace = clonedWorkspaceCollection;

    cbSaveToLocalStorage();
  }
  // This will change the task's workspace title when the Workspace is renamed
  function renameTasksWorkspace(titles, cbSaveToLocalStorage) {
    // I destructure the titles array into "oldTitle" and "newTitle"
    const [oldTitle, newTitle] = titles;

    // This variable will create a copy of taskCollection to prevent direct changes
    const clonedTaskCollection = [...taskCollection];

    // This will store all the tasks that has the old title using filter
    const findTaskWithOldTitles = clonedTaskCollection.filter(
      (obj) => obj.workspace === oldTitle.split(" ").join("-").toLowerCase()
    );

    // This will loop all the task that has old titles and change the workspace
    // to new workspace title
    findTaskWithOldTitles.forEach((task) => {
      task.workspace = newTitle.split(" ").join("-").toLowerCase(); //Should always be formatted like this
      console.log(task);
    });

    clonedTaskCollection.forEach((tasksChanged, index) => {
      if (taskCollection[index].key == tasksChanged.key) {
        // This should insert the new task where a workspace was changed
        taskCollection[index] = tasksChanged;
      }
    });

    console.log(findTaskWithOldTitles);

    cbSaveToLocalStorage();
  }

  function revertWorkspaceTitle(data) {
    // Destructured the data to "key" and "nodeReference"
    const [key, nodeReference] = data;

    // Looping through the collectionOfWorkspace using "find" method and finding an object using "key"
    const findWorkspace = collectionOfWorkspace.find((obj) => obj.key == key);

    // Storing the unmodified workspaceTitle;
    const originalWorkspaceTitle = findWorkspace.workspaceTitle;

    // Passing the unmodified workspaceTitle to the textContent of the node
    nodeReference.textContent = originalWorkspaceTitle;
  }

  // FUNCTION deleteWorkspace
  // PARAMETERS key | workspaceNodeReference | callbackFUnction
  function deleteWorkspace(
    data,
    cbLoopThoughWorkspaceAndTask,
    cbDeleteElement,
    cbConfirmDialogDeletion,
    cbSaveToLocalStorage
  ) {
    const [key, nodeWorkspaceReference] = data;
    const workspaceTitle =
      nodeWorkspaceReference.children[0].children[0].textContent.toLowerCase();

    const tasks = [...nodeWorkspaceReference.children[2].children];
    // CLONE collectionOfWorkspace
    let cloneCollectionOfWorkspace = [...collectionOfWorkspace];
    // CLONE taskCollection
    let cloneTaskCollection = [...taskCollection];
    // IF you want to delete the workspace and the tasks inside
    if (cbConfirmDialogDeletion("task")) {
      if (cbConfirmDialogDeletion("workspace")) {
        // LOOP through CLONE Workspace - ill be using a callback for this (cbLoopThroughWorkspace)
        cloneCollectionOfWorkspace = cbLoopThoughWorkspaceAndTask(
          "workspace",
          key,
          cloneCollectionOfWorkspace
        );
        console.log(cloneCollectionOfWorkspace);
        // LOOP through CLONE Task
        cloneTaskCollection = cbLoopThoughWorkspaceAndTask(
          "task",
          workspaceTitle,
          cloneTaskCollection
        );
        console.log(cloneTaskCollection);

        collectionOfWorkspace = cloneCollectionOfWorkspace;
        taskCollection = cloneTaskCollection;

        // DELETE the Workspace that has the corresponding KEY - ill be using a callback for this (cbDeleteElement)
        cbDeleteElement(nodeWorkspaceReference);
        tasks.forEach((node) => cbDeleteElement(node));
        // DELETE the Tasks that has the corresponding WORKSPACETITLE - ill be using a callback for this (cbDeleteElement)
        cbSaveToLocalStorage();
      } else {
        alert("No Action was Performed");
      }
    } else {
      if (cbConfirmDialogDeletion("workspace")) {
        // ELSE you want to delete the workspace but not the tasks inside
        // LOOP through CLONE Workspace - ill be using a callback for this (cbLoopThroughWorkspace)
        cloneCollectionOfWorkspace = cbLoopThoughWorkspaceAndTask(
          "workspace",
          key,
          cloneCollectionOfWorkspace
        );
        console.log(cloneCollectionOfWorkspace);

        collectionOfWorkspace = cloneCollectionOfWorkspace;

        // DELETE the Workspace that has the corresponding KEY - ill be using a callback for this (cbDeleteElement)
        cbDeleteElement(nodeWorkspaceReference);
        cbSaveToLocalStorage();
      } else {
        alert("No Action was Performed");
      }
    }
  }

  function confirmDialogDeletion(taskOrWorkspace) {
    if (taskOrWorkspace === "task") {
      let confirmDeletionOfTask = confirm(
        "Would you like to delete the tasks as well?"
      );
      return confirmDeletionOfTask;
    } else {
      let confirmDeletionOfWorkspace = confirm(
        "Are you sure you want to proceed on this action?"
      );

      return confirmDeletionOfWorkspace;
    }
  }

  function loopThroughWorkspaceAndTask(taskOrWorkspace, key, array) {
    if (taskOrWorkspace === "task") {
      return array.filter((obj) => obj.workspace != key);
    } else {
      return array.filter((obj) => obj.key != key); // key -> workspace
    }
  }

  //#endregion

  //#region Task
  // Saving Task
  function saveTask(
    workspaceNodeList,
    fieldValues,
    cbAppendToWorkspace,
    cbGenerateTask,
    cbSaveToLocalStorage
  ) {
    // INITIALIZE key
    let key = keyCount++;

    // INITIALIZE task data
    const [title, deadline, priority, section] = fieldValues;
    let clonedTaskCollection = [...taskCollection];

    let taskData = createTodoObj(title, deadline, priority, section);
    let taskInformation = creatingTodoItem(key, taskData);

    let formattedCurrentDate = new Date(deadline).getTime();

    let index = clonedTaskCollection.findIndex(
      (element) => new Date(element.deadline).getTime() > formattedCurrentDate
    );

    if (index === -1) {
      clonedTaskCollection.splice(
        clonedTaskCollection.length,
        0,
        taskInformation
      );
    } else {
      clonedTaskCollection.splice(index, 0, taskInformation);
    }

    // clonedTaskCollection.push(taskInformation);

    taskCollection = clonedTaskCollection;

    cbAppendToWorkspace(taskInformation, workspaceNodeList, cbGenerateTask);
    cbSaveToLocalStorage();
  }
  // Generate Task
  function generateTask(taskData) {
    const { key, status, title, deadline, priority } = taskData;

    const taskPlaceholder = document.createElement("div");
    taskPlaceholder.setAttribute("data-key", key);
    taskPlaceholder.classList.add("task-placeholder");

    const leftTaskContainer = document.createElement("div");
    leftTaskContainer.classList.add("left-task-container");
    const rightTaskContainer = document.createElement("div");
    rightTaskContainer.classList.add("right-task-container");

    //Check
    const iCheckTask = document.createElement("i");
    //Date
    const iTaskDeadline = document.createElement("i");
    iTaskDeadline.setAttribute("title", deadline);
    //Priority
    const iTaskPriority = document.createElement("i");
    iTaskPriority.classList.add("priority"); // Add the base class

    if (priority == 1) {
      iTaskPriority.classList.add("low-priority");
      iTaskPriority.setAttribute("title", "Low Priority");
    } else if (priority == 2) {
      iTaskPriority.classList.add("medium-priority");
      iTaskPriority.setAttribute("title", "Medium Priority");
    } else {
      iTaskPriority.classList.add("high-priority");
      iTaskPriority.setAttribute("title", "High Priority");
    }

    //Delete
    const iTaskDelete = document.createElement("i");

    // Iteration
    const icons = [
      "fa-regular fa-circle fa-xl checkbox",
      "fa-solid fa-calendar-days fa-xl calendar",
      "priority-test",
      "fa-solid fa-circle-minus fa-xl delete",
    ];
    icons.forEach((element, index) => {
      if (index === 0) {
        iCheckTask.classList.add(...icons[index].split(" "));
      } else if (index === 1) {
        iTaskDeadline.classList.add(...icons[index].split(" "));
      } else if (index === 2) {
        iTaskPriority.classList.add(...icons[index].split(" "));
      } else {
        iTaskDelete.classList.add(...icons[index].split(" "));
      }
    });

    const inputCheckbox = document.createElement("input");
    inputCheckbox.classList.add("task-checkbox");
    inputCheckbox.setAttribute("type", "checkbox");
    inputCheckbox.hidden = true;
    //
    const PTITLE = document.createElement("p");
    PTITLE.textContent = title;
    //
    const DIVSTATUS = document.createElement("div");
    DIVSTATUS.classList.add("status-btn");
    DIVSTATUS.textContent = status;
    // Append Child Nodes

    leftTaskContainer.append(iCheckTask, inputCheckbox, PTITLE);
    rightTaskContainer.append(iTaskDeadline, DIVSTATUS, iTaskDelete);
    // Append Parent Nodes
    taskPlaceholder.appendChild(iTaskPriority);
    taskPlaceholder.appendChild(leftTaskContainer);
    taskPlaceholder.appendChild(rightTaskContainer);
    return taskPlaceholder;
  }

  function appendToWorkspace(taskObj, nodeList, cbGenerateTask) {
    const workspaces = nodeList;
    const { workspace, ...rest } = taskObj;
    const deadline = rest.deadline;
    const taskNode = cbGenerateTask(rest);
    let taskContainer;
    let taskPlaceholderNodeList;
    let isInserted = false;
    if (workspaces.length > 1) {
      workspaces.forEach((node, index) => {
        if (node.classList.contains(workspace)) {
          taskContainer = node.querySelector(".task-container");

          taskPlaceholderNodeList =
            taskContainer.querySelectorAll(".task-placeholder");

          if (taskPlaceholderNodeList.length > 0) {
            taskPlaceholderNodeList.forEach((placeholder) => {
              let currentIteratedDate =
                placeholder.children[2].children[0].title;

              if (deadline < currentIteratedDate && !isInserted) {
                taskContainer.insertBefore(taskNode, placeholder);
                isInserted = true;
              }
              if (!isInserted) {
                taskContainer.appendChild(taskNode);
              }
            });
          } else {
            taskContainer.appendChild(taskNode);
          }
        }
        if (index === 0) {
          taskContainer = node.querySelector(".task-container");
          taskContainer.appendChild(taskNode);
        }
      });
    } else {
      taskContainer = workspaces[0].querySelector(".task-container");
      taskContainer.appendChild(taskNode);
    }
  }

  function generateOption(nodeSelect) {
    if (collectionOfWorkspace.length > 0) {
      let optionValues = [...collectionOfWorkspace];
      nodeSelect.textContent = "";
      let baseOptionNode = document.createElement("option");
      baseOptionNode.textContent = "Select Workspace";
      baseOptionNode.disabled = true;
      baseOptionNode.selected = true;
      optionValues.forEach((workspace, index) => {
        let optionNode = document.createElement("option");
        optionNode.setAttribute(
          "value",
          workspace.workspaceTitle.split(" ").join("-").toLowerCase()
        );
        optionNode.textContent = workspace.workspaceTitle;
        if (index === 0) {
          nodeSelect.appendChild(baseOptionNode);
        }
        nodeSelect.appendChild(optionNode);
      });
      if (!nodeSelect.firstChild) {
        nodeSelect.appendChild(baseOptionNode);
      }
    } else {
      console.log("No Workspaces");
    }
  }

  function deleteTask(key, nodeElement, cbDeleteElement, cbSaveToLocalStorage) {
    let filteredTaskCollection = [
      ...taskCollection.filter((obj) => obj.key != key),
    ];

    taskCollection = filteredTaskCollection;

    cbDeleteElement(nodeElement);
    cbSaveToLocalStorage();
  }
  function deleteElement(nodeElement) {
    nodeElement.classList.add("deleted");
    setTimeout(() => {
      nodeElement.remove(nodeElement);
    }, 300);
  }

  // Change the status of the task to "Pending"/"On Progress"
  function changeTaskStatus(data, cbHighlightTaskOnProgress) {
    const [status, key, node] = data;

    let clonedTaskCollection = [...taskCollection];

    if (status === "Pending") {
      cbHighlightTaskOnProgress(node, blackShadow);
    } else if (status === "On Progress") {
      cbHighlightTaskOnProgress(node, skyLavander);
    } else {
      cbHighlightTaskOnProgress(node, honeyYellow);
    }

    let findTaskIndex = clonedTaskCollection.find((obj) => obj.key == key);
    findTaskIndex.status = status;
    taskCollection = clonedTaskCollection;
    saveToLocalStorage();
    return status;
  }

  function highlightTaskOnProgress(node, color) {
    const taskPlaceholder = node;

    taskPlaceholder.style.boxShadow = `0px 0px 10px ${color}`;
  }

  // Check task to mark task as "Done"
  function onCheck(
    data,
    nodeCheckbox,
    nodeI,
    cbChangeIcon,
    cbChangeTaskStatus,
    cbHighlightTaskOnProgress
  ) {
    let checkbox = nodeCheckbox;
    const [newStatus, key, node] = data;

    const newData = [newStatus, key, node];
    const previousData = ["On Progress", key, node];

    if (!checkbox.checked) {
      checkbox.checked = true;
      cbChangeIcon(nodeI, checkbox);
      return cbChangeTaskStatus(newData, cbHighlightTaskOnProgress);
    } else {
      checkbox.checked = false;
      cbChangeIcon(nodeI, checkbox);
      return cbChangeTaskStatus(previousData, cbHighlightTaskOnProgress);
    }
  }

  function changeIcon(nodeI, nodeCheckbox) {
    const iTag = nodeI;
    const checkbox = nodeCheckbox;

    const icon = [
      "fa-solid fa-circle-check fa-xl",
      "fa-regular fa-circle fa-xl",
    ];

    if (checkbox.checked) {
      iTag.classList.remove(...icon[1].split(" "));
      iTag.classList.add(...icon[0].split(" "));
    } else {
      iTag.classList.remove(...icon[0].split(" "));
      iTag.classList.add(...icon[1].split(" "));
    }
  }

  //#endregion

  function removeClassTooltip(tooltipReference) {
    tooltipReference.classList.remove("clicked");
  }

  function collectWorkspace(nodeReference) {
    let workspaces = [...nodeReference.querySelectorAll(".workspace")];

    workspaces.forEach((workspace) => {
      workspace.children[2].textContent = "";
    });

    return workspaces;
  }

  //#region Reset Field Region
  function resetInputFields(elements) {
    elements.input.forEach((elem) => (elem.value = ""));
    elements.select.forEach((elem) => (elem.selectedIndex = 0));
  }
  //#endregion

  //#region Dragging Element Code Block

  //#endregion

  //#region Export Region
  return {
    loadFromLocalStorage,
    resetInputFields,
    collectionOfElementsFactory,
    onClickCreateOrCancelButton,
    changeH3Element,
    useStateInput,
    createWorkspace,
    saveWorkspaceTitle,
    saveTask,
    appendToWorkspace,
    generateTask,
    generateOption,
    deleteTask,
    deleteElement,
    saveToLocalStorage,
    loadWorkspaces,
    changeTaskStatus,
    onCheck,
    changeIcon,
    highlightTaskOnProgress,
    removeClassTooltip,
    createWorkspaceObj,
    saveChangesWorkspace,
    renameTasksWorkspace,
    revertWorkspaceTitle,
    deleteWorkspace,
    confirmDialogDeletion,
    loopThroughWorkspaceAndTask,
    collectWorkspace,
  };
  //#endregion
})();

document.addEventListener("DOMContentLoaded", function () {
  //#region Initialize Field Reference
  let cboSection = document.querySelector("#cbo_section");
  //#endregion

  //#region Div Containers
  // Main Container for Task and Workspace
  let getReferenceRightContainer = document.querySelector(".right-container");
  // Task Creation Container
  let getReferenceTaskCreationContainer = document.querySelector(
    ".task-creation-container"
  );
  let tooltipReference = document.querySelector(".tooltip-container");
  //#endregion

  let getH3ElementRefEvent =
    getReferenceRightContainer.lastElementChild.children[0].children[0];
  // Workspace Creation useState
  const [h3Value, seth3Value] = todoApp.useStateInput("");
  // Task Creation UseState
  const [deadline, setDeadline] = todoApp.useStateInput("");
  const [priority, setPriority] = todoApp.useStateInput("");
  const [section, setSection] = todoApp.useStateInput("");
  const [title, setTitle] = todoApp.useStateInput("");

  const getButtonContainerRef =
    getReferenceRightContainer.lastElementChild.children[0].children[2];

  //#region On Load
  getButtonContainerRef.style.display = "none";
  let workspaceCreationRef = getReferenceRightContainer.lastElementChild;
  todoApp.loadWorkspaces(
    workspaceCreationRef,
    getReferenceRightContainer,
    todoApp.createWorkspace
  );
  todoApp.generateOption(cboSection);
  todoApp.loadFromLocalStorage(
    todoApp.collectWorkspace(getReferenceRightContainer),
    todoApp.generateTask
  );
  //#endregion

  let nodeh3Collection =
    getReferenceRightContainer.querySelectorAll(".workspace");
  let nodeColectionOfWorkspace =
    getReferenceRightContainer.querySelectorAll(".workspace");

  //#region Task|Creation
  // INITIALIZE
  getReferenceTaskCreationContainer.addEventListener("change", function (e) {
    const elementBubbled = e.target;

    if (elementBubbled.id.includes("txt_deadline")) {
      setDeadline(elementBubbled.value);
    }
    if (elementBubbled.id.includes("cbo_priority")) {
      setPriority(elementBubbled.value);
    }
    if (elementBubbled.id.includes("cbo_section")) {
      setSection(elementBubbled.value);
    }
  });

  getReferenceTaskCreationContainer
    .querySelector("#txt_todoName")
    .addEventListener("input", function (e) {
      setTitle(e.target.value);
    });

  getReferenceTaskCreationContainer
    .querySelector("#btn_submit")
    .addEventListener("click", function (e) {
      e.preventDefault();

      let selectNodeList =
        getReferenceTaskCreationContainer.querySelectorAll("select");
      let inputNodeList =
        getReferenceTaskCreationContainer.querySelectorAll("input");

      let nodeList = todoApp.collectionOfElementsFactory(
        selectNodeList,
        inputNodeList
      );

      todoApp.resetInputFields(nodeList);
      if (title() && deadline() && priority()) {
        let getFieldValues = [title(), deadline(), priority(), section()];

        todoApp.saveTask(
          todoApp.collectWorkspace(getReferenceRightContainer),
          getFieldValues,
          todoApp.appendToWorkspace,
          todoApp.generateTask,
          todoApp.saveToLocalStorage
        );

        todoApp.loadFromLocalStorage(
          todoApp.collectWorkspace(getReferenceRightContainer),
          todoApp.generateTask
        );
      } else {
        alert("There are Fields arent filled");
      }
    });
  //#endregion

  //#region Task|Workspace|Deletion|Status
  getReferenceRightContainer.addEventListener("click", function (e) {
    const target = e.target;
    // Get Reference of right-container
    const getRefAncestorRightContainer = target.closest(".right-container");
    // Get Reference of todo-header
    const getRefAncestorTodoHeader =
      getRefAncestorRightContainer.lastElementChild;

    const getRefLeftTaskContainer = target.closest(".left-task-container");

    //Child of Last Ancestor of todo-header
    const getButtonContainerRef =
      getRefAncestorTodoHeader.children[0].children[2];
    const getCreateButtonRef = getRefAncestorTodoHeader.children[0].children[1];
    const getH3Ref = getRefAncestorTodoHeader.children[0].children[0];

    const getReferenceWorkspace = target.closest(".todo-header");

    let isSaveVisible;
    const getRefTaskPlaceholder = target.closest(".task-placeholder");
    const taskKey = target.closest(".task-placeholder")?.dataset?.key;
    let statusData;
    // Key
    if (target.classList.contains("delete")) {
      todoApp.deleteTask(
        taskKey,
        getRefTaskPlaceholder,
        todoApp.deleteElement,
        todoApp.saveToLocalStorage
      );
    }

    if (target.classList.contains("status-btn")) {
      if (target.textContent === "Pending") {
        statusData = ["On Progress", taskKey, getRefTaskPlaceholder];

        target.textContent = todoApp.changeTaskStatus(
          statusData,
          todoApp.highlightTaskOnProgress
        );
      } else {
        statusData = ["Pending", taskKey, getRefTaskPlaceholder];

        target.textContent = todoApp.changeTaskStatus(
          statusData,
          todoApp.highlightTaskOnProgress
        );
      }
    }

    if (target.classList.contains("checkbox")) {
      const getIconRef = getRefLeftTaskContainer.children[0];
      const getCheckboxRef = getRefLeftTaskContainer.children[1];

      const statusBtnRef = getRefTaskPlaceholder.children[2].children[2];

      statusData = ["Done", taskKey, getRefTaskPlaceholder];

      statusBtnRef.textContent = todoApp.onCheck(
        statusData,
        getCheckboxRef,
        getIconRef,
        todoApp.changeIcon,
        todoApp.changeTaskStatus,
        todoApp.highlightTaskOnProgress
      );

      console.log(previousStatus);
    }

    // Checks if the bubbled node is create-workspace
    if (target.classList.contains("create-workspace")) {
      isSaveVisible = false;
      todoApp.onClickCreateOrCancelButton(
        isSaveVisible,
        getCreateButtonRef,
        getButtonContainerRef,
        todoApp.changeH3Element,
        getH3Ref
      );
    }
    // Checks if the bubbled node is create-workspace
    if (target.classList.contains("cancel-workspace")) {
      isSaveVisible = true;
      todoApp.onClickCreateOrCancelButton(
        isSaveVisible,
        getCreateButtonRef,
        getButtonContainerRef,
        todoApp.changeH3Element,
        getH3Ref
      );
    }
    if (target.classList.contains("save-workspace")) {
      isSaveVisible = true;

      todoApp.onClickCreateOrCancelButton(
        isSaveVisible,
        getCreateButtonRef,
        getButtonContainerRef,
        todoApp.changeH3Element,
        getH3Ref
      );

      let nodeWorkspace = todoApp.saveWorkspaceTitle(
        h3Value,
        todoApp.createWorkspace,
        todoApp.saveToLocalStorage,
        todoApp.createWorkspaceObj
      );

      todoApp.generateOption(cboSection);

      //Iterate over Nodes

      getRefAncestorRightContainer.insertBefore(
        nodeWorkspace,
        getRefAncestorTodoHeader
      );
    }
    if (target.classList.contains("fa-ellipsis")) {
      const elementPosition = target.getBoundingClientRect();
      globalH3Ref = getReferenceWorkspace.children[0].children[0];

      tooltipReference.classList.toggle("clicked");
      tooltipReference.style.top = `${
        elementPosition.top - 40 + window.scrollY
      }px`;
      tooltipReference.style.left = `${
        elementPosition.left - 165 + window.scrollX
      }px`;
    } else {
      todoApp.removeClassTooltip(tooltipReference);
    }
  });

  getH3ElementRefEvent.addEventListener("input", function (e) {
    seth3Value(e.target.textContent);
  });

  document
    .querySelector(".tooltip-container")
    .addEventListener("click", function (e) {
      const elementCalled = e.target;

      if (elementCalled.children[0].classList.contains("fa-pen-to-square")) {
        console.log(elementCalled);
        todoApp.removeClassTooltip(tooltipReference);
        todoApp.changeH3Element(globalH3Ref, true);
        setTitle(globalH3Ref.textContent);
        console.log(title());
        globalH3Ref.focus();
      }
      if (elementCalled.children[0].classList.contains("fa-trash")) {
        const key = globalH3Ref.closest(".workspace").dataset?.key;
        const nodeWorkspaceReference = globalH3Ref.closest(".workspace");

        todoApp.deleteWorkspace(
          [key, nodeWorkspaceReference],
          todoApp.loopThroughWorkspaceAndTask,
          todoApp.deleteElement,
          todoApp.confirmDialogDeletion,
          todoApp.saveToLocalStorage
        );

        setTimeout(() => {
          todoApp.loadFromLocalStorage(
            todoApp.collectWorkspace(getReferenceRightContainer),
            todoApp.generateTask
          );
        }, 1500);
      }
    });

  nodeh3Collection.forEach((node) => {
    let nodeH3Ref = node.children[0].children[0];

    nodeH3Ref.addEventListener("keydown", function (e) {
      // ID of the Workspace from where its closestly triggered
      const key = nodeH3Ref.closest(".workspace").dataset?.key;
      // Checks if the key thats being triggered was Enter
      if (e.key === "Enter") {
        // Storing the values of title and the textContent of nodeH3Ref that is currently Editing
        const titles = [title(), nodeH3Ref.textContent];
        // Losing focus on the element
        nodeH3Ref.blur();
        // Changing the H3 Element into an Editable content
        todoApp.changeH3Element(nodeH3Ref, false);

        // This will update the workspace localstorage changes within the DOM
        todoApp.saveChangesWorkspace(
          [key, nodeH3Ref.textContent],
          todoApp.saveToLocalStorage
        );

        // This will find all the tasks that has the old Workspace Name
        // and update so that it sticks with the new Workspace Name
        todoApp.renameTasksWorkspace(titles, todoApp.saveToLocalStorage);
      }
      // Checks if the key thats being triggered was Escape
      if (e.key === "Escape") {
        nodeH3Ref.blur();
        todoApp.changeH3Element(nodeH3Ref, false);
        const arrOfValues = [key, nodeH3Ref];

        todoApp.revertWorkspaceTitle(arrOfValues);
      }
    });
  });

  document.addEventListener("scroll", function () {
    todoApp.removeClassTooltip(tooltipReference);
  });
  //#endregion

  //#region Dragging Code Block
  nodeColectionOfWorkspace.forEach((workspace) => {
    let task_container = workspace.querySelector("");
    workspace.addEventListener("mousedown", function (e) {
      const elementClicked = e.target;
      console.log(elementClicked);

      if (elementClicked.classList.contains("task-placeholder")) {
      }
    });
  });
  //#endregion
});
