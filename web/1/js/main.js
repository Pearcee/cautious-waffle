
const formElement = document.getElementById('addTodoForm');
const todoInput = document.getElementById('todo');
const todoList = document.getElementById('todoList');
const txt = document.createTextNode("\u00D7");
const close = document.getElementsByClassName("close");

const db = new Dexie('TodoDatabase');

db.version(1).stores({
  todo: `++id, name, completed`,
});

const todoObservable = Dexie.liveQuery(() => db.todo.toArray());

async function createTodo(todoName) {
  try {
    await db.todo.add({
      name: todoName,
      completed: false,
    });
  } catch (error) {
    console.error(error)
  }
}

async function toggleTodoCompleteStatus(event) {
  const { id, completed } = event.target.dataset;
  try {
    const isUpdated = await db.todo.update(parseInt(id), {
      completed: !JSON.parse(completed), // to convert 'false` -> false etc
    });

    if (!isUpdated) {
      throw new Error('Error updating');
    }
  } catch (error) {
    console.error(error)
  }
}

todoObservable.subscribe({
  next: (result) => {
    // first remove existing items
    todoList.innerHTML = ''

    result.forEach((todo) => {
      let newTodo = document.createElement('li');
      newTodo.dataset.id = todo.id;
      newTodo.dataset.completed = todo.completed;
      newTodo.innerText = todo.name;
      // newTodo.className = "aclose";
      newTodo.onclick = toggleTodoCompleteStatus;
      if (todo.completed) {
        newTodo.classList.add('checked');
      }

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    newTodo.appendChild(span);      


      
      console.log(newTodo);
      todoList.appendChild(newTodo);
    });
  },
  error: (error) => console.error(error),
});


formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const todoName = todoInput.value;
  createTodo(todoName);
  // reset input
  todoInput.value = ''
});


var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
    }
}, false);