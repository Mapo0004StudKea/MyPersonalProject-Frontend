export function loadAnime(page = 0, size = 10) {
    console.log('loadAnime function called');

    const app = document.getElementById('app');
    app.innerHTML = `
        <h1 class="my-4 text-black">Anime Page</h1>
        <p class="text-black">Welcome to my list of anime I have watched</p>
        <div class="container mt-5">
            <table class="table table-striped table-hover table-bordered border border-success">
                <thead class="thead-dark .text-warning">
                    <tr id="header-row">
                        <th style="width:22%">Title</th>
                        <th style="width:15%">Genre</th>
                        <th style="width:9%">Opinion</th>
                        <th style="width:13%">Watch Again?</th>
                        <th style="width:13%">Times Watched</th>
                        <th style="width:8%">Release</th>
                        <th style="width:17%">Sub/Dub</th>
                    </tr>
                </thead>
                <tbody id="tbl-rows">
                </tbody>
            </table>
            <div class="d-flex justify-content-center align-items-center gap-2 mt-4">
                <button id="first-page" class="btn btn-primary" disabled>First</button>
                <button id="prev-page" class="btn btn-primary" disabled>Previous</button>
                <span id="current-page" class="mx-3">Page ${page + 1}</span>
                <button id="next-page" class="btn btn-primary">Next</button>
                <button id="last-page" class="btn btn-primary">Last</button>
            </div>
            <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
                <input type="number" id="page-number-input" min="1" placeholder="Enter page number" class="form-control w-auto text-center"/>
                <button id="go-to-page" class="btn btn-primary">Go to Page</button>
            </div>
        </div>
    `;

    // Fetch data from backend with pagination
    fetch(`http://localhost:8080/api/anime/GetAllPaginatedAnime?page=${page}&size=${size}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('tbl-rows');
            tbody.innerHTML = ''; // Clear existing rows

            // Populate table rows with fetched data
            data.content.forEach(anime => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${anime.title}</td>
                        
                    <td>${anime.genre}</td>
                    <td>${anime.opinion}</td>
                    <td>${anime.watch_again}</td>
                    <td>${anime.times_watched}</td>
                    <td>${anime.release_date || 'N/A'}</td>
                    <td>${anime.sub_dub}</td>
                `;
                tbody.appendChild(row);
            });

            // Update pagination controls
            document.getElementById('first-page').disabled = data.first;
            document.getElementById('prev-page').disabled = data.first;
            document.getElementById('next-page').disabled = data.last;
            document.getElementById('last-page').disabled = data.last;
            document.getElementById('current-page').textContent = `Page ${data.number + 1} of ${data.totalPages}`;

            // Add event listeners for pagination buttons
            document.getElementById('first-page').onclick = () => loadAnime(0, size);
            document.getElementById('prev-page').onclick = () => loadAnime(page - 1, size);
            document.getElementById('next-page').onclick = () => loadAnime(page + 1, size);
            document.getElementById('last-page').onclick = () => loadAnime(data.totalPages - 1, size);

            // Add event listener for search page functionality
            document.getElementById('go-to-page').onclick = () => {
                const pageInput = document.getElementById('page-number-input').value;
                const targetPage = parseInt(pageInput, 10) - 1; // Convert to 0-based index
                if (targetPage >= 0 && targetPage < data.totalPages) {
                    loadAnime(targetPage, size);
                } else {
                    alert(`Please enter a valid page number between 1 and ${data.totalPages}`);
                }
            };
        })
        .catch(error => {
            console.error('Error fetching anime data:', error);
        });
}
