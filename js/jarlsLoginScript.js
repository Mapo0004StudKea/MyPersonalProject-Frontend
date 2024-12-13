const API_ENDPOINT = 'http://localhost:8080/api/books';
const API_LOGIN = 'http://localhost:8080/login';
const API_SIGNUP = 'http://localhost:8080/signup';

const PAGE_SIZE = 10
let sortColumn = 'author'
const tblRows = document.getElementById('tbl-rows');
let sortDirection = 'asc'

document.getElementById('btn-get-secret').onclick = getSecret;

document.getElementById('btn-fetch').onclick = function (evt) {
    fetchData();
}

document.getElementById('btn-signup').onclick = function (evt) {
    evt.preventDefault();
    showModalLogin(false);
}

const btnShowLogin = document.getElementById('btn-show-login');
btnShowLogin.onclick = function (evt) {
    evt.preventDefault();
    if (btnShowLogin.innerText == 'Sign in') {
        showModalLogin(true);
        btnShowLogin.innerText = 'Sign out';
    } else {
        btnShowLogin.innerText = 'Sign in';
        logout();
    }
};
function showModalLogin(login) {
    const myModal = new bootstrap.Modal(document.getElementById('login-modal'));
    let lbl
    if (login) {lbl = "Login"} else {lbl = "Sign up"}
    document.getElementById("modal-title").innerText = lbl;
    document.getElementById("btn-form-login").innerText = lbl;
    myModal.show()
}

document.getElementById('btn-form-login').onclick = function (evt) {
    evt.preventDefault();
    const loginTitle = document.getElementById("modal-title").innerText;
    if (loginTitle == "Sign up") {
        signup();
    }
    else
    {
        login();
    }
}

document.getElementById('header-row').onclick = function (evt) {
    const target = evt.target
    if (!target.id.startsWith("sort-")) return
    //TODO: Add the missing sort functionality here
    const targetSortColumn = target.id.substring(target.id.indexOf('-') + 1);
    if (target.dataset.sort_direction == 'asc' && targetSortColumn == sortColumn){
        target.dataset.sort_direction = 'desc';
        sortDirection = 'desc';
    } else {
        sortColumn = targetSortColumn;
        target.dataset.sort_direction = 'asc';
        sortDirection = 'asc';
    }
    /*
    if (targetSortColumn==sortColumn) {
      sortDirection = (sortDirection=='asc')?'desc':'asc';
    } else {
      sortColumn = targetSortColumn;
      sortDirection = 'asc';
    }
    */
    fetchData();
};

async function fetchData(page = 0, size = PAGE_SIZE, sort = sortColumn) {
    if (localStorage.getItem('user') == undefined) {
        //user not logged in
        console.log('Login to read books');
        return;
    }
    console.log(`fetch(${API_ENDPOINT}?page=${page}&size=${size}&sort=${sortColumn},${sortDirection})`);
    try {
        const fetchUrl = `${API_ENDPOINT}?page=${page}&size=${size}&sort=${sortColumn},${sortDirection}`;
        const token = getToken();
        const data = await fetch(fetchUrl,
            {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(handleHttpErrors)
        //.then(response => response.json()) //TODO: Handle error cases

        displayData(data.content);
        displayPagination(data.totalPages, page);
    } catch (err) {
        if (err.apiError){
            console.log("Full API error: ", err.apiError)
        } else {
            console.log(err.message)
        }
    }
}

function displayData(books) {
    tblRows.innerHTML = books.map(book => `<tr><td>${escapeHTML(book.author)}</td><td>${escapeHTML(book.title)}</td></tr>`).join('');
}

function displayPagination(totalPages, currentPage, size) {
    let paginationHtml = '';
    if (currentPage > 0) { // Previous Page
        paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`;
    }
    // Display page numbers
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHtml += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`;
        } else {
            paginationHtml += `<li class="page-item"><a class="page-link" data-page="${i}" href="#">${i + 1}</a></li>`;
        }
    }

    if (currentPage < totalPages - 1) { // Next Page
        paginationHtml += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`;
    }
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = paginationHtml;
}

document.querySelector('#pagination').onclick = function (evt) {
    evt.preventDefault();
    if (evt.target.tagName === 'A' && evt.target.hasAttribute('data-page')) {
        const page = parseInt(evt.target.getAttribute('data-page'));
        fetchData(page);
    }
};

fetchData();//Initial call to the backend

async function handleHttpErrors(res) {
    if (!res.ok) {
        const errorResponse = await res.json();
        const error = new Error(errorResponse.message)
        error.apiError = errorResponse
        throw error
    }
    return res.json()
}

function escapeHTML(string) {
    if (!string) return "";

    return string.replaceAll(`&`, "&amp;")
        .replaceAll(`>`, "&gt;")
        .replaceAll(`<`, "&lt;")
        .replaceAll(`"`, "&quot;")
        .replaceAll(`/`, "&#039;");
}

// const data = {author: "lis Benson", title: "16:01"};
// const options = makeOptions("POST",data);
// fetch("https://somewhereoutthere/books",options);

function makeOptions(method, body) {
    const opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    if (body) { //Observe how we can add new fields to an object when needed
        opts.body = JSON.stringify(body);
    }
    return opts;
}

function getToken(){
    const localstorage_user = JSON.parse(localStorage.getItem('user'))
    return  localstorage_user.token
}

function signup(event) {

    const nameField = document.getElementById("username-field").value;
    const passwordFieldSignup = document.getElementById("password-field").value;
    let payload = {
        username: nameField,
        password: passwordFieldSignup
    };
    payload = JSON.stringify(payload)
    fetch(API_SIGNUP,
        {
            method: "POST",
            body: payload,
            headers:{'content-type': 'application/json'}
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            console.log(JSON.stringify(data));
        })
}


function login(event) {

    const usernameField = document.getElementById("username-field").value;
    const passwordField = document.getElementById("password-field").value;
    let payload = {
        username: usernameField,
        password: passwordField
    };
    payload = JSON.stringify(payload)
    fetch(API_LOGIN,
        {
            method: "POST",
            body: payload,
            headers:{'content-type': 'application/json'}
        })
        .then(function (res) {
            return res.json();
        })
        .then(function (res) {
            localStorage.setItem('user', JSON.stringify(res));
            console.log(JSON.stringify(res));
        })
}

function getSecret(event) {
    event.preventDefault()
    if(localStorage.getItem('user') == undefined){
        console.log("No token. Login first");
        return
    }

    const token = getToken();
    console.log(token);
    myFetch("getSecret", "POST", null, getToken())
        .then((data) => {
            console.log(JSON.stringify(data));
        })
}

function myFetch(endpoint, method, payload=null, token){
    return fetch(`http://localhost:8080/${endpoint}`,  // important to start this line with 'return'
        {
            method: method,
            body: payload,
            headers:{'content-type': 'application/json',
                'Authorization': 'Bearer ' + token }
        })
        .then(function (res) {
            return res.json(); // wait for .json() to complete
        })
        .then(function (data) { // the data, provided by server response
            return data
        })
}


function deleteUser(event) {

    if(localStorage.getItem('user') == undefined){
        printThis(div, "No token. Login first", "red")
        return
    }
    const usernameDeleteField = document.getElementById("usernameDeleteField").value;
    let payload = {
        username: usernameDeleteField,
        password: "password"  // dummy password here
    };
    payload = JSON.stringify(payload)
    myFetch("deleteUser", "DELETE", payload, getToken())
        .then((data) => {
            printThis(div, JSON.stringify(data), "green")
        })
}

function clearData(){
    document.getElementById('pagination').innerHTML ="";
    tblRows.innerHTML = "";
}

function logout(event) {

    localStorage.removeItem('user')
    console.log("You have logged out.");
    clearData();
}
