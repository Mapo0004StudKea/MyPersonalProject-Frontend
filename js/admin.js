export function loadAdmin() {
    console.log('loadAdmin function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Admin Page</h1>
        <p>Manage your anime collection here.</p>
        <div class="container mt-5">
            <!-- Form for adding new anime -->
            <h2>Add New Anime</h2>
            <table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Input</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td><input type="text" id="title" placeholder="Title" required /></td>
                    </tr>
                    <tr>
                        <td>Link</td>
                        <td><input type="text" id="link" placeholder="Link" /></td>
                    </tr>
                    <tr>
                        <td>Genre</td>
                        <td><input type="text" id="genre" placeholder="Genre" /></td>
                    </tr>
                    <tr>
                        <td>Opinion</td>
                        <td><input type="text" id="opinion" placeholder="Opinion"></td>
                    </tr>
                    <tr>
                        <td>Watch Again</td>
                        <td><input type="text" id="watch-again" placeholder="Watch Again?"></td>
                    </tr>
                    <tr>
                        <td>Times Watched</td>
                        <td><input type="number" id="times-watched" placeholder="Times Watched" /></td>
                    </tr>
                    <tr>
                        <td>Start Date</td>
                        <td><input type="date" id="start-date" /></td>
                    </tr>
                    <tr>
                        <td>Last Change</td>
                        <td><input type="date" id="last-change" /></td>
                    </tr>
                    <tr>
                        <td>Release Date</td>
                        <td><input type="text" id="release-date" placeholder="Release date" /></td>
                    </tr>
                    <tr>
                        <td>Sub/Dub</td>
                        <td><input type="text" id="sub-dub" placeholder="Sub/Dub" /></td>
                    </tr>
                </tbody>
            </table>
            <button id="add-anime-btn">Add Anime</button>
            <button id="update-anime-btn" disabled>Update Anime</button>
            <button id="clear-data-btn">Clear Data</button>
            <!-- Table for managing anime -->
            <h2>Anime List</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Link</th>
                        <th>Genre</th>
                        <th>Opinion</th>
                        <th>Watch Again?</th>
                        <th>Times Watched</th>
                        <th>Start Date</th>
                        <th>Last Change</th>
                        <th>Release</th>
                        <th>Sub/Dub</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="anime-rows"></tbody>
            </table>
        </div>
    `;

    // Initialize listeners
    document.getElementById('add-anime-btn').addEventListener('click', handleAddAnime);
    document.getElementById('update-anime-btn').addEventListener('click', handleUpdateAnime);
    document.getElementById('clear-data-btn').addEventListener('click', clearForm);

    fetchAnime();
}

let currentEditId = null; // Track the anime being edited

// Fetch anime from backend
function fetchAnime() {
    fetch('http://localhost:8080/api/anime/GetAllAnime')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('anime-rows');
            tbody.innerHTML = '';
            data.forEach(anime => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${anime.id}</td>
                    <td>${anime.title}</td>
                    <td>${anime.link}</td>
                    <td>${anime.genre}</td>
                    <td>${anime.opinion}</td>
                    <td>${anime.watch_again}</td>
                    <td>${anime.times_watched}</td>
                    <td>${anime.start_date}</td>
                    <td>${anime.last_change}</td>
                    <td>${anime.release_date}</td>
                    <td>${anime.sub_dub}</td>
                    <td>
                        <button class="edit-btn" data-id="${anime.id}">Edit</button>
                        <button class="delete-btn" data-id="${anime.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn =>
                btn.addEventListener('click', () => handleEditAnime(btn.dataset.id))
            );
            document.querySelectorAll('.delete-btn').forEach(btn =>
                btn.addEventListener('click', () => handleDeleteAnime(btn.dataset.id))
            );
        })
        .catch(error => console.error('Error fetching anime:', error));
}

// Handle adding new anime
function handleAddAnime() {
    const anime = getAnimeFormData();

    fetch('http://localhost:8080/api/anime/createNewAnimeEntry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anime),
    })
        .then(response => {
            if (response.ok) {
                fetchAnime();
                clearForm();
            } else {
                throw new Error('Failed to add anime');
            }
        })
        .catch(error => console.error('Error adding anime:', error));
}

// Handle updating anime
function handleUpdateAnime() {
    if (!currentEditId) return;

    const anime = getAnimeFormData();

    fetch(`http://localhost:8080/api/anime/${currentEditId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anime),
    })
        .then(response => {
            if (response.ok) {
                fetchAnime();
                clearForm();
                currentEditId = null;
                document.getElementById('update-anime-btn').disabled = true;
            } else {
                throw new Error('Failed to update anime');
            }
        })
        .catch(error => console.error('Error updating anime:', error));
}

// Handle deleting anime
function handleDeleteAnime(id) {
    fetch(`http://localhost:8080/api/anime/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                fetchAnime();
            } else {
                throw new Error('Failed to delete anime');
            }
        })
        .catch(error => console.error('Error deleting anime:', error));
}

// Handle editing anime
function handleEditAnime(id) {
    fetch(`http://localhost:8080/api/anime/${id}`)
        .then(response => response.json())
        .then(anime => {
            // Populate form with anime data
            document.getElementById('title').value = anime.title;
            document.getElementById('link').value = anime.link;
            document.getElementById('genre').value = anime.genre;
            document.getElementById('opinion').value = anime.opinion;
            document.getElementById('watch-again').value = anime.watch_again;
            document.getElementById('times-watched').value = anime.times_watched;
            document.getElementById('start-date').value = anime.start_date;
            document.getElementById('last-change').value = anime.last_change;
            document.getElementById('release-date').value = anime.release_date;
            document.getElementById('sub-dub').value = anime.sub_dub;

            currentEditId = id; // Track the current anime being edited
            document.getElementById('update-anime-btn').disabled = false; // Enable update button
        })
        .catch(error => console.error('Error fetching anime for editing:', error));
}

// Clear the form
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('link').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('opinion').value = '';
    document.getElementById('watch-again').value = '';
    document.getElementById('times-watched').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('last-change').value = '';
    document.getElementById('release-date').value = '';
    document.getElementById('sub-dub').value = '';
    currentEditId = null;
    document.getElementById('update-anime-btn').disabled = true;
}

// Get form data as an object
function getAnimeFormData() {
    return {
        title: document.getElementById('title').value,
        link: document.getElementById('link').value,
        genre: document.getElementById('genre').value,
        opinion: document.getElementById('opinion').value,
        watch_again: document.getElementById('watch-again').value,
        times_watched: parseInt(document.getElementById('times-watched').value) || 0,
        start_date: document.getElementById('start-date').value,
        last_change: document.getElementById('last-change').value,
        release_date: document.getElementById('release-date').value,
        sub_dub: document.getElementById('sub-dub').value,
    };
}
