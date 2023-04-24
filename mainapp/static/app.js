"use strict";
const form = document.querySelector("#send-form");
const listGroup = document.getElementById("list-group");
let activeItem = null;
function getCookie(name) {
  //Generate CSRFToken for django
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
let csrftoken = getCookie("csrftoken");

function buildList() {
  //Gets task list from api
  let url = "http://127.0.0.1:8000/api/task-list/";
  fetch(url, { mode: "no-cors" })
    .then((res) => res.json())
    .then((data) => {
      showList(data);
    });
}
buildList();

function showList(data) {
  listGroup.innerHTML = "";
  console.log(data);
  data.forEach((el, i) => {
    let title = `<p id="list-title">${el.title}</p>`;
    if (el.completed == true) {
      title = `<strike id="list-title">${el.title}</strike>`;
    }
    const html = `
        <li class="list-group-item">
          ${title}
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-primary" id="editBtn">Edit</button>
            <button class="btn btn-danger" id="deleteBtn">Delete</button>
        </div>
        </li>
        
        
        `;
    listGroup.innerHTML += html;
  });

  let editBtn = document.querySelectorAll("#editBtn");
  editBtn.forEach((el, i) =>
    el.addEventListener("click", () => editItem(i, data[i]))
  );

  let deleteBtn = document.querySelectorAll("#deleteBtn");
  deleteBtn.forEach((el, i) =>
    el.addEventListener("click", () => deleteItem(i, data[i]))
  );

  let strikeTitle = document.querySelectorAll("#list-title");
  strikeTitle.forEach((el, i) =>
    el.addEventListener("click", () => strikeUnstrike(data[i]))
  );
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let url = "http://127.0.0.1:8000/api/task-create/";
  if (activeItem != null) {
    url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}`;
    activeItem = null;
  }
  let taskTitle = document.querySelector("#title").value;
  console.log("Submitted!");
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({ "title": taskTitle }),
  }).then((res) => {
    buildList();
    form.reset();
  });
});

function editItem(i, el) {
  console.log(el);
  activeItem = el;
  document.getElementById("title").value = activeItem.title;
}

function deleteItem(i, el) {
  console.log(`Delete: ${el.title}?`);
  fetch(`http://127.0.0.1:8000/api/task-delete/${el.id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  }).then((res) => {
    buildList();
  });
}

function strikeUnstrike(el) {
  console.log(`Strike: ${el.title}`);
  el.completed = !el.completed;
  fetch(`http://127.0.0.1:8000/api/task-update/${el.id}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify({
      "title": el.title,
      "completed": el.completed,
    }),
  }).then((res) => {
    buildList();
  });
}
