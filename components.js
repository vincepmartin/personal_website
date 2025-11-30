/**
 * Component: SiteHeader
 * About: This is my simple site header...
 */
class SiteHeader extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const title = this.getAttribute("title") || "Default Title";
    const subTitle = this.getAttribute("subtitle") || "Default Subtitle";

    const titleEl = document.createElement("div");
    titleEl.setAttribute("class", "title");
    titleEl.innerText = title;
    this.appendChild(titleEl);

    const subTitleEl = document.createElement("div");
    subTitleEl.setAttribute("class", "subtitle");
    subTitleEl.innerText = subTitle;
    this.appendChild(subTitleEl);

    this.setAttribute("class", "center header");
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
      { name: "resume", label: "Resume", href: "./resume.html" },
      // {
      //   name: "sideprojects",
      //   label: "Side Projects",
      //   href: "./sideprojects.html",
      // },
      { name: "writing", label: "Writing", href: "./writing.html" },
    ];
    this.setAttribute("class", "menu center");
    menuItems.forEach((link) => {
      const m = document.createElement("a");
      m.setAttribute("href", link.href);
      m.textContent = active === link.name ? `[${link.label}]` : link.label;
      m.setAttribute("class", "button");
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

  /**
   * Takes raw markdown and converts its to very basic
   * HTML for rendering.  Can handle meta data like Title:
   * Date: and also render text as <p> and images as <img>.
   */
  renderArticle(rawArticle) {
    const article = document.createElement("div");
    article.setAttribute("class", "breathe");
    let articleContent = document.createElement("p");

    // Handle content types.
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

    // This is maybe a bit insane and I'm sure I will refactor it at some point
    // to store my entries in different files or something like
    // ./writings/<title>.md or something.
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
