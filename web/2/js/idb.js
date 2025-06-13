const dbName = "MyDatabase";
const dbVersion = 1; // Versioning is required for schema updates.
const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  // Create an object store named 'users' with 'id' as the keyPath
  if (!db.objectStoreNames.contains("users")) {
    db.createObjectStore("users", { keyPath: "id" });
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

function addUser(id, name, email) {
  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("users", "readwrite");
    const objectStore = transaction.objectStore("users");

    const user = { id, name, email };
    const addRequest = objectStore.add(user);

    addRequest.onsuccess = function () {
      console.log("User added:", user);
    };

    addRequest.onerror = function (event) {
      console.error("Error adding user:", event.target.errorCode);
    };
  };
}

function getAllUsers() {
  const request = indexedDB.open(dbName, 1);
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("users", "readonly");
    const objectStore = transaction.objectStore("users");
    const getAllRequest = objectStore.getAll();
    getAllRequest.onsuccess = function () {
      const users = getAllRequest.result;
      if (users.length > 0) {
        console.log("All users:", users);
      } else {
        console.log("No users found");
      }
    }
    getAllRequest.onerror = function (event) {
      console.error("Error retrieving users:", event.target.errorCode);
    };
  };
}

function getUser(id) {
  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("users", "readonly");
    const objectStore = transaction.objectStore("users");

    const getRequest = objectStore.get(id);

    getRequest.onsuccess = function () {
      if (getRequest.result) {
        console.log("User found:", getRequest.result);
      } else {
        console.log("User not found");
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error retrieving user:", event.target.errorCode);
    };
  };
}

function updateUser(id, updatedData) {
  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("users", "readwrite");
    const objectStore = transaction.objectStore("users");

    const putRequest = objectStore.put({ ...updatedData, id });

    putRequest.onsuccess = function () {
      console.log("User updated:", { ...updatedData, id });
    };

    putRequest.onerror = function (event) {
      console.error("Error updating user:", event.target.errorCode);
    };
  };
}

function deleteUser(id) {
  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction("users", "readwrite");
    const objectStore = transaction.objectStore("users");

    const deleteRequest = objectStore.delete(id);

    deleteRequest.onsuccess = function () {
      console.log("User deleted with ID:", id);
    };

    deleteRequest.onerror = function (event) {
      console.error("Error deleting user:", event.target.errorCode);
    };
  };
}




// Get user with ID 1

// Add a new user
let ix = Number(new Date().toISOString().replace(/\D/g,''));
addUser(ix, "John Doe", "john.doe@example.com");
// Update user with ID 1
updateUser(ix, { name: "Johnathan Doe", email: "johnathan.doe@example.com" });



// Delete user with ID 1
addUser(1, "John Doe", "john.doe@example.com");
updateUser(1, { name: "Johnathan Doe", email: "johnathan.doe@example.com" });
getUser(1);
deleteUser(1);

getAllUsers()