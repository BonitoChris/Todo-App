const todoApp = (function () {
  let objTodo = createTodoObj();
  let objTodoList = [];
  let keyCount = 0;
  let keyCountTags = 0;
  // Factory Function
  function createTodoObj() {
    return {
      todoName: "",
      todoDeadline: "",
      todoPriority: "",
      todoTags: [],
    };
  }

  function creatingTodoItem(key, objTodo, tags) {
    return {
      key,
      status: "Not Done",
      todoName: objTodo.todoName,
      deadline: objTodo.todoDeadline,
      priority: objTodo.todoPriority,
      tags,
    };
  }

  // End Factory Function
  // On Input Function
  function onInput(inputFieldValue, prop) {
    //prop param should return a string
    //used a bracket notation for flexibility
    objTodo[prop] = inputFieldValue;
    console.log(objTodo);
  }

  // On Rotate Function
  function onRotate(getITag) {
    getITag.classList.toggle("rotated");
    console.log(getITag);
  }

  // Invoke this Function to insert tags
  function onToggleTag(
    key,
    contentValue,
    toggleValue,
    getITagElement,
    callbackOnRotate
  ) {
    let parsedKey = parseInt(key);
    const tempObject = {
      key: parsedKey,
      value: contentValue,
    };

    if (objTodo.todoTags.length < 3) {
      if (!toggleValue) {
        callbackOnRotate(getITagElement);

        objTodo.todoTags.push(tempObject);
        console.log(objTodo);
      } else {
        objTodo.todoTags = objTodo.todoTags.filter(
          (obj) => obj.key != parsedKey
        );
        callbackOnRotate(getITagElement);

        console.log(objTodo.todoTags);
      }
    } else if (objTodo.todoTags.length === 3 && toggleValue) {
      objTodo.todoTags = objTodo.todoTags.filter((obj) => obj.key != parsedKey);
      callbackOnRotate(getITagElement);

      console.log(objTodo.todoTags);
    } else {
      // Cant add more tags
      // Fix: Animation of Element should be here
      alert("Only 3 - 4 Tags");
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(objTodoList));
  }

  function loadFromLocalStorage(grandparent) {
    const savedTodos = localStorage.getItem("todoList");
    if (savedTodos) {
      objTodoList = JSON.parse(savedTodos);
      let sorted = objTodoList.sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
      sorted.forEach((todo) =>
        grandparent.appendChild(
          elementCreation(
            todo.todoName,
            todo.key,
            todo.tags,
            todo.deadline,
            todo.priority
          )
        )
      );

      keyCount = objTodoList.length
        ? objTodoList[objTodoList.length - 1].key
        : 0;
    }
  }

  function onSubmit(e, inputField, grandparent, tagContainerSrc) {
    e.preventDefault();
    // Initialization of Variable
    let isInserted = false;
    let isArrayInserted = false;
    let collectionOfTaskTag = [];
    console.log(e);
    // Looped Through objTodo.todoTags
    for (const element of objTodo.todoTags) {
      collectionOfTaskTag.push(element.value);
    }
    // Cloning objTodoList
    let cloneObjTodoList = [...objTodoList];

    // Checking if Todo Name has any Strings in it, to avoid empty name for tasks.
    if (inputField.value.length > 2) {
      try {
        keyCount += 1;
        // Temp Object that will hold the other properties
        let tempObject = creatingTodoItem(
          keyCount,
          objTodo,
          collectionOfTaskTag
        );

        cloneObjTodoList.push(tempObject);
        objTodoList = cloneObjTodoList;

        // Get the Last Element
        // let getObj = cloneObjTodoList.slice(-1);
        // Ill be Sorting it directly rather than wait for refresh, and just let the Insertion of Element the way it is.
        let collectionOfTodoPlaceholder =
          grandparent.querySelectorAll(".todo-placeholder");
        // Seperate this block of code
        collectionOfTodoPlaceholder.forEach((element) => {
          let newDate = new Date(tempObject.deadline).getTime();
          let getDateContent = element
            .querySelector(".lower-container .task-deadline-container label")
            .textContent.split(" ");

          let currentDateIterated = new Date(getDateContent[1]).getTime();
          console.log(newDate < currentDateIterated, isInserted);

          if (newDate < currentDateIterated && !isInserted) {
            console.log("Loop Triggered");
            grandparent.insertBefore(
              elementCreation(
                tempObject.todoName,
                keyCount,
                tempObject.tags,
                tempObject.deadline,
                tempObject.priority
              ),
              element
            );
            isInserted = true;
          }
        });
        if (!isInserted) {
          console.log("Loop Not Triggered");
          console.log(getObj);
          grandparent.appendChild(
            elementCreation(
              tempObject.todoName,
              keyCount,
              tempObject.tags,
              tempObject.deadline,
              tempObject.priority
            )
          );
        }
        console.log("Loop Not Triggered");

        // Invoke this function to reset the Rotation of Tags
        resetRotation(tagContainerSrc);
        // Invoke this function to store the tasks on local storage
        saveToLocalStorage();

        // Resetting Field Sections
        inputField.value = "";
        objTodo = createTodoObj();
        // console.log(objTodoList);

        //Original | objTodoList
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Insufficient String!");
    }
  }
  //For Checkbox
  function onCheckChangeStatus(key, ifChecked) {
    const index = objTodoList.findIndex((obj) => obj.key == key);
    if (ifChecked) {
      objTodoList[index].status = "Done";
      saveToLocalStorage();
    } else {
      objTodoList[index].status = "Not Done";
      saveToLocalStorage();
    }
  }

  function onCheckChangeTaskPlaceholderDOM(
    ifChecked,
    placeholder,
    edit,
    del,
    label
  ) {
    if (ifChecked) {
      placeholder.style.backgroundColor = "#83A6CE";
      edit.style.backgroundColor = "#26415E";
      edit.style.color = "#83A6CE";
      del.style.backgroundColor = "#26415E";
      del.style.color = "#83A6CE";
      label.style.color = "#26415E";
    } else {
      placeholder.style.backgroundColor = "#0b1b32";
      edit.style.backgroundColor = "#e5c9d7";
      edit.style.color = "#0b1b32";
      del.style.backgroundColor = "#e5c9d7";
      del.style.color = "#0b1b32";
      label.style.color = "#e5c9d7";
    }
  }

  // Just to Check if the element has a value of index of the ELEMENT
  function onCheck(target, placeholder, edit, del, label) {
    console.log(target.dataset.key);

    const key = target.dataset.key;
    const ifChecked = target.checked;
    onCheckChangeStatus(key, ifChecked);
    onCheckChangeTaskPlaceholderDOM(ifChecked, placeholder, edit, del, label);
  }
  //End For Checkbox
  //Alter the TextContent and the I Element
  function alterText(isClicked) {
    if (isClicked) {
      return {
        content: "SAVE",
        toSetIcon: "fa-solid fa-floppy-disk".split(" "),
        toReplaceIcon: "fa-solid fa-pen-to-square".split(" "),
      };
    } else {
      return {
        content: "EDIT",
        toSetIcon: "fa-solid fa-pen-to-square".split(" "),
        toReplaceIcon: "fa-solid fa-floppy-disk".split(" "),
      };
    }
  }

  // function onAdd(inputFieldVal, tagGrandparent) {
  //   // Variable Declaration
  //   let tagPlaceholder = document.createElement("span");
  //   tagPlaceholder.classList.add("tag-placeholder");

  //   let tagLabel = document.createElement("label");
  //   tagLabel.classList.add("tagging-name");

  //   let tagButton = document.createElement("button");
  //   tagButton.classList.add("tagging-close");

  //   let i = document.createElement("i");
  // }

  //Function when Editing the Content of Todo
  function onClickClosure(callback, isClicked, label, button, i, key) {
    isClicked = !isClicked;
    let alterTextContent = callback(isClicked);
    console.log(label);
    // let replaceLabelElement = callback2(isClicked, label.textContent);
    if (button.textContent === "EDIT") {
      i.classList.remove(...alterTextContent.toReplaceIcon);
      i.classList.add(...alterTextContent.toSetIcon);

      label.setAttribute("contenteditable", "true");
      label.classList.toggle("todo-input");

      button.textContent = alterTextContent.content;
      button.insertBefore(i, button.firstChild);
    } else {
      i.classList.remove(...alterTextContent.toReplaceIcon);
      i.classList.add(...alterTextContent.toSetIcon);

      const findIndex = objTodoList.findIndex((obj) => obj.key == key);

      label.textContent = objTodoList[findIndex].todoName;

      //If Nothing Changes
      label.setAttribute("contenteditable", "false");
      label.classList.toggle("todo-input");

      button.textContent = alterTextContent.content;
      button.insertBefore(i, button.firstChild);
    }

    console.log(
      `(data-key: ${key}) clicked. isClicked: ${isClicked} ${button.children[0].classList}`
    );
  }

  function onSave(key, childElemValue) {
    try {
      let findIndex = objTodoList.findIndex((obj) => obj.key == key);
      console.log(childElemValue);
      objTodoList[findIndex].todoName = childElemValue;
      saveToLocalStorage();
    } catch (e) {
      console.error(e);
    }
  }

  function onDelete(key, placeholder) {
    //Delete Element from the Array and from HTML DOM

    objTodoList = objTodoList.filter((obj) => obj.key != key);
    placeholder.remove(placeholder);
    console.log(objTodoList);
    saveToLocalStorage();
  }

  // ELEMENT CREATION | SECTION
  function elementCreationTag(key, inputFieldVal, grandparent) {
    // Initialization of Elements
    let span = document.createElement("span");
    let i = document.createElement("i");
    let button = document.createElement("button");
    let label = document.createElement("label");
    // Initialization of Array
    let arrOfIconTag = ["fa-solid fa-plus"];

    // Setting Classes for each Element
    span.classList.add("tag-placeholder");
    button.classList.add("tagging-close");
    label.classList.add("tagging-name");
    arrOfIconTag.forEach((element, index) => {
      i.classList.add(...arrOfIconTag[index].split(" "));
    });

    // Initializing Buttons Attributes
    button.setAttribute("type", "button");

    // Initializing Label Element
    label.textContent = inputFieldVal;
    label.setAttribute("data-key", key);

    // Appending of Elements
    button.appendChild(i);
    span.appendChild(label);
    span.appendChild(button);
    grandparent.appendChild(span);
  }
  // ELEMENT CREATION | TASK
  function elementCreation(
    elemName,
    key,
    todoTags,
    todoDeadline,
    todoPriority
  ) {
    //Initialization of Elements

    let div_placeholder = document.createElement("div");
    div_placeholder.classList.add("todo-placeholder");
    // upper-container
    let div_upperContainer = document.createElement("div");
    div_upperContainer.classList.add("upper-container");

    // Setting up Background-Color depending on what priority of the task is
    if (todoPriority == 1) {
      div_placeholder.style.backgroundColor = "#0865fe";
    } else if (todoPriority == 2) {
      div_placeholder.style.backgroundColor = "#ef9e56";
    } else if (todoPriority == 3) {
      div_placeholder.style.backgroundColor = "#b0192a";
    }

    // DIV Start | lower-container ---
    let div_lowerContainer = document.createElement("div");
    div_lowerContainer.classList.add("lower-container");
    // task-tag-container
    let div_taskTagContainer = document.createElement("div");
    div_taskTagContainer.classList.add("task-tag-container");
    // task-deadline-container
    let div_taskDeadlineContainer = document.createElement("div");
    div_taskDeadlineContainer.classList.add("task-deadline-container");
    // DIV End Initialization ---

    // task-deadline-placeholder
    let label_taskDeadlinePlaceholder = document.createElement("label");
    label_taskDeadlinePlaceholder.classList.add("task-deadline-placeholder");
    label_taskDeadlinePlaceholder.textContent = "Deadline: " + todoDeadline;
    // task-tag-placeholder and task-tag-name will be inside of a loop
    // The no. of iteration depends on how many tags that was selected
    // Setting up Loop for Tags
    todoTags.map((element, index) => {
      // task-tag-name
      const label_taskTagName = document.createElement("label");
      label_taskTagName.classList.add("task-tag-name");
      label_taskTagName.textContent = element;
      // task-tag-placeholder
      const span_taskTagPlaceholder = document.createElement("span");
      span_taskTagPlaceholder.classList.add("task-tag-placeholder");

      span_taskTagPlaceholder.appendChild(label_taskTagName);
      div_taskTagContainer.appendChild(span_taskTagPlaceholder);
    });

    // Appending the Span Elements
    // Appending Label to task-deadline-container
    div_taskDeadlineContainer.appendChild(label_taskDeadlinePlaceholder);

    // Appending two div containers(task-tag-container | task-deadline-container)
    div_lowerContainer.appendChild(div_taskTagContainer);
    div_lowerContainer.appendChild(div_taskDeadlineContainer);

    let input = document.createElement("input");
    input.classList.add("chk_done");
    input.setAttribute("type", "checkbox");
    input.setAttribute("data-key", key);

    input.addEventListener("click", function (e) {});

    let label = document.createElement("label");
    label.classList.add("lbl_name");
    label.textContent = elemName;

    let div_btn_container = document.createElement("div");
    div_btn_container.classList.add("btn_container");

    let arrayOfBtnNames = ["btn_edit", "btn_delete"];
    let arrayOfIcons = ["fa-solid fa-pen-to-square", "fa-solid fa-trash"];

    arrayOfBtnNames.forEach((element, index) => {
      let button = document.createElement("button");

      button.setAttribute("data-key", key);

      let i = document.createElement("i");

      button.classList.add(element);
      i.classList.add(...arrayOfIcons[index].split(" "));

      button.appendChild(i);
      button.appendChild(
        document.createTextNode(element.replace("btn_", "").toUpperCase())
      );

      div_btn_container.appendChild(button);
    });
    // Child Element(Label | Input | Button)  was appended to upper-container(Div)
    div_upperContainer.appendChild(input);
    div_upperContainer.appendChild(label);
    div_upperContainer.appendChild(div_btn_container);

    // upper-container(Div) is appended to todo-placeholder(Div)
    div_placeholder.appendChild(div_upperContainer);
    // lower-container(div) is appended to todo-placeholder(div)
    div_placeholder.appendChild(div_lowerContainer);
    // todo-placeholder(Div) is appended to todo-container(Div)
    return div_placeholder;

    //End Initialization of Elements
  }

  function resetRotation(tagContainer) {
    let collectionOfTaggingCloseButton =
      tagContainer.querySelectorAll(".tagging-close");

    collectionOfTaggingCloseButton.forEach((element) => {
      let i = element.querySelector("i");
      if (i.classList.contains("rotated")) {
        i.classList.toggle("rotated");
      }
    });
  }

  return {
    onInput,
    onSubmit,
    onCheck,
    alterText,
    onClickClosure,
    onSave,
    onDelete,
    loadFromLocalStorage,
    elementCreationTag,
    onToggleTag,
    onRotate,
    keyCountTags,
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  // Variable Declarations
  let cboPriority = document.getElementById("cbo_priority");

  // Todo Name | Deadline | Event Delegation
  document
    .querySelector(".todo-deadline-input-container")
    .addEventListener("input", function (e) {
      let element = e.target;

      if (element.id.includes("txt_todoName")) {
        todoApp.onInput(element.value, "todoName");
      } else if (element.id.includes("txt_deadline")) {
        console.log(element.value);
        todoApp.onInput(element.value, "todoDeadline");
      }
    });

  // Priority
  cboPriority.addEventListener("change", function (e) {
    const cboPriorityVal = e.target.value;
    todoApp.onInput(cboPriorityVal, "todoPriority");
    console.log(cboPriorityVal);
  });

  // Tags

  // Placeholder | Event Delegation
  let todoGrandParentContainer = document.querySelector(".todo-container");
  todoApp.loadFromLocalStorage(todoGrandParentContainer);
  todoGrandParentContainer.addEventListener("click", function (e) {
    let target = e.target;
    const taskKey = target.dataset.key;
    if (target.classList.contains("chk_done")) {
      const taskPlaceholder = target.closest(".todo-placeholder");

      console.log(target, taskPlaceholder);

      todoApp.onCheck(
        target,
        taskPlaceholder,
        taskPlaceholder.children[0].children[2].children[0],
        taskPlaceholder.children[0].children[2].children[1],
        taskPlaceholder.children[0].children[1]
      );
    } else if (target.classList.contains("btn_edit")) {
      let isClicked = target.textContent === "SAVE";
      const toEditTaskPlaceholder = target.closest(".upper-container");
      const toEditLabel = toEditTaskPlaceholder.querySelector(".lbl_name");
      const toEditItag = toEditTaskPlaceholder.querySelector(
        ".fa-pen-to-square"
      )
        ? toEditTaskPlaceholder.querySelector(".fa-pen-to-square")
        : toEditTaskPlaceholder.querySelector(".fa-floppy-disk");
      document.getElement;

      if (isClicked) {
        todoApp.onSave(taskKey, toEditTaskPlaceholder.children[1].textContent);
      }
      todoApp.onClickClosure(
        todoApp.alterText,
        isClicked,
        toEditLabel,
        target,
        toEditItag,
        taskKey
      );
    } else if (target.classList.contains("btn_delete")) {
      console.log("Delete Triggered!!");
      const toDeletePlaceholder = target.closest(".todo-placeholder");
      todoApp.onDelete(taskKey, toDeletePlaceholder);
    }
  });

  // TAG | TAG CONTAINER | SECTION -----

  // EVENT DELEGATION | TAG ---
  let tagContainer = document.querySelector(".tag-container");

  tagContainer.addEventListener("click", function (e) {
    let element = e.target;

    if (element.classList.contains("tagging-close")) {
      let getClosest = element.closest(".tag-placeholder");
      let getITag = getClosest.querySelector("i");
      let getLabel = getClosest.querySelector("label");
      console.log(element);
      let toggleValue = getITag.classList.contains("rotated") ? true : false;
      console.log(toggleValue);
      // Be Using a Callback instead
      todoApp.onToggleTag(
        getLabel.dataset.key,
        getLabel.textContent,
        toggleValue,
        getITag,
        todoApp.onRotate
      );
    }
  });

  // ADD TAG
  document.getElementById("btn_add").addEventListener("click", function () {
    let txt_tagname = document.getElementById("txt_tagname");
    if (txt_tagname.value.length > 2) {
      todoApp.keyCountTags++;
      todoApp.elementCreationTag(
        todoApp.keyCountTags,
        txt_tagname.value,
        tagContainer
      );
    } else {
      alert("Todo Tag is Empty or Insufficient String");
    }
  });

  // SUBMITION OF FORM | SECTION
  let btn_submit = document.getElementById("btn_submit");
  btn_submit.addEventListener("click", function (e) {
    e.preventDefault();
    let todoName = document.getElementById("txt_todoName");
    console.log("Check: " + todoName.value);
    todoApp.onSubmit(e, todoName, todoGrandParentContainer, tagContainer);

    console.log("Triggered!");
  });
});
