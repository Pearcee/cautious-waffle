const db = new Dexie('TodoDatabase');

db.version(1).stores({
  todo: `++id, name, completed`,
});

const formElement = document.getElementById('addTodoForm');
const todoInput = document.getElementById('todo');
const todoList = document.getElementById('todoList');