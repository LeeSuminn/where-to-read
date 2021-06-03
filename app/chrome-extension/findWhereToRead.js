{
  const query = "홀로서기 심리학";
  const book = [
    {
      name: '홀로서기 심리학',
      platform: ['리디 셀렉트', '북클럽', '교보문고'],
    },
    {
      name: '우리 좋았잖아',
      platform: ['북클럽', '교보문고'],
    },
    {
      name: '사랑해',
      platform: ['북클럽'],
    },
  ];
  function filterbook(query) {
    const filteredResult = book
      .filter(({ name }) => {
        return name === query;
      })
      .map((book) => book.platform);
    return filteredResult[0];
  }

  const hrefs = {
    "리디 셀렉트": {
      prefix: "https://select.ridibooks.com/search?q=",
      suffix: "&type=Books",
      imageClass: "--ridi"
    },
    "북클럽": {
      prefix: "https://bookclub.yes24.com/BookClub/Search?keyword=",
      suffix: "",
      imageClass: "--book-club"
    },
    "교보문고": {
      prefix: "https://search.kyobobook.co.kr/web/search?vPstrKeyWord=",
      suffix: "&orderClick=LAG",
      imageClass: "--kyobo"
    }
  }

  function makeANode(query, platform) {
    const a = document.createElement('a')
    const { prefix, suffix } = hrefs[platform]
    a.setAttribute("href", prefix + query + suffix)
    a.setAttribute("target", "_blank")
    return a
  }

  function makeDivNode(query, platform) {
    const divFirstChild = document.createElement('div')
    divFirstChild.setAttribute("class", `platform__emoji ${hrefs[platform].imageClass}`)

    const divSecondChild = document.createElement('div')
    const spanFirst = document.createElement('span');
    const spanSecond = document.createElement('span');

    spanFirst.textContent = platform
    spanSecond.textContent = "화살표"

    divSecondChild.appendChild(spanFirst);
    divSecondChild.appendChild(spanSecond);
    return [divFirstChild, divSecondChild]
  }

  function makeNode(query, platform) {
    const li = document.createElement('li');
    const a = makeANode(query, platform)
    const divs = makeDivNode(query, platform)
    console.log(a);
    divs.forEach((div) => {
      a.appendChild(div)
    })
    li.appendChild(a);
    return li
  }

  const platforms = filterbook(query);
  $ul = document.querySelector('ul');
  platforms.forEach((platform) => {
    $ul.appendChild(makeNode(query, platform))
  });
}
  
