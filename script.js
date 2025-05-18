const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = JSON.parse(localStorage.getItem('todos')) || []

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos))
}

const generateId = () => {
  return todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1
}

const newTodo = () => {
  const text = prompt("Введіть нову справу:")
  if (text) {
    todos.push({
      id: generateId(),
      text,
      done: false
    })
    saveTodos()
    render()
    updateCounter()
  }
}

const renderTodo = (todo) => {
  const checkedAttr = todo.done ? 'checked' : ''
  const labelClass = todo.done ? 'text-success text-decoration-line-through' : ''

  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${checkedAttr} onChange="checkTodo(${todo.id})" />
      <label for="${todo.id}"><span class="${labelClass}">${todo.text}</span></label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo(${todo.id})">delete</button>
    </li>
  `
}

const render = () => {
  list.innerHTML = todos.map(renderTodo).join('')
}

const updateCounter = () => {
  itemCountSpan.textContent = todos.length
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.done).length
}

const deleteTodo = (id) => {
  todos = todos.filter(todo => todo.id !== id)
  saveTodos()
  render()
  updateCounter()
}

const checkTodo = (id) => {
  const todo = todos.find(t => t.id === id)
  if (todo) {
    todo.done = !todo.done
    saveTodos()
    render()
    updateCounter()
  }
}

render()
updateCounter()
