// Copyright (c) Mersive Technologies, Inc. 2023 - example provided as is -
// Please modify variables below to customize the digital signage screen

// Enter Pod admin password in podPassword string below. Example, if admin password is 12345, enter '12345'
// If no admin password is set on the Pod, leave empty inside single quotes '' as shown below.
// If podPassword does not match password set on the Pod, variables such as the Pod's IP or Screen Key will not be visible.
const podPassword = ''

// Add the file name for each image inside the img folder you would like to include as part of the backgroundArray array.
// Please ensure the image files are stored inside the img folder, enter exact file names inside single quotes ''
const backgroundArray = ['background_01.jpg','background_02.jpg','background_03.jpg']

// Replace SVG file pointed to by companyLogo with your company logo SVG. Ensure company SVG file is added in the icons folder
const companyLogo = 'company_logo.svg'

// Set the amount of time between background image changes
// Time intervals are in milliseconds. Every 1000 is equal to one second
const backgroundChangeTimer = 60000


/*
############################################################
********** DO NOT CHANGE ANYTHING BELOW THIS LINE **********
############################################################
************ Unless you are comfortable coding *************
############################################################
*/

const displayName = document.getElementById(`podName`)
const displayURL = document.getElementById(`podUrl`)
const displayScreenKey = document.getElementById(`podKey`)
const timeDisplay = document.getElementById(`time`)
const welcome = document.querySelector('.welcomeText')
const backgroundImage = document.getElementById('backgroundImage')
const comLogo = document.getElementById('companyLogo')

// The podIP should not be unique, it should either be set to '127.0.0.1' or 'localhost'
const podIP = '127.0.0.1'

comLogo.setAttribute('src', `./icons/${companyLogo}`)
backgroundImage.setAttribute('src', `./img/${backgroundArray[0]}`)

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

function getCurTime() {
  const curDate = new Date()
  const hour = curDate.getHours()
  const minute = (curDate.getMinutes() < 10 ? '0' : '') + curDate.getMinutes()
  return `${hour}:${minute}`
}

function parseCalendar(token, curPodTime) {
  let result = 'Available to book'
  const calRequest = new XMLHttpRequest()
  calRequest.open('GET', `https://${podIP}:5443/v2/calendar`, false)
  calRequest.setRequestHeader('Authorization', `Bearer ${token}`)
  calRequest.setRequestHeader('content-type', 'application/json')
  calRequest.send()
  if (calRequest.status === 200) {
    const calendarData = JSON.parse(calRequest.response)
    const calArray = calendarData.meetings
    calArray.forEach(event => {
      const curTime = parseInt(curPodTime)
      const start = parseInt(event.start_time) * 1000
      const end = parseInt(event.end_time) * 1000
      if (curTime >= start && curTime <= end) {
        result = event.organizer ? `Welcome, ${event.organizer}` : 'Welcome'
      }
    })
    return result
  }
}

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

function changeBackground() {
  const curBackground = backgroundImage.getAttribute('src').split('/').at(-1)
  const curIndex = backgroundArray.indexOf(curBackground)
  if ( curIndex !== backgroundArray.length - 1 ) {
    backgroundImage.setAttribute('src', `./img/${backgroundArray.at(curIndex + 1)}`)
  } else {
    backgroundImage.setAttribute('src', `./img/${backgroundArray.at(0)}`)
  }
  setTimeout(changeBackground, backgroundChangeTimer)
}
if(backgroundArray.length > 1){
  setTimeout(changeBackground, backgroundChangeTimer)
}

function getPodData() {
  const token = getToken()
  const timeStamp = getCurTime()
  timeDisplay.innerText = timeStamp
  const request = new XMLHttpRequest()
  
  request.open('GET', `https://${podIP}:5443/v2/config` , false)
  request.setRequestHeader('Authorization', `Bearer ${token}`)
  request.setRequestHeader('content-type', 'application/json')
  request.send()

  const podData = JSON.parse(request.response)
  const podTime = new Date(podData.display.clock.current_time).getTime()
  const podName = podData.display.name
  const calendarEnabled = podData.display.calendar.enabled

  fetch(`https://${podIP}/api/config?password=${podPassword}`)
    .then(response => response.json())
    .then(data => {
      const displayURLText = data.m_displayInformation.m_ipv4
      displayURL.innerText = displayURLText
	  const ScreenKeyText = data.m_authenticationCuration.sessionKey
      displayScreenKey.innerText = ScreenKeyText
    })
    .catch(e => {
      console.log(e)
  })

  displayName.innerText = podName
  
  if (calendarEnabled) {
    welcomeMessage = parseCalendar(token, podTime)
    welcome.innerText = welcomeMessage
  } else {
    welcome.innerText = null
  }
  setTimeout(getPodData, 15000)
}
getPodData()