const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let todos = [
  { id: 1, text: "Вивчити HTML", done: true },
  { id: 2, text: "Вивчити CSS", done: true },
  { id: 3, text: "Вивчити JavaScript", done: false }
]

function generateId() {
  return todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1
}

function newTodo() {
  const text = prompt("Введіть нову справу:")
  if (text) {
    todos.push({
      id: generateId(),
      text: text,
      done: false
    })
    render()
    updateCounter()
  }
}

function renderTodo(todo) {
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

function render() {
  list.innerHTML = todos.map(renderTodo).join('')
}

function updateCounter() {
  itemCountSpan.textContent = todos.length
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.done).length
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id)
  render()
  updateCounter()
}

function checkTodo(id) {
  const todo = todos.find(t => t.id === id)
  if (todo) {
    todo.done = !todo.done
    render()
    updateCounter()
  }
}

render()
updateCounter()
