const inputValue = document.querySelector("input");
const addBtn = document.getElementById("addTask");
const taskList = loadTasks();
let editIndex = -1;

addBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});

function addTask() {
  const title = inputValue.value.trim();

  if (!title) return;

  if (editIndex === -1) {
    const task = { title, completed: false };
    taskList.push(task);
  } else {
    taskList[editIndex].title = title;
    editIndex = -1;
  }

  inputValue.value = "";
  saveTasks();
  displayTasks();
}

function toggleCompeleteTask(i) {
  taskList[i].completed = !taskList[i].completed;
  saveTasks();
  displayTasks();
}

function Delete(i) {
  taskList.splice(i, 1);
  saveTasks();
  displayTasks();
}

function edit(i) {
  inputValue.value = taskList[i].title;
  editIndex = i;
  inputValue.focus();
}

function displayTasks() {
  let box = "";
  for (let i = 0; i < taskList.length; i++) {
    box += `
      <li class="bg-[#171c48] p-5 rounded-2xl">
        <div class="flex flex-row justify-between">
          <div class="flex flex-row gap-x-4 items-center ${
            taskList[i].completed ? "completed" : ""
          }">
            <input type="checkbox" class="checkBox" ${
              taskList[i].completed ? "checked" : ""
            }
              onclick="toggleCompeleteTask(${i})" />
            <p>${taskList[i].title}</p>
          </div>
          <div class="flex gap-x-3">
            <i class="fa-solid fa-pen-to-square text-cyan-400 cursor-pointer" onclick="edit(${i})"></i>
            <i class="fa-solid fa-trash text-red-700 cursor-pointer" onclick="Delete(${i})"></i>
          </div>
        </div>
      </li>
    `;
  }

  document.querySelector(".taskContainer").innerHTML = box;
  updateProgress();
}

function updateProgress() {
  const completed = taskList.filter((task) => task.completed).length;
  const total = taskList.length;
  const percent = total > 0 ? (completed / total) * 100 : 0;

  const progressText = document.querySelector(".progressText");
  if (progressText) {
    progressText.textContent = `${completed}/${total}`;
  }

  const progressCircle = document.querySelector(".progressCircle");
  if (progressCircle) {
    const dashoffset = 100 - percent;
    progressCircle.setAttribute("stroke-dashoffset", dashoffset);
  }
  if (taskList.length && completed === total) {
    animate();
  }
}

function saveTasks() {
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

function loadTasks() {
  const saved = localStorage.getItem("taskList");
  return saved ? JSON.parse(saved) : [];
}

displayTasks();
function animate() {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
