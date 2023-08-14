const API_URL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const formulario = document.getElementById('formulario')
const pesquisa = document.getElementById('pesquisa')

formulario.addEventListener('submit', (e) => {
    e.preventDefault()

    const nomeUsuario = pesquisa.value

    if(nomeUsuario) {
        getUsuario(nomeUsuario)

        pesquisa.value = ''
    }
})

async function getUsuario(nomeUsuario) {
    try {
        const { data } = await axios(API_URL + nomeUsuario)

        criarCardUsuario(data)
        getRepositorios(nomeUsuario)
    } catch(err) {
        if(err.response.status == 404) {
            criarCardErro('Não há um usuário com este nome!')
        }
    }
}

function criarCardUsuario(usuario) {
    const nomeUsuario = usuario.name || usuario.login
    const bioUsuario = usuario.bio ? `<p>${usuario.bio}</p>` : ''
    const cardHtml = `
    <div class="card">
    <div>
      <img src="${usuario.avatar_url}" alt="${usuario.name}" class="avatar">
    </div>
    <div class="info-usuario">
      <h2>${nomeUsuario}</h2>
      ${bioUsuario}
      <ul>
        <li>${usuario.followers} <strong>Seguidores</strong></li>
        <li>${usuario.following} <strong>Seguindo</strong></li>
        <li>${usuario.public_repos} <strong>Repositórios públicos</strong></li>
      </ul>

      <div id="repositorios"></div>
    </div>
  </div>
    `
    main.innerHTML = cardHtml
    
}

async function getRepositorios(nomeUsuario) {
    try {
        const { data } = await axios(API_URL + nomeUsuario + '/repos?sort=created')

        addRepositoriosParaCard(data)
    } catch(err) {
        createErrorCard('Houve um erro ao obter os repositórios!')
    }
}

function addRepositoriosParaCard(repositorios) {
    const reposEl = document.getElementById('repositorios')

    repositorios
        .slice(0, 5)
        .forEach(repositorio => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repositorio')
            repoEl.href = repositorio.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repositorio.name

            reposEl.appendChild(repoEl)
        })
}

function criarCardErro(msg) {
    const cardHtml = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHtml
}

