export function loadAdmin() {
    console.log('loadAdmin function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Admin Page</h1>
        <p>Manage your collections here</p>
        <div class="container mt-5">
            <h2>Anime List</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
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
                <tbody id="anime-rows">
                    <!-- Add New Anime Row -->
                    <tr id="add-anime-row">
                        <td></td>
                        <td><input type="text" id="new-title" placeholder="Title" /></td>
                        <td><input type="text" id="new-genre" placeholder="Genre" /></td>
                        <td><input type="text" id="new-opinion" placeholder="Opinion" /></td>
                        <td><input type="text" id="new-watch_again" placeholder="Watch again?" /></td>
                        <td><input type="number" id="times-watched" placeholder="Times Watched" /></td>
                        <td><input type="date" id="start-date" /></td>
                        <td><input type="date" id="last-change" /></td>
                        <td><input type="text" id="release" placeholder="Release" /></td>
                        <td>
                            <button id="add-anime-btn">Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    // Fetch and display anime
    fetchAnime();

    // Add button listener
    document.getElementById('add-anime-btn').addEventListener('click', handleAddAnime);
}

// Fetch anime from backend
function fetchAnime() {
    fetch('http://localhost:8080/api/anime/GetAllAnime')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('anime-rows');
            const addRow = document.getElementById('add-anime-row'); // Preserve the Add New Anime row
            tbody.innerHTML = '';
            data.forEach(anime => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${anime.id}</td>
                    <td>${anime.title}</td>
                    <td>${anime.genre}</td>
                    <td>${anime.opinion}</td>
                    <td>
                        <button class="edit-btn" data-id="${anime.id}">Edit</button>
                        <button class="delete-btn" data-id="${anime.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            // Re-add the Add New Anime row
            tbody.appendChild(addRow);

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
    const anime = {
        title: document.getElementById('new-title').value,
        genre: document.getElementById('new-genre').value,
        opinion: document.getElementById('new-opinion').value,
    };

    fetch('http://localhost:8080/api/anime/createNewAnimeEntry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anime),
    })
        .then(response => {
            if (response.ok) {
                fetchAnime(); // Refresh anime list
                // Clear input fields
                document.getElementById('new-title').value = '';
                document.getElementById('new-genre').value = '';
                document.getElementById('new-opinion').value = '';
            } else {
                throw new Error('Failed to add anime');
            }
        })
        .catch(error => console.error('Error adding anime:', error));
}

// Handle deleting anime
function handleDeleteAnime(id) {
    fetch(`http://localhost:8080/api/anime/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                fetchAnime(); // Refresh anime list
            } else {
                throw new Error('Failed to delete anime');
            }
        })
        .catch(error => console.error('Error deleting anime:', error));
}

// Handle editing anime
function handleEditAnime(id) {
    const newTitle = prompt('Enter new title:');
    if (!newTitle) return;

    fetch(`http://localhost:8080/api/anime/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
    })
        .then(response => {
            if (response.ok) {
                fetchAnime(); // Refresh anime list
            } else {
                throw new Error('Failed to edit anime');
            }
        })
        .catch(error => console.error('Error editing anime:', error));
}
