// https://zsh.sourceforge.io/Doc/Release/Prompt-Expansion.html

const json_items = fetch("./items.json")
	.then((response) => {
		return response.json();
	})
	.then((items) => sortItemsAlphabetically(items))
	.then((items) => createListItems(items, getListItemsElement()));

function sortItemsAlphabetically(items) {
	items.item.sort((a, b) => {
		if (a.id < b.id) return -1;
		if (a.id > b.id) return 1;
		return 0;
	});
	return items;
}

function createListItems(items, itemsElement) {
	items.item.forEach((item) => {
		const itemsDiv = itemsElement;
		const itemElement = createListItem(item);

		itemsDiv.appendChild(itemElement);
	});
}

function createListItem(item) {
	const name = item["name"];
	const code = item["code"];
	const id = item["id"];

	const linkElement = document.createElement("button");
	linkElement.setAttribute("id", id);
	linkElement.setAttribute("class", "btn btn-sm btn-outline-secondary");
	linkElement.setAttribute("data-toggle", "tooltip");
	linkElement.setAttribute("title", code);

	const linkText = document.createTextNode(name);
	linkElement.appendChild(linkText);
	linkElement.addEventListener(
		"click",
		() => {
			onItemClick(item);
		},
		false
	);
	linkElement.addEventListener(
		"mouseover",
		() => {
			onItemMouseOver(item);
		},
		false
	);
	linkElement.addEventListener(
		"mouseleave",
		() => {
			onItemMouseLeave();
		},
		false
	);

	return linkElement;
}

function createDiv(id) {
	const div = document.createElement("div");
	if (id === "undefined") {
	div.setAttribute("id", id);
	}
	return div;
}

function onItemMouseOver(item) {
	const descriptionUninitialised =
		typeof getDescriptionElement().innerText === "undefined";
	const descriptionUnset = getDescriptionElement().innerText === "";

	const description = item["description"];

	if (descriptionUninitialised || descriptionUnset) {
		getDescriptionElement().innerText = description;
	} else {
		getDescriptionElement().innerText += description;
	}
}

function onItemMouseLeave() {
	getDescriptionElement().innerText = "";
}

function onItemClick(item) {
	const promptUninitialised =
		typeof getPromptInputElement().value === "undefined";
	const promptUnset = getPromptInputElement().value === "";

	const id = item["id"];
	const example = item["example"];
	const code = item["code"];

	if (promptUninitialised || promptUnset) {
		getPromptInputElement().value = id;
		getPreviewInputElement().value = example;
		getCodeInputElement().value = code;
	} else {
		getPromptInputElement().value += " ";
		getPromptInputElement().value += id;
		getPreviewInputElement().value += example;
		getCodeInputElement().value += code;
	}

	updateUrlPath(getCodeInputElement().value);
}

function getListItemsElement() {
	return document.getElementById("items");
}

function getDescriptionElement() {
	return document.getElementById("description");
}

function getPromptInputElement() {
	return document.getElementById("prompt");
}

function getPreviewInputElement() {
	return document.getElementById("preview");
}

function getCodeInputElement() {
	return document.getElementById("code");
}

function updateUrlPath(urlPath) {
	window.history.replaceState(null, "", encodeURIComponent(urlPath));
}

function getUrlPath() {
	return window.location.pathname;
}
