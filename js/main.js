// 1.
const createElemWithText = (elemType = "p", text = "", className) => {
    const newElem = document.createElement(elemType);
    newElem.textContent = text;
    if (className) {
        newElem.classList.add(className);
    }
    return newElem;
}

// 2.
const createSelectOptions = (data) => {
    const optionsArray = [];
    if (!data) return;
    data.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        optionsArray.push(option);
    });
    return optionsArray;
}

// 3.
const toggleCommentSection = (postId) => {
    if (!postId) return;
    const elem = document.querySelector(`section[data-post-id='${postId}']`);
    if (elem) {
        elem.classList.toggle("hide");
    }
    return elem;
}

// 4.
const toggleCommentButton = (postId) => {
    if (!postId) return;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (button) {
        button.textContent === "Show Comments"
        ? (button.textContent = "Hide Comments")
        : (button.textContent = "Show Comments");
    }  
    return button;
}

// 5.
const deleteChildElements = (parentElement) => {
    if (!parentElement?.tagName) return;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// 6.
const addButtonListeners = () => {
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    buttons.forEach((button) => {
        let postId = button.dataset.postId;
        button.addEventListener("click", (event) => {
            toggleComments(event, postId)
        }, false)
    });
    return buttons;
}

// 7.
const removeButtonListeners = () => {
    const main = document.querySelector("main");
    const buttons = main.querySelectorAll("button");
    buttons.forEach((button) => {
        let postId = button.dataset.postId;
        button.removeEventListener("click", (event) => {
            toggleComments(event, postId)
        }, false)
    });
    return buttons;
}

// 8.
const createComments = (comments) => {
    if (!comments) return;
    const fragment = document.createDocumentFragment();
    comments.forEach((comment) => {
        let article = document.createElement("article");
        let h3 = createElemWithText('h3', comment.name);
        let p = createElemWithText('p', comment.body);
        let p2 = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, p, p2);
        fragment.append(article);
    });
    return fragment;
}

// 9.
const populateSelectMenu = (data) => {
    if (!data) return;
    const selectMenu = document.getElementById("selectMenu");
    const options = createSelectOptions(data);
    options.forEach((option) => {
        selectMenu.append(option);
    });
    return selectMenu;
}

// 10.
const getUsers = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 11.
const getUserPosts = async (userId) => {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 12.
const getUser = async (userId) => {
    if (!userId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 13.
const getPostComments = async (postId) => {
    if (!postId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// 14.
const displayComments = async (postId) => {
    if (!postId) return;
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.append(fragment);
    return section;
}

// 15.
const createPosts = async (data) => {
    if (!data) return;
    const fragment = document.createDocumentFragment();
    for (let post of data) {
        let article = document.createElement("article");
        let h2 = createElemWithText('h2', post.title);
        let p = createElemWithText('p', post.body);
        let p2 = createElemWithText('p', `Post ID: ${post.id}`);
        let author = await getUser(post.userId);
        let p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText('p', author.company.catchPhrase);
        let button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        let section = await displayComments(post.id);
        article.append(h2, p, p2, p3, p4, button, section);
        fragment.append(article);
    }
    return fragment;
}

// 16. 
const displayPosts = async (posts) => {
    const main = document.querySelector("main");
    const element = posts ? await createPosts(posts) 
        : createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');
    main.append(element);
    return element;
}

// 17.
const toggleComments = (event, postId) => {
    if (!postId) return;
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

// 18.
const refreshPosts = async (posts) => {
    if (!posts) return;
    const removeButtons = removeButtonListeners();
    const main = document.querySelector("main");
    const mainElem = deleteChildElements(main);
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, mainElem, fragment, addButtons];
}

// 19.
const selectMenuChangeEventHandler = async (event) => {
    if (!event) return;
    document.getElementById("selectMenu").disabled = true;
    const userId = event.target.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    document.getElementById("selectMenu").disabled = false;
    return [userId, posts, refreshPostsArray];
}

// 20.
const initPage = async () => {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

// 21.
const initApp = () => {
    initPage();
    const selectMenu = document.getElementById("selectMenu");
    selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}
document.addEventListener("DOMContentLoaded", initApp);