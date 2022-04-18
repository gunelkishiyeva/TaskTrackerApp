const TODOS = 'TODOS'


class Todo {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }

}
class TodoService {
    _todos;

    constructor(todos = []) {
        this._init();
        if (!this._todos.length) {
            this._todos = todos;
            this._commit();
        }
    }

    //take from local storage

    _init() {
        const todos = JSON.parse(localStorage.getItem(TODOS) || '[]');

        this._todos = todos;
    }
    //write to local storage
    _commit() {
        localStorage.setItem(TODOS, JSON.stringify(this._todos));
    }

    getTodos() {
        return [...this._todos];
    }

    addTodo(title = '') {
        if (!this._todos.some(t => !t.title)) {
            const todo = { id: this._generateId(), title };
            this._todos = [todo, ...this._todos];
            this._commit();
            return todo;
        }
        throw new Error('There is empty element in todo list');
    }

    editTodo(id, title) {
        if (!title) throw new Error('You can not empty title. Instead just delete todo.');
        const todos = [...this._todos];
        todos[this._getIndex(id)].title = title;
        this._todos = todos;
        this._commit();
    }

    sortTodos(direction) {
        const todos = [...this._todos]
            .filter(t => t.title)
            .sort((a, b) => a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1)

        todos.sort();
        if (direction === true) {
            todos.reverse()
        }
        this._todos = todos;
        this._commit();


        if (!this._todos.some(t => !t.title)) {
            alert('There is no element for sorting.')
        }
    }

    deleteTodo(id) {
        this._todos = this._todos.filter(t => t.id !== id);
        this._commit();
        
    }

    _getIndex(id) {
        const index = this._todos.findIndex(t => t.id === id);
        if (index !== -1) {//id sehv oturulubse -1 qaytarir findindex
            return index;
        }
        throw new Error(`There are no such todo with ${id} id.`)
    }

    _generateId() {
        return this._todos?.length ? [... this._todos].sort((a, b) => b.id - a.id)[0].id + 1 : 1;//yoxla id 0disa 
    }
}
class Application {
    _todoList;
    _alertBlock;
    _addBtn;
    _sortBtn;
    _sortDirection = false;
    _todoService;
    constructor(todoService) {
        /** @type TodoService */
        this._todoService = todoService;
        this._todoList = this._getElement('#todo-list');
        // this._alertBlock = this._getElement('#alert-block');
        this._addBtn = this._getElement('#add-btn');
        this._sortBtn = this._getElement('#sort-btn');

        this._addBtn.addEventListener('click', e => this._handleAdd());
        this._sortBtn.addEventListener('click', e => this._handleSort());
        this._displayTodos();
    }
    get todos() {
        return this._todoService.getTodos();
    }
    _displayTodos() {
        const todos = this.todos;
        // this._todoList.innerHTML = todos?.length ? '' : '<div class="fs-1 text-center text-muted text-nowrap bd-highlight"></div>';
       
        const items = this.todos.map(t => {//map edirik ki bize return etsin listitemleri
            const listItem = document.createElement('li');
            const input = document.createElement('input');
            input.value = t.title;
            input.placeholder ="Enter todo...";
            input.addEventListener('change', e => this._handleEdit(t.id, e.target.value));
            listItem.append(input);
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('remove');
            deleteBtn.innerHTML = '<img src="./assets/remove-input.svg">';
            deleteBtn.addEventListener('click', e => this._handleDelete(t.id));
            listItem.append(deleteBtn);
            // this._todoList.append(listItem);
            return listItem;
        });
        this._todoList.innerHTML = '';
        this._todoList.append(...items);
    }
    
    _handleAdd() {
        try {
            this._todoService.addTodo();
            this._displayTodos();
        } catch (error) {
            this._showError(error);
        }
    }
    _handleEdit(id, title) {
        try {
            this._todoService.editTodo(id, title);
            this._displayTodos();
        } catch (error) {
            this._showError(error);
        }
    }
    _handleDelete(id) {
        this._todoService.deleteTodo(id);
        this._displayTodos();
        
    }


    _handleSort() {
        this._todoService.sortTodos(this._sortDirection);
        this._sortDirection = !this._sortDirection;
        this._displayTodos();
        /** @type {HTMLImageElement} */
        let img = this._sortBtn.firstChild;
        img.src = this._sortDirection ? './assets/order.svg' : './assets/order-down.svg';

        
    }

    _showError(error) {
        alert(error.message);
        
        this._displayTodos();
    }

    /**
     * 
     * @param {string} selector 
     * @returns {HTMLElement}
     */
    _getElement(selector) {
        const element = document.querySelector(selector);
        
        if (element) return element;
        throw new Error(`There are no such element for ${selector} selector.`);
    }
}


const app = new Application(new TodoService([{id:1,title:''}]));




