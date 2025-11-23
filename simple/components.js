/**
 * Component: SiteHeader
 * About: This is my simple site header...
 */
class SiteHeader extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const sitename = this.getAttribute("sitename") || "Default Site Name";
    const name = this.getAttribute("name") || "Default Name";
    const email = this.getAttribute("email") || "default@email.com";

    this.innerHTML = `
    <h1>${sitename}</h1>
    <h2>${name}</h1>
    <h3>${email}</h2>
    `;
  }
}
customElements.define("site-header", SiteHeader);

/**
 * Component: SiteMenu
 * About: I want to put a site menu on each page as well!
 */
class SiteMenu extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const active = this.getAttribute("active");

    const menuItems = [
      { name: "home", label: "Home", href: "./index.html" },
      { name: "about", label: "About", href: "./about.html" },
      { name: "resume", label: "Resume", href: "./resume.html" },
      {
        name: "sideprojects",
        label: "Side Projects",
        href: "./sideprojects.html",
      },
      { name: "writing", label: "Writing", href: "./writing.html" },
    ];
    this.setAttribute("class", "row");
    menuItems.forEach((i) => {
      const m = document.createElement("a");
      m.setAttribute("href", i.href);
      m.textContent = i.label;
      m.setAttribute("class", active == i.name ? "button active" : "button");
      this.appendChild(m);
    });
  }
}
customElements.define("site-menu", SiteMenu);

/**
 * Component: WritingsRenderer
 * About: Let's render all of our articles.
 */
class WritingsRenderer extends HTMLElement {
  constructor() {
    super();
    console.log("WRITINGS RENDERER!");
  }

  // Render our article
  // TODO: Surely this can be done via templates?
  renderArticle(rawArticle) {
    const article = document.createElement("div");
    const articleContent = document.createElement("p");
    rawArticle.split(/\r?\n/).forEach((line) => {
      if (line.startsWith("Title:")) {
        const title = document.createElement("h1");
        title.textContent = line;
        article.appendChild(title);
      } else if (line.startsWith("Date:")) {
        const date = document.createElement("h2");
        date.textContent = line;
        article.appendChild(date);
      } else {
        articleContent.textContent += line;
      }
    });
    article.appendChild(articleContent);
    return article;
  }

  connectedCallback() {
    console.log("Getting articles...");
    fetch("./writings.md")
      .then((resp) => resp.text())
      .then((text) => {
        text.split("---").forEach((article) => {
          this.appendChild(this.renderArticle(article));
        });
      })
      .catch((error) => {
        console.log("Problem fetching articles.");
        this.textContent = error;
      });
  }
}
customElements.define("writings-renderer", WritingsRenderer);
