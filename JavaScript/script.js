// Helper Functions Using Ids
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const clearTasksBtn = document.getElementById('clear-tasks-btn');
const backgroundColorPicker = document.getElementById('background-color');


addTaskBtn.addEventListener('click', addTask);
clearTasksBtn.addEventListener('click', clearAllTasks);
backgroundColorPicker.addEventListener('input', changeBackgroundColor);


function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const taskItem = createTaskItem(taskText);
  taskList.appendChild(taskItem);

  saveTasks();
  taskInput.value = '';

  window.alert('Task Added');
}

function clearAllTasks() {
    taskList.innerHTML = '';
    saveTasks();
  
    window.alert('Task Clear');
}

function changeBackgroundColor(event) {
  const color = event.target.value;
  document.body.style.backgroundColor = color;
  localStorage.setItem('backgroundColor', color);
}


// Persistence Task & Task Completion Pending