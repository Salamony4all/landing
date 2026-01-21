const cards = [
  {
    id: "exp-1",
    name: "Experience Studio",
    subtitle: "Automation flows and experience mapping.",
    link: "https://example.com",
    thumbnailUrl: "",
  },
  {
    id: "exp-2",
    name: "Product Canvas",
    subtitle: "Prototype, validate, and align on delivery.",
    link: "https://example.com/product",
    thumbnailUrl: "",
  },
  {
    id: "exp-3",
    name: "Analytics Hub",
    subtitle: "Insights, telemetry, and reporting dashboards.",
    link: "https://example.com/analytics",
    thumbnailUrl: "",
  },
];

const grid = document.getElementById("cards-grid");
const list = document.getElementById("cards-list");
const drawer = document.getElementById("settings-drawer");
const backdrop = document.getElementById("backdrop");
const openBtn = document.getElementById("open-settings");
const closeBtn = document.getElementById("close-settings");
const form = document.getElementById("card-form");
const resetBtn = document.getElementById("reset-form");
const addCardBtn = document.getElementById("add-card-btn");
const settingsBody = document.querySelector(".settings-body");
const cardEditor = document.getElementById("card-editor");
const closeCardEditorBtn = document.getElementById("close-card-editor");

const heroTitle = document.getElementById("hero-title");
const heroSubtitle = document.getElementById("hero-subtitle");
const pageTitleInput = document.getElementById("page-title");
const pageDescriptionInput = document.getElementById("page-description");

const idInput = document.getElementById("card-id");
const nameInput = document.getElementById("card-name");
const subtitleInput = document.getElementById("card-subtitle");
const linkInput = document.getElementById("card-link");
const thumbInput = document.getElementById("card-thumb");

const thumbnailService = "https://image.thum.io/get/width/900/";
const placeholderThumb =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f5f5f5"/>
          <stop offset="100%" stop-color="#e1e1e1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Segoe UI, sans-serif" font-size="20" fill="#606368">
        Preview unavailable
      </text>
    </svg>`
  );

const buildThumbUrl = (card) => {
  if (card.thumbnailUrl) {
    return card.thumbnailUrl;
  }
  return `${thumbnailService}${card.link}`;
};

const renderCards = () => {
  grid.innerHTML = "";
  cards.forEach((card) => {
    const cardEl = document.createElement("article");
    cardEl.className = "card";

    const thumb = document.createElement("img");
    thumb.className = "card-thumb";
    thumb.alt = `${card.name} preview`;
    thumb.src = buildThumbUrl(card);
    thumb.onerror = () => {
      thumb.src = placeholderThumb;
    };

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = card.name;

    const subtitle = document.createElement("div");
    subtitle.className = "card-subtitle";
    subtitle.textContent = card.subtitle || "Automation experience overview.";

    const link = document.createElement("div");
    link.className = "card-link";
    link.textContent = card.link;

    const action = document.createElement("a");
    action.className = "card-action";
    action.href = card.link;
    action.target = "_blank";
    action.rel = "noreferrer";
    action.innerHTML = `Open landing <span>→</span>`;

    body.appendChild(title);
    body.appendChild(subtitle);
    body.appendChild(link);
    body.appendChild(action);

    cardEl.appendChild(thumb);
    cardEl.appendChild(body);
    grid.appendChild(cardEl);
  });
};

const renderList = () => {
  list.innerHTML = "";
  cards.forEach((card) => {
    const item = document.createElement("div");
    item.className = "settings-item";

    const info = document.createElement("div");
    info.className = "settings-item-info";

    const name = document.createElement("strong");
    name.textContent = card.name;

    const subtitle = document.createElement("small");
    subtitle.textContent = card.subtitle || "No subtitle provided.";

    const link = document.createElement("span");
    link.textContent = card.link;

    const actions = document.createElement("div");
    actions.className = "settings-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.innerHTML = "<span aria-hidden=\"true\">✎</span> Edit";
    editBtn.addEventListener("click", () => populateForm(card));

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.innerHTML = "<span aria-hidden=\"true\">🗑</span> Remove";
    removeBtn.addEventListener("click", () => removeCard(card.id));

    info.appendChild(name);
    info.appendChild(subtitle);
    info.appendChild(link);

    item.appendChild(info);
    actions.appendChild(editBtn);
    actions.appendChild(removeBtn);
    item.appendChild(actions);
    list.appendChild(item);
  });
};

const resetForm = () => {
  idInput.value = "";
  nameInput.value = "";
  subtitleInput.value = "";
  linkInput.value = "";
  thumbInput.value = "";
};

const showCardEditor = () => {
  cardEditor?.classList.remove("is-hidden");
};

const hideCardEditor = () => {
  cardEditor?.classList.add("is-hidden");
};

const populateForm = (card) => {
  showCardEditor();
  idInput.value = card.id;
  nameInput.value = card.name;
  subtitleInput.value = card.subtitle || "";
  linkInput.value = card.link;
  thumbInput.value = card.thumbnailUrl || "";
};

const upsertCard = (payload) => {
  const index = cards.findIndex((card) => card.id === payload.id);
  if (index === -1) {
    cards.unshift(payload);
  } else {
    cards[index] = payload;
  }
  renderCards();
  renderList();
};

const removeCard = (id) => {
  const index = cards.findIndex((card) => card.id === id);
  if (index >= 0) {
    cards.splice(index, 1);
  }
  renderCards();
  renderList();
};

const openDrawer = () => {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.classList.add("show");
};

const closeDrawer = () => {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.classList.remove("show");
};

openBtn.addEventListener("click", openDrawer);
closeBtn.addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);
resetBtn.addEventListener("click", resetForm);
closeCardEditorBtn?.addEventListener("click", () => {
  hideCardEditor();
  resetForm();
});
addCardBtn.addEventListener("click", () => {
  showCardEditor();
  resetForm();
  if (settingsBody) {
    settingsBody.scrollTo({ top: 0, behavior: "smooth" });
  }
  nameInput.focus();
});

pageTitleInput.addEventListener("input", () => {
  heroTitle.textContent =
    pageTitleInput.value.trim() || "Experience my Automated workflow Apps";
});

pageDescriptionInput.addEventListener("input", () => {
  heroSubtitle.textContent =
    pageDescriptionInput.value.trim() ||
    "A curated launchpad of automated workflow apps built to streamline your operations, insights, and delivery.";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const id = idInput.value || `exp-${Date.now()}`;
  upsertCard({
    id,
    name: nameInput.value.trim(),
    subtitle: subtitleInput.value.trim(),
    link: linkInput.value.trim(),
    thumbnailUrl: thumbInput.value.trim(),
  });
  resetForm();
});

renderCards();
renderList();
