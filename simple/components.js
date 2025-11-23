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
