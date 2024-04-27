const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NWI5NGFhM2NlYmVlNTE3MDA1OGZkNTE4YmYyMzdmOSIsInN1YiI6IjY2MjhlMTQwZTI5NWI0MDE0YTlhM2EyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.92T_Xg7sAwljnOVmTCWxLkYMWTXdvllzp8EVPjlWVv0'
  }
};

const movieData = [];

async function getdata() {
  const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options);
  const data = await response.json();

  for (item of data['results']) {
    const movie = {};
    movie['title'] = item['title'];
    movie['overview'] = item['overview'];
    movie['poster_path'] = item['poster_path'];
    movie['vote_average'] = item['vote_average'];
    movie['movie_id'] = item['id'];

    movieData.push(movie);
  };
  return movieData;
};

function makeCard(item, count) {

  const innerHTML = `
  <div class="col" id="movieCard${count}">
      <div class="card h-100">
          <div onclick="alert('영화 id: ${item.movie_id}')">
              <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="이미지 준비중">
          </div>
          <div class="card-body">
              <h5 class="card-title" id="movieTitle${count}">제목: ${item.title}</h5>
              <p class="card-text">줄거리: ${item.overview}</p>
          </div>
          <div class="card-footer">
              <small class="text-body-secondary">평점: ${item.vote_average}</small>
          </div>
      </div>
  </div>
  `;
  document.querySelector("#moviecard").insertAdjacentHTML('beforeend', innerHTML);
}

function movieSearch() {

  const ex = document.querySelector("#search").value.toLowerCase();

  const searchedData = movieData.filter((i) => {
    if (i['title'].toLowerCase().search(ex) !== -1) {
      return i['title'];
    }
  });

  let num = 0;

  for (let count = 0; count < 20; count++) {
    const movieCardDiv = document.querySelector(`#movieCard${count}`);
    const movieTitle = document.querySelector(`#movieTitle${count}`);

    if (searchedData[num]['title'] === movieTitle.innerHTML.substr(4, 1000)) {
      console.log(searchedData[num]['title'], movieTitle.innerHTML.substr(4, 1000))
      movieCardDiv.setAttribute("style", "display: block;")
      if (searchedData.length - 1 > num) { num++ };
    } else {
      movieCardDiv.setAttribute("style", "display: none;")
    }

  }

}


const print = async () => {
  const data = await getdata();
  let count = 0;
  data.forEach(item => {
    makeCard(item, count);
    count++;
  });

  document.getElementById("searchbtn").addEventListener("click", movieSearch);
  document.getElementById("searchbtn").addEventListener("keydown", event => {
    if (event.key == 'Enter') { movieSearch() };
  });
}

print();