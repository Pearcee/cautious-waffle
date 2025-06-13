const dbName = "MyToDoDB";
const dbVersion = 1; // Versioning is required for schema updates.
const request = indexedDB.open(dbName, dbVersion);
const table = "todo";

request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Create an object store named 'todo' with 'id' as the keyPath
    if (!db.objectStoreNames.contains(table)) {
        db.createObjectStore(table, { keyPath: "id", autoIncrement: true });
    }
    console.log("Database setup complete");
};
request.onsuccess = function (event) {
    const db = event.target.result;
    console.log("Database opened successfully");
};
request.onerror = function (event) {
    console.error("Error opening database:", event.target.errorCode);
};

function addTodo(name, completed = false) {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);

        const todo = { name, completed };
        const addRequest = objectStore.add(todo);

        addRequest.onsuccess = function () {
            console.log("Todo added:", todo);
        };

        addRequest.onerror = function (event) {
            console.error("Error adding todo:", event.target.errorCode);
        };
    };
}
function getAllTodos() {
    const request = indexedDB.open(dbName, dbVersion);
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(table, "readonly");
        const objectStore = transaction.objectStore(table);
        const getAllRequest = objectStore.getAll();
        
        getAllRequest.onsuccess = function () { 
            const todos = getAllRequest.result;
            if (todos.length > 0) {
                // return(JSON.parse(todos));
                console.log("All todos:", todos);
            } else {
                console.log("No todos found");
            }
        };
        
        getAllRequest.onerror = function (event) {
            console.error("Error retrieving todos:", event.target.errorCode);
        };
    };
}
function deleteTodo(id) {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        
        const deleteRequest = objectStore.delete(id);
        
        deleteRequest.onsuccess = function () {
            console.log("Todo deleted:", id);
        };
        
        deleteRequest.onerror = function (event) {
            console.error("Error deleting todo:", event.target.errorCode);
        };
    };
}
function updateTodo(id, updates) {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(table, "readwrite");
        const objectStore = transaction.objectStore(table);
        
        const getRequest = objectStore.get(id);
        
        getRequest.onsuccess = function () {
            const todo = getRequest.result;
            if (todo) {
                Object.assign(todo, updates);
                const updateRequest = objectStore.put(todo);
                
                updateRequest.onsuccess = function () {
                    console.log("Todo updated:", todo);
                };
                
                updateRequest.onerror = function (event) {
                    console.error("Error updating todo:", event.target.errorCode);
                };
            } else {
                console.log("Todo not found:", id);
            }
        };
        
        getRequest.onerror = function (event) {
            console.error("Error retrieving todo:", event.target.errorCode);
        };
    };
}
// Example usage    
addTodo("Learn IndexedDB");

updateTodo(2, { completed: true });
deleteTodo(1);

getAllTodos();
