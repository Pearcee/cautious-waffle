const url = 'http://127.0.0.1:8000/todos';
const localhostAddress = url;
const newTodoInput = document.querySelector("#new-todo input");
const submitButton = document.querySelector("#submit");
let isEditingTask = false;
let editButtonTodoID = '';
let isComplete = false;


async function getTodos() {
    try {
        const response = await fetch(localhostAddress);
        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error("Error:", error);
    }
}

async function createTodo(data) {
    try {
        // send POST request with user input as the req body
        const response = await fetch(localhostAddress, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Success:", result.message);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function deleteTodo(TodoID) {
    try {
        const response = await fetch(`${localhostAddress}/${TodoID}`, {
            method: "DELETE",
        });
        const result = await response.json();
        console.log("Success:", result.message);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function updateTodo(id, data) {
    try {
        const response = await fetch(`${localhostAddress}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log("Success:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function addTask() {
    const data = { title: newTodoInput.value, completed: false, createdat: new Date() };
    await createTodo(data);
    displayTodos();
    newTodoInput.value = "";
}


async function editTask() {
    const data = { title: newTodoInput.value, completed: isComplete };

    if (isEditingTask) await updateTodo(editButtonTodoID, data);
    displayTodos();

    newTodoInput.value = "";
    isEditingTask = false;
    submitButton.innerHTML = "Add";
}

async function displayTodos() {
    const todoList = await getTodos();
    let todoListContainer = document.querySelector("#todos");
    todoListContainer.innerHTML = "";


    if (todoList.length == 0) {
        todoListContainer.innerHTML += `
            <div class="todo">
                <span> You do not have any tasks </span>
            </div>
            `;
    } else {
        todoList.forEach((todo) => {
            todoListContainer.innerHTML += `
        <div class="todo">
            <span id="todoname"
            style="text-decoration:${todo.completed ? 'line-through' : ''}"
            data-iscomplete="${todo.completed}"
            data-id="${todo.id}"
            >
              ${todo.title}
              </span>

            <div class="actions">
                <button data-id=${todo.id} class="edit" title="Edit">✒️</button>
                <button data-id=${todo.id} class="delete" title="Delete">🗑️</button>
            <div>
            
        </div>
        `;
        });
    }
    deleteTaskButton();
    editTaskTitleButton();
    toggleTaskCompletion();
}
displayTodos();

function deleteTaskButton() {
    const deleteTodoButtons = document.querySelectorAll(".delete");

    for (const deleteButton of deleteTodoButtons) {

        deleteButton.onclick = async function () {
            const todoID = deleteButton.getAttribute("data-id");
            await deleteTodo(todoID);
            displayTodos();
        };
    }
}

function editTaskTitleButton() {
    const editTodoTitleButtons = document.querySelectorAll(".edit");

    for (const editButton of editTodoTitleButtons) {
        const todoName = editButton.parentNode.parentNode.children[0];

        editButton.onclick = async function () {
            newTodoInput.value = todoName.innerText;
            submitButton.innerHTML = "Edit";
            isEditingTask = true;

            editButtonTodoID = editButton.getAttribute("data-id");
            isComplete = JSON.parse(todoName.getAttribute("data-iscomplete"));

        };
    }
}

function toggleTaskCompletion() {
    const editTaskCompleted = document.querySelectorAll("#todoname");
    for (const task of editTaskCompleted) {
        task.onclick = async function () {
            const isTaskDone = JSON.parse(
                task.getAttribute("data-iscomplete")
            );
            const todoID = task.getAttribute("data-id");

            const data = { title: task.innerText, completed: !isTaskDone };
            await updateTodo(todoID, data);
            displayTodos();
        };
    }
}


submitButton.addEventListener('click', () => isEditingTask ? editTask() : addTask())