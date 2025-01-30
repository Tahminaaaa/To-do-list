const inputField = document.querySelector("input");
const addButton = document.querySelector("button");
const itemsList = document.querySelector(".items__list");
const doneItems = document.querySelector(".done-items");
const modalInput = document.querySelector(".modal-input");
const editDoneButton = document.querySelector(".edit-done-btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
let currentItem = null;


document.addEventListener("DOMContentLoaded", loadItemsFromLocalStorage);

function addItem() {
    const newItemText = inputField.value.trim();

    if (newItemText !== "") {
        const listItem = createListItem(newItemText, false);
        itemsList.prepend(listItem);

        saveToLocalStorage(newItemText, false);

        inputField.value = "";
    } else {
        alert("Please enter a to-do item.");
    }
}

function createListItem(text, isDone) {
    const listItem = document.createElement("li");

    const radioButton = document.createElement("input");
    radioButton.type = "radio";
    radioButton.classList.add("radio-btn");
    radioButton.checked = isDone;

    const textSpan = document.createElement("span");
    textSpan.textContent = text;

    const editButton = document.createElement("button");
    editButton.innerHTML = `<ion-icon name="create-outline"></ion-icon>`;
    editButton.classList.add("edit-btn");

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<ion-icon name="close-outline"></ion-icon>`;
    deleteButton.classList.add("delete-btn");

    radioButton.addEventListener("click", function () {
        listItem.remove();
        removeFromLocalStorage(text);
        saveToLocalStorage(text, true);

        if (radioButton.checked) {
            doneItems.appendChild(listItem);
            textSpan.style.textDecoration = "line-through";
        }
    });

    deleteButton.addEventListener("click", function () {
        listItem.remove();
        removeFromLocalStorage(text);
    });

    editButton.addEventListener("click", function () {
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
        console.log(editButton)
        currentItem = textSpan;
        modalInput.value = textSpan.textContent;
    })
    editDoneButton.addEventListener("click", function () {
        if (currentItem) {
            const updatedText = modalInput.value.trim();
            if (updatedText) {
                currentItem.textContent = updatedText;

                updateLocalStorage(currentItem.textContent, updatedText);
            }
        }
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    });

    function updateLocalStorage(oldText, newText) {
        let items = JSON.parse(localStorage.getItem("todoItems")) || [];
        items = items.map(item => item.text === oldText ? { text: newText, isDone: item.isDone } : item);
        localStorage.setItem("todoItems", JSON.stringify(items));
    };

    listItem.appendChild(radioButton);
    listItem.appendChild(textSpan);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    if (isDone) {
        doneItems.appendChild(listItem);
        textSpan.style.textDecoration = "line-through";
    } else {
        itemsList.appendChild(listItem);
    }

    return listItem;
}

function saveToLocalStorage(text, isDone) {
    let items = JSON.parse(localStorage.getItem("todoItems")) || [];
    items.push({ text, isDone });
    localStorage.setItem("todoItems", JSON.stringify(items));
}

function removeFromLocalStorage(text) {
    let items = JSON.parse(localStorage.getItem("todoItems")) || [];
    items = items.filter(item => item.text !== text);
    localStorage.setItem("todoItems", JSON.stringify(items));
}

function loadItemsFromLocalStorage() {
    let items = JSON.parse(localStorage.getItem("todoItems")) || [];

    items.forEach(item => {
        const listItem = createListItem(item.text, item.isDone);
        if (item.isDone) {
            doneItems.appendChild(listItem);
        } else {
            itemsList.appendChild(listItem);
        }
    });
}

addButton.addEventListener("click", addItem);
inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
});
