/* 定義了所有的遊戲狀態 */
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}


const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]
const view = {
  getCardContent(index) {  /* 用來看牌正面的花色和數字 */
    /* const number = (index%13)+1 /* 用餘數來判斷數字 */
    const number = this.transformNumber((index % 13) + 1) /* 用餘數來判斷數字 且當遇到11、12、13、1時利用transformNumber()傳換成J、Q、K、A*/
    const symbol = Symbols[Math.floor(index / 13)] /*用來判斷花色 ex:Symbols[0]=>黑陶  Symbols[2]=>方塊  */
    return `<p>${number}</p>
      <img src="${symbol}" alt="">
      <p>${number}</p>`
  },

  getCardElement(index) {      /* 用來看牌的背面用 */
    return `<div data-index="${index}" class="card back"></div>`
    /* 由於現在預設渲染的卡片元素是背面，從 HTML 來看他是沒有索引數字的，這樣即使選取到這個 DOM 元素也不知道怎麼運算牌面內容。 */
    //////*這裡加上data-index="${index}" 是用來得到點擊的卡片的類似id的資料 這樣才能把${index}的值輸入到getCardContent()這個函式裡面 才能得到那張牌的花色和數字  */

  },   /* getCardElement()transformNumber()分別為兩個物件 中間記得加上逗號， */

  transformNumber(number) {
    switch (number) {  /* 用switch()產生case可以轉換我們要的內容 */
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards")
    /* rootElement.innerHTML = this.getCardElement(0) */

    /* rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join('') */
    /*Array(52).keys()意思是從一個object{a:0,b:1,c:2.....以此類推總共52個數}當中把keys也就是1、2、3....51取出  接著透過 Array.from( )把取出的52個數變成一個陣列 在透過map()代表依序把陣列中的每個數字丟入 透過括弧中的getCardElement(index)轉換成各張牌 最後因為透過map()得到的形式是一個函52個元素的陣列 所以最後要透過join('')把陣列當中的52個元素 黏起來 合併成一個大字串 就得到我們要的52張牌囉~~~  */

    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')  /*把Array.from(Array(52).keys()) 替換成utility.getRandomNumberArray(52) 因為要利用這個函式把牌洗亂 當然這個函式當中以包括Array.from(Array(52).keys()) */
  },

  //...cards中的這三個點可以把陣列展開成個別的值，也可以把個別的值蒐集起來變成陣列。這裡代表把cards整個元素變成1個陣列
  //再利用map一個一個把陣列中的值代入條件函式中
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        // 察覺到是背面 所以要翻成正面
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index)) // 要記得 HTML 回傳的是字串，要改成數字 使用Number()
        return
      }
      // 查覺到是正面 所以要翻成背面 且要把數字和花色清除
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  },

  renderScore(score) {
    //textContent === innerText  (回傳標籤內的值而已)
    //但textContent !== innerHTML (會回傳整個包含標籤的HTML)
    document.querySelector('.score').textContent = `Score: ${score}`
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times `

  },

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')  //配對失敗時 在classList加上wrong 讓之後可以觸發CSS的動畫效果
      card.addEventListener('animationend', event => {
        event.target.classList.remove('wrong')  //每觸發完一次動畫效果 把classList的wrong去除 下一次又觸發時 才能在classList加上wrong 才能再次觸發配對失敗時的動畫效果 
      },
        {
          once: true
          //這裡只要每觸發一次addEventListener會造成瀏覽器負擔
          //增加了once: true之後 代表addEventListener是一次性的 觸發完之後就會消失 對瀏覽器較好 屬於優化
        })
    })
  },
  /* 遊戲結束面 */
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}

/* Fisher-Yates Shuffle 洗牌演算法  */
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
} /* Fisher-Yates Shuffle 洗牌演算法  */


/* Model 是集中管理資料的地方 */
const model = {
  revealedCards: [], //用來儲存之後翻開卡片的資料 一開始還沒翻開前是一個空陣列  集滿兩張牌時就要檢查配對有沒有成功，檢查完以後，這個暫存牌組就需要清空。

  isRevealedCardsMatched() {  //用來比較第一張牌和第二張牌的數字是否一樣
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,  //原始分數

  triedTimes: 0  //原始挑戰次數
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaits, //在初始狀態設定為 FirstCardAwaits，也就是「還沒翻牌」
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return  //return代表直接結束整個function 只會執行到這裡 下面不會在執行的意思 function是只這一個dispatchCardAction(card)
    }
    /* 根據不同狀態來推進遊戲  這裡我們用switch取代 if/else，讓程式碼看起來簡潔一點 */
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:  //當遊戲是第一狀態時
        view.flipCards(card)             //把卡片翻到正面(數字面)
        model.revealedCards.push(card)  //把翻到的元素內容存到revealedCards裡面 之後才能進行比對
        this.currentState = GAME_STATE.SecondCardAwaits //這時請讓遊戲變成第二狀態
        break  //break和return不同 break會跳出這個部分 但會繼續執行下方的console.log()

      case GAME_STATE.SecondCardAwaits:  //當遊戲是第一狀態時
        view.renderTriedTimes(++model.triedTimes) //每配對一次 次數+1

        view.flipCards(card)             //把卡片翻到正面(數字面)
        model.revealedCards.push(card)  //把翻到的元素內容存到revealedCards裡面 之後才能進行比對

        //console.log(model.isRevealedCardsMatched())
        if (model.isRevealedCardsMatched()) {
          //配對正確(true)
          this.currentState = GAME_STATE.CardsMatched //卡片成功時的狀態
          view.renderScore(model.score += 10)      //配對成功時加10分
          /* view.pairCard(model.revealedCards[0]) //當配對成功時 在classList加上'paired' 使卡片增加背景顏色
          view.pairCard(model.revealedCards[1])//當配對成功時 在classList加上'paired' 使卡片增加背景顏色 */
          view.pairCards(...model.revealedCards)
          model.revealedCards = [] //清空兩張牌的資料
          /* 當遊戲結束時 觸發遊戲結束畫面 */
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()  // 加在這裡
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits//回歸初始的狀態
        } else {
          //配對失敗(false)
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)//配對失敗時 觸發動畫效果
          setTimeout(this.resetCards, 1000)  //1000為毫秒 指翻牌後延遲1秒 在把牌翻回來 讓玩家能記憶當下的牌


        }
        break  //break和return不同 break會跳出這個部分 但會繼續執行下方的console.log()
    }
    console.log("current state:", this.currentState) //用來顯示目前執行到第幾階段
    console.log("revealed cards:", model.revealedCards.map(card => card.dataset.index)) //用來觀看目前取得到的卡片元素內容
  },

  // 函式
  resetCards() {
    /* view.flipCard(model.revealedCards[0]) //當配對失敗時 把牌翻第一張回來
    view.flipCard(model.revealedCards[1])//當配對失敗時 把牌翻第二張回來 */
    view.flipCards(...model.revealedCards)
    model.revealedCards = [] //清空兩張牌的資料
    controller.currentState = GAME_STATE.FirstCardAwaits//回歸初始的狀態  //這裡最容易忽略的地方是 this 在搬進 resetCards 之後要改成 controller
  }
}

controller.generateCards() // 取代 view.displayCards()

/* 先使用 querySelectorAll 來抓到所有與 .card 選擇器匹配的元素，此時會回傳一個 NodeList  再使用 forEach 來迭代回傳值，為每張卡牌加上事件監聽器： */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    /* view.flipCard(card) */
    controller.dispatchCardAction(card)
  })
})
