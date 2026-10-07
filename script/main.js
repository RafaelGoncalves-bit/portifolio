// =====================================================
// CONFIGURAÇÕES
// =====================================================

const GITHUB_USER = "RafaelGoncalves-bit";

const MAX_PROJECTS = 6;

// =====================================================
// ANO DO FOOTER
// =====================================================

const anoElemento = document.getElementById("ano");

if (anoElemento) {
  anoElemento.textContent = new Date().getFullYear();
}

// =====================================================
// NAVBAR AO ROLAR A PÁGINA
// =====================================================

const navbar = document.querySelector(".navbar");

function atualizarNavbar() {
  if (!navbar) {
    return;
  }

  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", atualizarNavbar);

atualizarNavbar();

// =====================================================
// MARCAR ITEM ATIVO DA NAVBAR
// =====================================================

const sections = document.querySelectorAll("section[id]");

const navLinks = document.querySelectorAll(".nav-link");

function atualizarMenuAtivo() {
  let secaoAtual = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 180;

    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      secaoAtual = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (href === `#${secaoAtual}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", atualizarMenuAtivo);

atualizarMenuAtivo();

// =====================================================
// FECHAR MENU MOBILE AO CLICAR
// =====================================================

const navbarMenu = document.getElementById("navbarMenu");

document.querySelectorAll(".navbar-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (!navbarMenu) {
      return;
    }

    if (navbarMenu.classList.contains("show")) {
      const collapse = bootstrap.Collapse.getOrCreateInstance(navbarMenu);

      collapse.hide();
    }
  });
});

// =====================================================
// ESCAPAR HTML
// =====================================================

function escapeHtml(valor) {
  if (!valor) {
    return "";
  }

  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =====================================================
// FORMATAR NOME DO REPOSITÓRIO
// =====================================================

function formatarNomeRepositorio(nome) {
  if (!nome) {
    return "Projeto";
  }

  return nome
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letra) => letra.toUpperCase());
}

// =====================================================
// ÍCONE POR LINGUAGEM
// =====================================================

function getIconeProjeto(linguagem) {
  const linguagemNormalizada = linguagem?.toLowerCase() || "";

  const icones = {
    javascript: "fa-brands fa-js",

    typescript: "fa-solid fa-code",

    python: "fa-brands fa-python",

    html: "fa-brands fa-html5",

    css: "fa-brands fa-css3-alt",

    java: "fa-brands fa-java",

    php: "fa-brands fa-php",

    shell: "fa-solid fa-terminal",
  };

  return icones[linguagemNormalizada] || "fa-solid fa-code";
}

// =====================================================
// BUSCAR PROJETOS DO GITHUB
// =====================================================

async function carregarProjetosGitHub() {
  const container = document.getElementById("github-projects");

  if (!container) {
    return;
  }

  try {
    const url =
      `https://api.github.com/users/${GITHUB_USER}/repos` +
      `?sort=updated&direction=desc&per_page=100`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`GitHub respondeu com status ${response.status}`);
    }

    const repositorios = await response.json();

    const repositoriosValidos = repositorios
      .filter((repo) => {
        return !repo.fork && !repo.archived;
      })
      .sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      })
      .slice(0, MAX_PROJECTS);

    if (repositoriosValidos.length === 0) {
      container.innerHTML = `

                <div class="col-12">

                    <p class="text-center text-secondary">

                        Nenhum projeto público foi encontrado.

                    </p>

                </div>

            `;

      return;
    }

    container.innerHTML = repositoriosValidos.map(criarCardProjeto).join("");
  } catch (erro) {
    console.error("Erro ao carregar projetos do GitHub:", erro);

    container.innerHTML = `

            <div class="col-12">

                <div class="text-center">

                    <p class="text-secondary mb-3">

                        Não foi possível carregar os projetos
                        automaticamente.

                    </p>

                    <a
                        href="https://github.com/${GITHUB_USER}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-outline-custom"
                    >

                        <i class="fa-brands fa-github"></i>

                        Abrir GitHub

                    </a>

                </div>

            </div>

        `;
  }
}

// =====================================================
// CRIAR CARD DO PROJETO
// =====================================================

function criarCardProjeto(repo) {
  const nome = escapeHtml(formatarNomeRepositorio(repo.name));

  const descricao = escapeHtml(
    repo.description || "Projeto desenvolvido e publicado no GitHub.",
  );

  const linguagem = escapeHtml(repo.language || "Projeto");

  const url = escapeHtml(repo.html_url);

  const estrelas = Number(repo.stargazers_count || 0);

  const forks = Number(repo.forks_count || 0);

  const icone = getIconeProjeto(repo.language);

  return `

        <div class="col-lg-4 col-md-6">

            <article class="project-card">

                <div class="project-header">

                    <div class="project-icon">

                        <i class="${icone}"></i>

                    </div>


                    <a
                        href="${url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="github-icon"
                        aria-label="Abrir projeto no GitHub"
                    >

                        <i class="fa-brands fa-github"></i>

                    </a>

                </div>


                <h4>
                    ${nome}
                </h4>


                <p>
                    ${descricao}
                </p>


                <div class="project-tech">

                    <span>
                        ${linguagem}
                    </span>


                    <span>

                        <i class="fa-regular fa-star"></i>

                        ${estrelas}

                    </span>


                    <span>

                        <i class="fa-solid fa-code-fork"></i>

                        ${forks}

                    </span>

                </div>


                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="project-link"
                >

                    Ver repositório

                    <i class="fa-solid fa-arrow-right"></i>

                </a>

            </article>

        </div>

    `;
}

// =====================================================
// INICIAR
// =====================================================

carregarProjetosGitHub();
