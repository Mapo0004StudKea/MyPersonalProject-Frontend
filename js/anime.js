export function loadAnime() {
    console.log('loadAnime function called');
    const app = document.getElementById('app');
    app.innerHTML = `
        <h1>Anime Page</h1>
        <p>Welcome to my list of anime I have watched</p>
        <div class="container mt-5">
            <table class="table">
                <thead>
                    <tr id="header-row">
                        <th style="width:15%">Title</th>
                        <th style="width:3%">Link</th>
                        <th style="width:13%">Genre</th>
                        <th style="width:9%">Opinion</th>
                        <th style="width:13%">Watch Again?</th>
                        <th style="width:13%">Times Watched</th>
                        <th style="width:8%">Start Date</th>
                        <th style="width:9%">Last Change</th>
                        <th style="width:8%">Release</th>
                        <th style="width:17%">Sub/Dub</th>
                    </tr>
                </thead>
                <tbody id="tbl-rows">
                </tbody>
            </table>
        </div>
    `;

    // Fetch data from backend
    fetch('http://localhost:8080/api/anime/GetAllAnime') // Adjust URL if needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('tbl-rows');
            tbody.innerHTML = ''; // Clear any existing rows

            // Populate table rows with fetched data
            data.forEach(anime => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${anime.title}</td>
                    <td><a href="${anime.link}" target="_blank">Link</a></td>
                    <td>${anime.genre}</td>
                    <td>${anime.opinion}</td>
                    <td>${anime.watch_again ? 'Yes' : 'No'}</td>
                    <td>${anime.times_watched}</td>
                    <td>${anime.start_date || 'N/A'}</td>
                    <td>${anime.last_change || 'N/A'}</td>
                    <td>${anime.release_date || 'N/A'}</td>
                    <td>${anime.sub_dub}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching anime data:', error);
        });
}
