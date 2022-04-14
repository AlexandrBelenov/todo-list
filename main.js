window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    let todo_list = [];
    getFromLocalStorage();

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addTodo(input.value);
    });

    function addTodo(item) {
        if(!item) {
            alert("Please fill out the task");
            return;
        }
        const todo = {
            id: Date.now(),
            name: item
        };
        todo_list.push(todo);
        addToLocalStorage('todos',todo_list);
        input.value = "";
    }

    function addToLocalStorage(key, list) {
        localStorage.setItem(key, JSON.stringify(list));
        renderList(list);
    }

    function getFromLocalStorage() {
        const reference = localStorage.getItem('todos');
        if (reference) {
            todo_list = JSON.parse(reference);
        }
        renderList(todo_list);
    }

    function renderList(list) {
        list_el.innerHTML = ""; // remove previously rendered list
        list.forEach(element => {
            // create and fill the new task element
            const task_el = document.createElement("div");
            task_el.classList.add("task");
            task_el.setAttribute('data-key', element.id);

            const task_content_el = document.createElement("div");
            task_content_el.classList.add("content");
            task_el.appendChild(task_content_el);

            const task_input_el = document.createElement("input");
            task_input_el.classList.add("text");
            task_input_el.type = "text";
            task_input_el.value = element.name; // set a task text
            task_input_el.setAttribute("readonly", "readonly");
            task_content_el.appendChild(task_input_el);

            const task_actions_el = document.createElement("div");
            task_actions_el.classList.add("actions");

            const task_edit_el = document.createElement("button");
            task_edit_el.classList.add("edit");
            task_edit_el.innerHTML = "Edit";

            const task_delete_el = document.createElement("button");
            task_delete_el.classList.add("delete");
            task_delete_el.innerHTML = "Delete";

            task_actions_el.appendChild(task_edit_el);
            task_actions_el.appendChild(task_delete_el);

            task_el.appendChild(task_actions_el);
            list_el.appendChild(task_el);

            task_edit_el.addEventListener("click", (e) => {
                console.log(e);
                if (task_edit_el.innerText.toLowerCase() === "edit") {
                    task_input_el.removeAttribute("readonly");
                    task_input_el.focus();
                    task_edit_el.innerText = "Save";
                } else {
                    task_input_el.setAttribute("readonly", "readonly");
                    task_edit_el.innerText = "Edit";
                    todo_list = todo_list.map(el => {
                        if (el.id == task_el.getAttribute("data-key")) {
                            el.name = task_input_el.value;
                        }
                        return el;
                    });
                    addToLocalStorage("todos", todo_list);
                    renderList(todo_list);
                }
            });

            task_delete_el.addEventListener("click", () => {
                list_el.removeChild(task_el);
            }); 
        });
    }

})