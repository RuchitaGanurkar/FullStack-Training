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
  
    window.alert('All Task Clear');
}


function deleteOneTask(task) {
  task.remove();
  saveTasks();

  window.alert('One Task Clear');
}

function changeBackgroundColor(event) {
  const color = event.target.value;
  document.body.style.backgroundColor = color;
  localStorage.setItem('backgroundColor', color);
}


function createTaskItem(text) {
  const li = document.createElement('li');
  li.className = 'task-item';

  const elements = [
    { tag: 'span', text: text },
    { tag: 'input', type: 'Checkbox', event: { type: 'change', handler: () => toggleTaskCompletion(li) } },
    { tag: 'button', text: 'Delete', event: { type: 'click', handler: () => deleteOneTask(li) } }
  ];

  elements.forEach(({ tag, text, type, event }) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (type) element.type = type;
    if (event) element.addEventListener(event.type, event.handler);
    li.appendChild(element);
  });

  return li;
}

// Once Task Completed It's Being Marked Design Is Given In CSS
function toggleTaskCompletion(task) {
  task.classList.toggle('completed');
  saveTasks();

  window.alert('Task Marked As Completed');
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('.task-item').forEach((task) => {
    tasks.push({
      text: task.querySelector('span').textContent,
      completed: task.classList.contains('completed'),
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


