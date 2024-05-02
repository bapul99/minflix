const options = { // 옵션 설정
  method: 'GET',
  headers: {
    accept: 'application/json', // JSON 형식으로 받기
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NWI5NGFhM2NlYmVlNTE3MDA1OGZkNTE4YmYyMzdmOSIsInN1YiI6IjY2MjhlMTQwZTI5NWI0MDE0YTlhM2EyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.92T_Xg7sAwljnOVmTCWxLkYMWTXdvllzp8EVPjlWVv0'  // API 키
  }
};

const movieData = []; // 영화 데이터를 담을 배열

async function getdata() { // 영화 데이터를 가져오는 함수
  const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options); // API 호출
  const data = await response.json(); // JSON 형식으로 변환

  for (item of data['results']) { // 영화 데이터를 배열에 저장
    const movie = {};
    movie['title'] = item['title'];
    movie['overview'] = item['overview'];
    movie['poster_path'] = item['poster_path'];
    movie['vote_average'] = item['vote_average'];
    movie['movie_id'] = item['id'];

    movieData.push(movie); // 영화 데이터 배열에 저장
  };
  return movieData; // 영화 데이터 반환
};

function makeCard(item, count) { // 영화 카드를 생성하는 함수

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
  document.querySelector("#moviecard").insertAdjacentHTML('beforeend', innerHTML); // 영화 카드를 출력
}

function movieSearch() { // 영화 검색 함수

  const ex = document.querySelector("#search").value.toLowerCase(); // 검색어를 소문자로 변환

  const searchedData = movieData.filter((i) => { // 검색어가 포함된 영화 데이터를 찾아서 배열에 저장
    if (i['title'].toLowerCase().search(ex) !== -1) { // 검색어가 제목에 포함되어 있으면
      return i['title'];                              // 배열에 저장
    }
  });

  let num = 0; // 검색어가 포함된 영화 데이터의 인덱스

  for (let count = 0; count < 20; count++) { // 영화 카드를 숨기거나 보이게 하는 반복문
    const movieCardDiv = document.querySelector(`#movieCard${count}`); // 영화 카드 div
    const movieTitle = document.querySelector(`#movieTitle${count}`); // 영화 제목 h5

    if (searchedData[num]['title'] === movieTitle.innerHTML.substr(4, 1000)) { // 검색어가 포함된 영화 데이터가 있으면
      console.log(searchedData[num]['title'], movieTitle.innerHTML.substr(4, 1000)) // 검색어가 포함된 영화 데이터와 영화 제목 출력
      movieCardDiv.setAttribute("style", "display: block;") // 영화 카드를 보이게 함
      if (searchedData.length - 1 > num) { num++ }; // 검색어가 포함된 영화 데이터가 여러개일 경우 다음 데이터로 넘어감
    } else {
      movieCardDiv.setAttribute("style", "display: none;") // 검색어가 포함된 영화 데이터가 없으면 영화 카드를 숨김
    }

  }

}


const print = async () => { // 영화 데이터를 출력하는 함수
  const data = await getdata(); // 영화 데이터를 가져옴
  let count = 0;
  data.forEach(item => { // 영화 데이터를 카드로 출력
    makeCard(item, count);
    count++;
  });

  document.getElementById("searchbtn").addEventListener("click", movieSearch); // 검색 버튼 클릭 시 검색 함수 실행
  document.getElementById("searchbtn").addEventListener("keydown", event => {  // 엔터키 입력 시 검색 함수 실행
    if (event.key == 'Enter') { movieSearch() };
  });
}

print(); // 출력 함수 실행