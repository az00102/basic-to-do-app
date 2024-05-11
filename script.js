document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login");
  const logoutBtn = document.getElementById("logout-btn");
  const usernameInput = document.getElementById("username-input");
  const loginBtn = document.getElementById("login-btn");
  const loggedInUsername = document.getElementById("logged-in-username");
  const todo = document.getElementById("todo-app");
  const addTaskButton = document.getElementById("add-task-button");
  const taskList = document.getElementById("task-list");

  let totalTasks = 0;
  let completedTasks = 0;
  let taskIndex = 0;
  let tasks = [];

  function isLoggedIn() {
    return localStorage.getItem("username") !== null;
  }

  function updateUI() {
    if (isLoggedIn()) {
      loginForm.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
      loggedInUsername.textContent = localStorage.getItem("username");
      loggedInUsername.classList.remove("hidden");
      todo.classList.remove("hidden");
      loadTasks();
    } else {
      loginForm.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
      loggedInUsername.classList.add("hidden");
      todo.classList.add("hidden");
    }
  }

  updateUI();

  loginBtn.addEventListener("click", function () {
    const usernameValue = usernameInput.value.trim();
    if (usernameValue !== "") {
      localStorage.setItem("username", usernameValue);
      updateUI();
    } else {
      alert("Please enter a username.");
    }
  });

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("username");
    localStorage.removeItem(localStorage.getItem("username") + "_tasks"); 
    loginForm.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    loggedInUsername.classList.add("hidden");
    document.getElementById("div-title").textContent = "To-Do";
    todo.classList.add("hidden");
    tasks = []; 
    taskList.innerHTML = "";
    totalTasks = 0; 
    completedTasks = 0;
    updateTaskCount();
  });


  addTaskButton.addEventListener("click", function () {
    const taskInput = document.getElementById("task-input").value.trim();
    if (taskInput !== "") {
      const task = {
        id: ++taskIndex,
        text: taskInput,
        completed: false,
      };
      console.log(task.id);
      tasks.push(task);
      renderTask(task);
      totalTasks++;
      updateTaskCount();
      saveTasks();
    } else {
      alert("Please enter a task.");
    }
    document.getElementById("task-input").value = "";
  });

  const sortDropdown = document.getElementById("sort"); 
  const sortOptions = sortDropdown.querySelectorAll("li"); 

//sort option
  sortOptions.forEach(option => {
    option.addEventListener("click", function () {
      const selectedOption = option.textContent.trim(); 
      console.log("Selected sorting option:", selectedOption);

      // Sort tasks based on creation index
      if (selectedOption === "Acending") { 
        tasks.sort((a, b) => a.id - b.id);
      } else if (selectedOption === "Decending") {
        tasks.sort((a, b) => b.id - a.id);
      }

      taskList.innerHTML = ""; 
      tasks.forEach(task => renderTask(task));
    });
  });

  function renderTask(task) {
    const taskItem = document.createElement("div");
    taskItem.classList.add(
      "task-item",
      "flex",
      "items-center",
      "gap-4",
      "whitespace-normal",
      "break-all"
    );

    const taskIndexSpan = document.createElement("span");
    taskIndexSpan.textContent = task.id + ".";
    taskIndexSpan.classList.add("task-index");
    taskItem.appendChild(taskIndexSpan);

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    taskText.classList.add("flex-grow");
    taskItem.appendChild(taskText);

    const editButton = document.createElement("button");
    const editIcon = document.createElement("img");
    editIcon.src = "./icons8-edit-32.png";
    editButton.appendChild(editIcon);
    editButton.classList.add("edit-button", "w-6", "h-6");
    editButton.addEventListener("click", function () {
      const newText = prompt("Edit task:", taskText.textContent);
      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        taskText.textContent = newText.trim();
        saveTasks();
      }
    });
    taskItem.appendChild(editButton);

    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "./icons8-delete-48.png";
    deleteButton.appendChild(deleteIcon);
    deleteButton.classList.add("delete-button", "w-6", "h-6");
    deleteButton.addEventListener("click", function () {
      taskItem.remove();
      const index = tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        tasks.splice(index, 1);
        if (task.completed) {
          completedTasks--;
        }
        totalTasks--;
        updateTaskCount();
        saveTasks();
      }
    });

    taskItem.appendChild(deleteButton);

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.classList.add(
      "complete-checkbox",
      "checkbox",
      "checkbox-success"
    );
    taskItem.appendChild(completeCheckbox);
    completeCheckbox.addEventListener("click", function () {
      task.completed = completeCheckbox.checked;
      if (task.completed) {
        taskItem.classList.add("line-through", "text-red-500");
        completedTasks++;
      } else {
        taskItem.classList.remove("line-through", "text-red-500");
        completedTasks--;
      }
      updateTaskCount();
      saveTasks();
    });

    if (task.completed) {
      taskItem.classList.add("line-through", "text-red-500");
      completeCheckbox.checked = true;
      if (!completeCheckbox.checked) {
        completedTasks++;
      }
    }

    updateTaskCount();

    taskList.appendChild(taskItem);
  }


  function updateTaskCount() {
    console.log(completedTasks);
    document.getElementById("total-task").textContent = totalTasks;
    document.getElementById("completed").textContent = completedTasks;
  }

  function saveTasks() {
    if (isLoggedIn()) {
      localStorage.setItem(localStorage.getItem("username") + "_tasks", JSON.stringify(tasks));
    }
  }

  function loadTasks() {
    if (isLoggedIn()) {
      const storedTasks = localStorage.getItem(localStorage.getItem("username") + "_tasks");
      if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        totalTasks = tasks.length;
        completedTasks = tasks.filter(task => task.completed).length; 
        taskList.innerHTML = "";
        tasks.forEach((task) => renderTask(task));
        updateTaskCount();
      }
    }
  }

});
