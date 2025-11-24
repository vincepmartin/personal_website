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
  }

  createImage(line) {
    const [, alt, src] = line.match(/!\[([^\]]*)\]\(([^)]*)\)/) || [];
    const img = document.createElement("img");
    img.setAttribute("alt", alt || "Image");
    img.setAttribute("src", src || "default.jpg");
    img.setAttribute("class", "");
    return img;
  }

  renderArticle(rawArticle) {
    const article = document.createElement("div");
    let articleContent = document.createElement("p");
    rawArticle.split(/\r?\n/).forEach((line) => {
      if (line.startsWith("Title:")) {
        const title = document.createElement("h2");
        title.textContent = line.match(/Title:(.*)/)[1];
        article.appendChild(title);
      } else if (line.startsWith("Date:")) {
        const date = document.createElement("h3");
        date.textContent = line.match(/Date:(.*)/)[1];
        article.appendChild(date);
      } else if (line.startsWith("![")) {
        const image = this.createImage(line);
        article.appendChild(articleContent);
        articleContent = article.appendChild(image);
        articleContent = document.createElement("p");
        article.appendChild(image);
      } else {
        articleContent.textContent += line;
      }
    });
    article.appendChild(articleContent);
    return article;
  }

  connectedCallback() {
    const src = this.getAttribute("src") || "";
    if (src === "") {
      this.setAttribute("style", "color: red");
      this.textContent = "Error rendering article!";
      return;
    }

    fetch("./writings.md")
      .then((resp) => resp.text())
      .then((text) => {
        let articles = [];
        text.split("---").forEach((article) => {
          articles.push(this.renderArticle(article));
        });
        return articles;
      })
      .then((articles) => {
        articles.toReversed().forEach((a) => {
          this.appendChild(a);
        });
      })
      .catch((error) => {
        this.textContent = error;
      });
  }
}
customElements.define("writings-renderer", WritingsRenderer);
