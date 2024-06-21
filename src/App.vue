<script>
import { computed, ref } from 'vue'

export default {
  name: 'App',
  setup() {
    const newTodo = ref('')
    const newTodoType = ref('Personal')
    const defaultData = [
      {
        done: false,
        content: 'Write a blog post',
        type: 'Personal',
        id: Date.now(),
      },
    ]
    const todosData = JSON.parse(localStorage.getItem('todos')) || defaultData
    const todos = ref(todosData)
    const filters = ref(['All', 'Personal', 'Work', 'Other'])
    const activeFilter = ref('All')
    const getTodos = computed(() => {
      if (activeFilter.value === 'All')
        return todos.value

      return todos.value.filter(item => item.type === activeFilter.value)
    })
    const emptyNote = computed(() => {
      return `There is no tasks with type ${activeFilter.value} so far. Please, add some!`
    })
    function addTodo() {
      if (newTodo.value) {
        todos.value.push({
          done: false,
          content: newTodo.value,
          type: newTodoType.value,
          id: Date.now(),
        })
        resetTodo()
      }
      saveData()
    }
    function doneTodo(todo) {
      todo.done = !todo.done
      saveData()
    }
    function removeTodo(id) {
      todos.value = todos.value.filter((todo) => {
        return todo.id !== id
      })
      saveData()
    }
    function saveData() {
      const storageData = JSON.stringify(todos.value)
      localStorage.setItem('todos', storageData)
    }
    function filterTodo(type) {
      activeFilter.value = type
    }
    function resetTodo() {
      newTodo.value = ''
      newTodoType.value = 'Personal'
    }
    return {
      todos,
      newTodo,
      newTodoType,
      filters,
      getTodos,
      emptyNote,
      addTodo,
      doneTodo,
      removeTodo,
      saveData,
      filterTodo,
      resetTodo,
      activeFilter,
    }
  },
}
</script>

<template>
  <section class="add-container">
    <h2>New Task</h2>
    <form @submit.prevent="addTodo()">
      <label><input
        v-model="newTodo"
        name="newTodo"
        class="new-todo"
        autocomplete="off"
      ></label>
      <fieldset>
        <legend>Please select your preferred contact method:</legend>
        <div class="labels">
          <input
            id="typeChoice1"
            v-model="newTodoType"
            type="radio"
            name="type"
            value="Personal"
            checked
          >
          <label for="typeChoice1">Personal</label>
          <input
            id="typeChoice2"
            v-model="newTodoType"
            type="radio"
            name="type"
            value="Work"
          >
          <label for="typeChoice2">Work</label>
          <input
            id="typeChoice3"
            v-model="newTodoType"
            type="radio"
            name="type"
            value="Other"
          >
          <label for="typeChoice3">Other</label>
        </div>
      </fieldset>
      <button class="add-btn">
        Add task
      </button>
    </form>
  </section>
  <template v-if="todos.length">
    <section class="review-container">
      <h2>ToDo List</h2>
      <div class="tags-wrapper">
        <p v-for="(filter, index) in filters" :key="index">
          <span
            :class="{ active: filter === activeFilter }"
            @click="filterTodo(filter)"
          >{{ filter }}</span>
        </p>
      </div>
      <p v-if="!getTodos.length" class="empty-message">
        {{ emptyNote }}
      </p>
      <ul v-else>
        <li
          v-for="(todo, index) in getTodos"
          :key="index"
          :class="{ done: todo.done }"
        >
          <span class="task" @click="doneTodo(todo)">{{ todo.content }}</span>
          <span class="label">{{ todo.type }}</span>
          <button class="remove-btn" @click="removeTodo(todo.id)" />
        </li>
      </ul>
    </section>
  </template>
  <template v-else>
    <section class="empty-container">
      <h2>Your tasks will appear here</h2>
      <img
        src="https://doodleipsum.com/700?i=b2a7f828acad27e884b0aabcf6f10ab6"
        alt="a picture of man relaxing and drinking tea"
      >
    </section>
  </template>
</template>
