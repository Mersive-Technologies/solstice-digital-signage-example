// Change this variable to modify the name displayed in the upper right corner of the display
const setName = 'Summerfield School'
// Below is an array that controls the messages displayed in the feed on the left side of the screen.
// Modify the right side of each key value par to change what is displayed on the screen.
// Currently, the page is designed to show three items.
const feedArray = [
  {
    'date':'Today',
    'time':'8:00 a.m.',
    'location':'Canteen',
    'title':'New Student Orientation: Years K-5',
},{
    'date':'WEDNESDAY, 2 OCTOBER',
    'time':'4:00 p.m.',
    'location':'Westridge Hall',
    'title':"Parent's Night: Years K-2",
},{
    'date':'MONDAY, 16 NOVEMBER',
    'time':'6:00 p.m.',
    'location':"Your Student's classroom",
    'title':'Open House: Years 4-5',
}
]
// Below is the array of items that scroll along the lower left corner of the display.
// This supports as many items as you want to add, just remember, the more you add, the longer it takes to scroll through and restart
const tickerArray =[
  "School News: Summerfield will be closed on 7 September",
  "Make sure to check in when arriving to pick up your child",
  "New Student Orientation is today at 8:00 a.m.",
  "Use the Solstice app to share to this display"
]
/*
############################################################
********** DO NOT CHANGE ANYTHING BELOW THIS LINE **********
############################################################
************ Unless you know what you are doing ************
############################################################
*/
const podIP = 'localhost'
const timeOptions = {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
}
const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
}

const listContainer = document.getElementById('listContainer')
const leftSide = listContainer.getBoundingClientRect().left
const scrollingList = document.getElementById('scrollingList')
const companyName = document.getElementById('companyName')
let currentLeftVal = 0
companyName.innerText = setName

function addTickerItems() {
  tickerArray.forEach(ticker => {
    let item = document.createElement('li')
    item.classList.add('list_item')
    item.innerText = ticker
    scrollingList.appendChild(item)
  })
}
addTickerItems()

const items = [...document.getElementsByClassName('list_item')]

function animationLoop() {
    const firstListItem = scrollingList.querySelector('.list_item:first-child')
    let rightSideOfFirstItem = Math.round(firstListItem.getBoundingClientRect().right)
    if(rightSideOfFirstItem === leftSide){
        currentLeftVal = -1
        scrollingList.appendChild(firstListItem)
    }
    scrollingList.style.marginLeft = `${currentLeftVal}px`
    currentLeftVal--
}
setInterval(animationLoop, 20)
function refreshKey() {
    fetch(`https://${podIP}/api/config`)
      .then((response) => response.json())
      .then((data) => {
        key = data?.m_authenticationCuration?.sessionKey
        document.getElementById('sessionKey').innerHTML = key || 'next'
      })
      .catch((e) => {
        console.log('something went wrong')
      })
  }
  setInterval(refreshKey, 3000)

  function refreshTime() {
    fetch(`https://${podIP}/api/config`)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
      })
      .catch((e) => {
        console.log('something went wrong')
      })
    const date = new Date().toLocaleDateString('en-GB', dateOptions)
    document.getElementById('date').innerHTML = date
    const time = new Date().toLocaleTimeString('en-GB', timeOptions)
    document.getElementById('time').innerHTML = time
  }
  setInterval(refreshTime, 3000)

function generateFeed() {
    for(let i=0; i < feedArray.length; i++) {
        divName = `feedItem${i}`
        newDiv = document.createElement(divName)
        newDiv.setAttribute('id', divName)
        newDiv.innerHTML =`
        <div class="feedItem">
        <p class="date">${feedArray[i].date}</p>
        <div class="detailBox">
          <div class="bar"></div>
          <div class="feedDetail">
            <p class="time">${feedArray[i].time}</p>
            <p class="title">${feedArray[i].title}</p>
            <p class="location">${feedArray[i].location}</p>
          </div>
        </div>
      </div>
        `
        document.querySelector('.leftFeed').appendChild(newDiv)
    }
}
generateFeed()
