// Copyright (c) Mersive Technologies, Inc. 2023 - example provided as is -
// Please modify variables below to customize the digital signage screen

// Enter Pod admin password in podPassword string below. Example, if admin password is 12345, enter '12345'
// If no admin password is set on the Pod, leave empty inside single quotes '' as shown below.
// If podPassword does not match password set on the Pod, variables such as the Pod's IP or Screen Key will not be visible.
const podPassword = ''

// Change setName variable to modify the name displayed in the upper right corner of the display.
const setName = 'Summerfield School'

// feedArray is an array that controls the messages displayed in the feed on the left side of the screen.
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

// tickerArray is the array of items that scrolls along the bottom of the display.
// This array supports as many items as you would like to add, place each in double quotes separated by a comma
// The more itemps you add, the longer it takes to scroll through and restart
const tickerArray =[
  "School News: Summerfield will be closed on 7 September",
  "Make sure to check in when arriving to pick up your child",
  "New Student Orientation is today at 8:00 a.m.",
  "Use your browser or the Mersive Solstice app to share to this display"
]


/*
############################################################
********** DO NOT CHANGE ANYTHING BELOW THIS LINE **********
############################################################
************ Unless you are comfortable coding *************
############################################################
*/

// Time intervals are in milliseconds. Every 1000 is equal to one second

const displayURL = document.getElementById(`podUrl`)
const displayScreenKey = document.getElementById(`podKey`)
const listContainer = document.getElementById('listContainer')
const leftSide = listContainer.getBoundingClientRect().left
const scrollingList = document.getElementById('scrollingList')
const companyName = document.getElementById('companyName')
let currentLeftVal = 0
companyName.innerText = setName

// The podIP should not be unique, it should either be set to '127.0.0.1' or 'localhost'
const podIP = '127.0.0.1'

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

function getToken() {
  const tokenRequest = new XMLHttpRequest()
  tokenRequest.open('POST', `https://${podIP}:5443/v2/token`, false)
  tokenRequest.send(`grant_type=password&username=admin&password=${podPassword}`)
  if (tokenRequest.status === 200) {
    let tokenReq = JSON.parse(tokenRequest.responseText)
    return tokenReq.access_token
  } else {
    return setTimeout(getToken, 5000)
  }
}

function addTickerItems() {
  tickerArray.forEach(ticker => {
    let item = document.createElement('li')
    item.classList.add('list_item')
    item.innerText = ticker
    scrollingList.appendChild(item)
  })
}
addTickerItems()

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
        podKey = data.m_authenticationCuration.sessionKey
        document.getElementById('sessionKey').innerHTML = podKey || 'next'
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
    const date = new Date().toLocaleDateString('en-US', dateOptions)
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

function getPodData() {
  const token = getToken()
  const request = new XMLHttpRequest()
  
  request.open('GET', `https://${podIP}:5443/v2/config` , false)
  request.setRequestHeader('Authorization', `Bearer ${token}`)
  request.setRequestHeader('content-type', 'application/json')
  request.send()

  const podData = JSON.parse(request.response)
  const podName = podData.display.name

  fetch(`https://${podIP}/api/config?password=${podPassword}`)
    .then(response => response.json())
    .then(data => {
      const displayURLText = data.m_displayInformation.m_ipv4
	  const ScreenKeyText = data.m_authenticationCuration.sessionKey
	  displayURL.innerText = displayURLText
      displayScreenKey.innerText = ScreenKeyText
    })
    .catch(e => {
      console.log(e)
    }) 
  setTimeout(getPodData, 15000)
}
getPodData()