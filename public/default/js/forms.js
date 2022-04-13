const posts = document.querySelectorAll('form button[type=submit]')
if(posts)
  for(let i = 0; i < posts.length; i++) posts[i].innerHTML += '<span class="post-response"><span>'

const copy = document.querySelectorAll('.copy')
for(let i = 0; i < copy.length; i++) {
  copy[i].addEventListener('click', (event) => {
    const copy = event.target
    const link = copy.getAttribute('data-link')
    navigator.clipboard.writeText(link)

    const alert = copy.querySelector('.alert')
    alert.style.opacity = 1
    alert.style.visibility = 'visible'
    setTimeout(() => {
      alert.style.opacity = 0
      alert.style.visibility = 'hidden'
    }, 1000)
  })
}

const forms = document.querySelectorAll('form')
for(let form of forms) {
  form.addEventListener('submit', async(event) => {
    event.preventDefault()

    const loading = form.querySelector('.form-loading')
    if(!loading) event.submitter.innerHTML += '<img class="form-loading" src="/default/img/spinner.gif" alt="Carregando"/>'

    const data = getData(form)

    await fetch(form.action, {
        method: form.method,
        headers: data.header,
        body: data.content
      })
      .then(async(res) => {
        if(res.redirected) return window.location.href = res.url
        const postResponse = event.submitter.querySelector('.post-response')
        const response = await res.text()
        showResponse(postResponse, response)
      })

    form.querySelector('.form-loading').remove()
  })
}

function getData(form) {
  const body = getBody(form)
  if(form.enctype == 'multipart/form-data') {
    return {
      header: { Accept: 'application/json, text/plain, */*' },
      content: getFiles(form, body)
    }
  } else {
    return {
      header: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      content: JSON.stringify(body)
    }
  }
}

function getBody(form) {
  const inputs = form.querySelectorAll('input')
  const selects = form.querySelectorAll('select')
  const textareas = form.querySelectorAll('textarea')
  
  const urlSearch = new URLSearchParams(window.location.search)
  const author = urlSearch.get('name')
  const room = urlSearch.get('room')

  const body = { author, room, createdAt: new Date() }
  for(let input of inputs) {
    const value = input.type == 'checkbox' ? input.checked : input.value
    const data = addData(body[input.name], value)
    body[input.name] = data
  }

  for(let select of selects) {
    const data = addData(body[select.name], select.value)
    body[select.name] = data
  }

  for(let textarea of textareas) {
    if(textarea.name == 'g-recaptcha-response') textarea.name = 'captcha'
    body[textarea.name] = textarea.value
  }
  return body
}

function addData(bodyValue, value) {
  if(!bodyValue) return value
  if(!Array.isArray(bodyValue)) return [bodyValue, value]
  return [...bodyValue, value]
}

function getFiles(form, body) {
  const fd = new FormData()
  const inputFiles = form.querySelectorAll('input[type=file]')

  for(let input of inputFiles) {
    for(let i = 0; i < input.files.length; i++) {
      fd.append(input.name, input.files[i])
    }
  }

  for(let [key, value] of Object.entries(body)) {
    fd.append(key, value)
  }

  return fd
}

function showResponse(target, response) {
  target.textContent = response
  target.classList.add('show')
  setTimeout(() => target.classList.remove('show'), 2000)
}