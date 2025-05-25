const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
const statusDiv = document.getElementById('status')

const FIREBASE_URL = 'https://to-do-list-20290-default-rtdb.europe-west1.firebasedatabase.app/todos'

let todos = {}

const setStatus = (msg, isError = false) => {
  statusDiv.textContent = msg
  statusDiv.className = isError ? 'text-danger' : 'text-secondary'
}

const addTodo = async (text) => {
  setStatus("Завантаження...")
  const response = await fetch(`${FIREBASE_URL}.json`, {
    method: 'POST',
    body: JSON.stringify({ text, done: false }),
    headers: { 'Content-Type': 'application/json' }
  })
  const data = await response.json()
  if (data.name) {
    todos[data.name] = { text, done: false }
    render()
    updateCounter()
    setStatus("Справу додано!")
  } else {
    setStatus("Помилка при додаванні!", true)
  }
}

const fetchTodos = async () => {
  setStatus("Завантаження...")
  try {
    const response = await fetch(`${FIREBASE_URL}.json`)
    todos = await response.json() || {}
    render()
    updateCounter()
    setStatus("Готово")
  } catch (err) {
    setStatus("Помилка при завантаженні!", true)
  }
}

const deleteTodo = async (id) => {
  await fetch(`${FIREBASE_URL}/${id}.json`, { method: 'DELETE' })
  delete todos[id]
  render()
  updateCounter()
}

const checkTodo = async (id) => {
  const todo = todos[id]
  if (todo) {
    todo.done = !todo.done
    await fetch(`${FIREBASE_URL}/${id}.json`, {
      method: 'PATCH',
      body: JSON.stringify({ done: todo.done }),
      headers: { 'Content-Type': 'application/json' }
    })
    render()
    updateCounter()
  }
}

const newTodo = () => {
  const text = prompt("Введіть нову справу:")
  if (text) addTodo(text)
}

const renderTodo = (id, todo) => {
  const checkedAttr = todo.done ? 'checked' : ''
  const labelClass = todo.done ? 'text-success text-decoration-line-through' : ''
  return `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${id}" ${checkedAttr} onChange="checkTodo('${id}')" />
      <label for="${id}"><span class="${labelClass}">${todo.text}</span></label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo('${id}')">delete</button>
    </li>
  `
}

const render = () => {
  list.innerHTML = Object.entries(todos)
      .map(([id, todo]) => renderTodo(id, todo))
      .join('')
}

const updateCounter = () => {
  const all = Object.keys(todos).length
  const unchecked = Object.values(todos).filter(todo => !todo.done).length
  itemCountSpan.textContent = all
  uncheckedCountSpan.textContent = unchecked
}

fetchTodos()
