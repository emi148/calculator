document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedButton = document.getElementById('clear-completed');

    let todos = [];

    // Check local storage for saved todos
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
        todos = savedTodos;
        renderTodos();
    }

    todoForm.addEventListener('submit', event => {
        event.preventDefault();
        const todoText = todoInput.value.trim();
        if (todoText === '') return;
        addTodo(todoText);
        todoInput.value = '';
    });

    function addTodo(todoText) {
        const newTodo = {
            id: Date.now().toString(),
            text: todoText,
            completed: false
        };
        todos.push(newTodo);
        saveAndRender();
    }

    function renderTodos() {
        clearElement(todoList);
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed');
            }
            li.dataset.todoId = todo.id;
            li.innerHTML = `
                <span>${todo.text}</span>
                <button class="delete-btn">Delete</button>
            `;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => {
                toggleCompleted(todo.id);
            });
            li.prepend(checkbox);
            todoList.appendChild(li);
        });
    }

    function toggleCompleted(todoId) {
        const selectedTodo = todos.find(todo => todo.id === todoId);
        if (selectedTodo) {
            selectedTodo.completed = !selectedTodo.completed;
            saveAndRender();
        }
    }

    function deleteTodo(todoId) {
        todos = todos.filter(todo => todo.id !== todoId);
        saveAndRender();
    }

    function saveAndRender() {
        saveTodos();
        renderTodos();
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterType = button.id;
            filterTodos(filterType);
        });
    });

    function filterTodos(filterType) {
        let filteredTodos = [];
        switch (filterType) {
            case 'all':
                filteredTodos = todos;
                break;
            case 'active':
                filteredTodos = todos.filter(todo => !todo.completed);
                break;
            case 'completed':
                filteredTodos = todos.filter(todo => todo.completed);
                break;
            default:
                filteredTodos = todos;
                break;
        }
        clearElement(todoList);
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed');
            }
            li.dataset.todoId = todo.id;
            li.innerHTML = `
                <span>${todo.text}</span>
                <button class="delete-btn">Delete</button>
            `;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => {
                toggleCompleted(todo.id);
            });
            li.prepend(checkbox);
            todoList.appendChild(li);
        });
    }

    todoList.addEventListener('click', event => {
        if (event.target.classList.contains('delete-btn')) {
            const todoId = event.target.parentElement.dataset.todoId;
            deleteTodo(todoId);
        }
    });

    clearCompletedButton.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveAndRender();
    });
});

