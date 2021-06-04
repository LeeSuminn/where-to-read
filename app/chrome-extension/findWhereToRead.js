{
  
  const ARROW_IMAGE_LINK = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOXB4IiBoZWlnaHQ9IjE0cHgiIHZpZXdCb3g9IjAgMCA5IDE0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkhvbWUvU2VjdGlvbi9IZWFkZXIvel9JdGVtcy9BcnJvdzwvdGl0bGU+CiAgICA8ZyBpZD0iSG9tZS9TZWN0aW9uL0hlYWRlci96X0l0ZW1zL0Fycm93IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiPgogICAgICAgIDxwb2x5bGluZSBpZD0iUGF0aC1Db3B5LTYiIHN0cm9rZT0iI0E1QTVBQSIgc3Ryb2tlLXdpZHRoPSIyIiBwb2ludHM9IjEgMSA3IDcgMSAxMyI+PC9wb2x5bGluZT4KICAgIDwvZz4KPC9zdmc+"
  
  //쿼리 받아오기
  let query = prompt('찾을 책을 입력해주세요');

  //모든 쿼리들은 띄어쓰기 제거해줌
  const queryFiltered = query.replace(/\s/g, '');

  async function fetchBooks() {
    const response = await fetch("booksInfo.json");
    const books = await response.json();
    return books;
  }

  fetchBooks().then(books => {
    return filterbook(queryFiltered,books);
  }).then((platforms) => {
    if (platforms) {
      console.log(platforms);
      platforms.forEach((platform) => {
      $ul.appendChild(makeNode(query, platform));
    })
    } else {
      alert("찾는 책이 없습니다");
      window.location.reload();
    }
  });
  function filterbook(query,books) {
    const filteredResult = books
      .filter(({ title }) => {
        return title === query;
      })
      .map((book) => {
        return book.platform;
      });
    return filteredResult[0];
  }

  const platformsInfo = {
    ridiselect: {
      prefix: 'https://select.ridibooks.com/search?q=',
      suffix: '&type=Books',
      imageClass: 'ridi',
      engToKor: '리디 셀렉트',
    },
    yes24bookclub: {
      prefix: 'https://bookclub.yes24.com/BookClub/Search?keyword=',
      suffix: '',
      imageClass: 'book-club',
      engToKor: 'YES24 북클럽'
    },
    kyoboSAM: {
      prefix: 'https://search.kyobobook.co.kr/web/search?vPstrKeyWord=',
      suffix: '&orderClick=LEK&searchCategory=SAM%40DIGITAL&collName=DIGITAL&searchPcondition=1&searchSbCdtnCode=4',
      imageClass: 'kyobo',
      engToKor: '교보SAM 무제한'
    },
  };

  function makeANode(query, platform) {
    const a = document.createElement('a');
    const { prefix, suffix } = platformsInfo[platform];
    a.setAttribute('href', prefix + encodeURIComponent(query) + suffix);
    a.setAttribute('target', '_blank');
    return a;
  }

  function makeDivNode(query, platform) {
    const divFirstChild = document.createElement('div');
    divFirstChild.setAttribute(
      'class',
      `platform__emoji ${platformsInfo[platform].imageClass}`
    );

    const divSecondChild = document.createElement('div');
    const divPlatformTitle = document.createElement('div');
    const spanPlatform = document.createElement('span')
    const spanTitle = document.createElement('span');
    spanPlatform.textContent = platformsInfo[platform].engToKor;
    spanTitle.textContent = query;
    
    divPlatformTitle.appendChild(spanPlatform);
    divPlatformTitle.appendChild(spanTitle);
    divPlatformTitle.setAttribute("class", "platform__text__container")
    
    const divImage = document.createElement('div');
    const $image = document.createElement("img");

    divImage.setAttribute("class", "platform__text__container__image")
    $image.setAttribute("src", ARROW_IMAGE_LINK);
    
    divImage.appendChild($image);
    divSecondChild.appendChild(divPlatformTitle);
    divSecondChild.appendChild(divImage);

    return [divFirstChild, divSecondChild];
  }

  function makeNode(query, platform) {
    const $li = document.createElement('li');
    const a = makeANode(query, platform);
    const divs = makeDivNode(query, platform);
    const hr = document.createElement('hr');
    console.log(a);
    divs.forEach((div) => {
      a.appendChild(div);
    });
    $li.appendChild(a);
    $li.appendChild(hr);
  
    return $li;
  }
  const $ul = document.querySelector('ul');
}
