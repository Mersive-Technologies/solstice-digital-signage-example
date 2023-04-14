// Copyright (c) Mersive Technologies, Inc. 20203 - example provided as is
// Please modify variables below to customize the digital signage screen
// Enter pod password string below. If no admin password on the pod, leave empty string as is
const podPassword = ''

const backgroundVideo = ['flower.webm']

// Replace this SVG file name with your company logo SVG. Please ensure company SVG is in the icons folder
const companyLogo = 'company_logo.svg'


/*
############################################################
********** DO NOT CHANGE ANYTHING BELOW THIS LINE **********
############################################################
************ Unless you know what you are doing ************
############################################################
*/
const displayName = document.getElementById(`podName`)
const comLogo = document.getElementById('companyLogo')
const displayURL = document.getElementById(`podUrl`)
const timeDisplay = document.getElementById(`time`)
const welcome = document.querySelector('.welcomeText')
const podIP = 'localhost'

comLogo.setAttribute('src', `./icons/${companyLogo}`)

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

function getPodData() {
  // request pod config
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