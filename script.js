function loadTodos() {
    // Load todos from local storage or initialize with an empty array
    // This function load the todos from the browser
    // localStorage.getItem() used to get data form browser
    // JSON.parse() convert the data into object
    const todos = JSON.parse(localStorage.getItem("todos")) || { "todoList": [] };
    console.log(todos);
    return todos;
}

// we loading the todos
// JSON.stringify() convert the data into string
function addTodoToLocalStorage(todo) {
    const todos = loadTodos();
    todos.todoList.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodoFromLocalStorage(todoText) {
    const todos = loadTodos();
    todos.todoList = todos.todoList.filter(todo => todo.text !== todoText);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function editTodoInLocalStorage(oldText, newText) {
    const todos = loadTodos();
    const todo = todos.todoList.find(todo => todo.text === oldText);
    if (todo) {
        todo.text = newText;
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function deleteTodoFromDOM(todoItem) {
    todoItem.remove();
}

function updateTodoInDOM(todoItem, newText) {
    const todoText = todoItem.querySelector(".todoText");
    if (todoText) {
        todoText.textContent = newText;
    }
}

function appendTodoInHtml(todo) {
    const todoList = document.getElementById("todoList");
    // document.createElement() will create a element li
    const todoItem = document.createElement("li");
    todoItem.classList.add("todoItem");

    // Create a span for todo text
    const todoText = document.createElement("span");
    todoText.textContent = todo.text;
    todoText.classList.add("todoText");
    todoItem.appendChild(todoText);

    // Create an input for editing
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.classList.add("editInput");
    editInput.value = todo.text;
    editInput.style.display = "none"; // Initially hidden
    todoItem.appendChild(editInput);

    // Create buttons wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("todoButtons");

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtn");

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.classList.add("saveBtn");
    saveBtn.style.display = "none"; // Initially hidden

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("deleteBtn");

    wrapper.appendChild(editBtn);
    wrapper.appendChild(saveBtn);
    wrapper.appendChild(deleteBtn);
    todoItem.appendChild(wrapper);

    // Add event listener for Edit button
    editBtn.addEventListener("click", () => {
        todoText.style.display = "none";
        editInput.style.display = "inline";
        editInput.focus();
        editBtn.style.display = "none";
        saveBtn.style.display = "inline";
    });

    // Add event listener for Save button
    saveBtn.addEventListener("click", () => {
        const newText = editInput.value.trim();
        if (newText !== '') {
            editTodoInLocalStorage(todo.text, newText);
            updateTodoInDOM(todoItem, newText);
            todo.text = newText; // Update the todo object
            todoText.style.display = "inline";
            editInput.style.display = "none";
            editBtn.style.display = "inline";
            saveBtn.style.display = "none";
        }
    });

    // Add event listener for Delete button
    deleteBtn.addEventListener("click", () => {
        deleteTodoFromLocalStorage(todo.text);
        deleteTodoFromDOM(todoItem);
    });

    todoList.appendChild(todoItem);
}

// here addEventListener adding event to whole document
// DOMContentLoaded event fires when the HTML document has been completely parsed (analyse).
// document.getElementById used to get html elements
document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    const submitButton = document.getElementById("addTodo");
    const todoList = document.getElementById("todoList");

    submitButton.addEventListener("click", () => {
        const todoText = todoInput.value;
        if (todoText === '') {
            alert("Please write something for the todo");
        } else {
            addTodoToLocalStorage({ text: todoText, isCompleted: false });
            appendTodoInHtml({ text: todoText, isCompleted: false });
            todoInput.value = '';
        }
    });

    todoInput.addEventListener("change", (event) => {
        // This callback method fired everytime there is a change in the input
        const todoText = event.target.value;
        event.target.value = todoText.trim();
        console.log(event.target.value);
    });

    const todos = loadTodos();
    todos.todoList.forEach(todo => {
        appendTodoInHtml(todo);
    });
});
