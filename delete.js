const BASE = `https://jsonplaceholder.typicode.com/`;

// QUERY API AND RENDER DATA TO INTERFACE
// Query the api and retrieve data
const getTodoList = async () => {
  const response = await axios.get(`${BASE}todos/?_limit=5`);
  const todoList = response.data;
  //   console.log(todoList);
  return todoList;
};

// Build DOM node to render each item in list
const buildNode = (item) => {
  const newLi = document.createElement("li");
  newLi.append(item.title);
  newLi.addEventListener("click", async (e) => {
    // console.log(e.target.id);

    deleteElementFromApi(e.target.id);
    deleteElementFromDOM(e.target);
    // console.log("parent node", newLi.parentNode);
  });
  return newLi;
};

// Attach each todo and it's node to the ul element
const updateDOM = (todoList) => {
  const ulEl = document.querySelector("ul");
  // The conditionals below check to see if data is coming from an API or from user input
  if (Array.isArray(todoList) && todoList.length > 0) {
    todoList.map((item) => {
      const newLi = buildNode(item);
      newLi.id = item.id;
      //   console.log(newLi.id);
      ulEl.append(newLi);
    });
  } else if (todoList) {
    //   console.log(todoList.id);
    ulEl.append(buildNode(todoList));
  }
};

// Call everything in a sensible order
const main = async () => {
  const todoList = await getTodoList();
  updateDOM(todoList);
};

main();

// USER CAN ADD ITEMS
// Set a listener on form to capture inputed values
const formEl = document.querySelector("form");
const inputEl = document.querySelector("input");

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  buildTodo(inputEl.value);
  inputEl.value = "";
});

// Build a new todo from user input
const buildTodo = async (str) => {
  const newTodo = {
    title: str,
    completed: false,
    id: new Date().getTime().toString(),
    userId: 1,
  };
// Post the new todo to the API  
  const response = await axios.post(`${BASE}todos`, newTodo);
  updateDOM(response.data);
};

// USER CAN DELETE ITEMS
const deleteElementFromApi = async (id) => {
  const result = await axios.delete(`${BASE}todos/${id}`);
};

const deleteElementFromDOM = (item) => {
  item.parentElement.removeChild(item);
};
