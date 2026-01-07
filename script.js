let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function save(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(){
  let text = taskInput.value.trim();
  if(text === "") return;

  tasks.push({
    text: text,
    date: dateInput.value,
    priority: priorityInput.value,
    done: false
  });

  taskInput.value = "";
  dateInput.value = "";
  save();
  render();
}

function render(){
  taskList.innerHTML = "";

  let list = tasks.filter(t=>{
    if(filter==="completed") return t.done;
    if(filter==="pending") return !t.done;
    return true;
  });

  list = list.filter(t =>
    t.text.toLowerCase().includes(search.value.toLowerCase())
  );

  list.forEach((t,i)=>{
    let div = document.createElement("div");
    div.className = "task" + (t.done ? " completed":"");

    div.innerHTML = `
      <span onclick="toggleTask(${i})">
        ${t.text}
        <span class="priority">(${t.priority})</span><br>
        ${t.date}
      </span>
      <div>
        <button onclick="editTask(${i})">✏️</button>
        <button onclick="deleteTask(${i})">❌</button>
      </div>
    `;

    taskList.appendChild(div);
  });

  updateProgress();
}

function toggleTask(i){
  tasks[i].done = !tasks[i].done;
  save();
  render();
}

function deleteTask(i){
  tasks.splice(i,1);
  save();
  render();
}

function editTask(i){
  let t = prompt("Edit task", tasks[i].text);
  if(t){
    tasks[i].text = t;
    save();
    render();
  }
}

function setFilter(f){
  filter = f;
  document.querySelectorAll(".filters button")
    .forEach(b=>b.classList.remove("active"));
  document.getElementById(f+"Btn").classList.add("active");
  render();
}

function clearCompleted(){
  tasks = tasks.filter(t=>!t.done);
  save();
  render();
}

function updateProgress(){
  let done = tasks.filter(t=>t.done).length;
  let total = tasks.length;
  let percent = total ? Math.round(done/total*100) : 0;
  progress.style.width = percent + "%";
  progressText.innerText = percent + "% completed";
  stats.innerText = `Total ${total} | Done ${done}`;
}

function toggleTheme(){
  document.body.classList.toggle("dark");
}

search.oninput = render;
render();
