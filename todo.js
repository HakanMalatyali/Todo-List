// Tüm elementleri seçme

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){    // Tüm event Listenarlar
      form.addEventListener("submit",addTodo);
      document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
      secondCardBody.addEventListener("click",deleteTodo);
      filter.addEventListener("keyup",filterTodos);
      clearButton.addEventListener("click",clearAllTodos)
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLocaleLowerCase();
        
        if(text.indexOf(filterValue) === -1){
            // Bulamadı
            listItem.setAttribute("style", "display : none !important");
        }
        else{
            listItem.setAttribute("style","display : block");
        }

    });
}

function addTodo(e){
    const newTodo = todoInput.value.trim();

    if(newTodo === ""){
        showAlert("danger","Lütfen bir todo girin..");
    }
    else{
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        todoInput.value = "";
        showAlert("success","İşleminiz başarıyla gerçekleşti..");
    }

    e.preventDefault();
}

function clearAllTodos(){
    
    if(confirm("Tümünü silmek istediğinize emin misiniz?")){
        // Arayüzden Todoları Kaldırma
        // todoList.innerHTML = "";  // Yavaş
        
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function deleteTodo(e){
    if(e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi..")
    }
}

function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1);   // Arrayden değeri silebiliriz.
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadAllTodosToUI(){   // Local Storagedan Todo Çekme
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}

function addTodoToUI(newTodo){      // String değerini list item olarak UI ya ekleyecek
    
    // List Item Oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";

    // Link Oluşturma 
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    // Text Node Ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link)
    
    // ToDo List'e List Item Ekleme
    todoList.appendChild(listItem);
}


function getTodosFromStorage(){  // Storage dan bütün todoları alıyor
    let todos;

    if(localStorage.getItem("todos") === null) {
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));

}

function showAlert(type,message){
    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    
    // SetTimeOut 
    setTimeout(function(){
        alert.remove();
    },1000)
}