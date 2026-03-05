// ===== 작품 데이터 =====
// 링크/소개/태그는 네가 아는 만큼만 채우면 됨. (모르면 비워도 정상 동작)
const WORKS = [
  {
    id: "mansin-nohae",
    title: "만신 노해",
    oneLine: "한 줄 소개를 여기에 적어주세요.",
    description: "작품 소개를 2~4문장으로 적어주세요. (줄거리/매력포인트/톤)",
    status: "작품",
    year: "",
    genre: [],
    tags: ["웹툰"],
    platform: [
      // { label: "연재처", url: "https://..." }
    ]
  },
  {
    id: "joseon-wander-yasa",
    title: "조선방랑야사",
    oneLine: "한 줄 소개를 여기에 적어주세요.",
    description: "작품 소개를 2~4문장으로 적어주세요.",
    status: "작품",
    year: "",
    genre: [],
    tags: ["웹툰"],
    platform: []
  },
  {
    id: "pool-in-the-pool",
    title: "풀 인더 풀",
    oneLine: "한 줄 소개를 여기에 적어주세요.",
    description: "작품 소개를 2~4문장으로 적어주세요.",
    status: "작품",
    year: "",
    genre: [],
    tags: ["웹툰"],
    platform: []
  },
  {
    id: "sansinbu",
    title: "산신부",
    oneLine: "한 줄 소개를 여기에 적어주세요.",
    description: "작품 소개를 2~4문장으로 적어주세요.",
    status: "작품",
    year: "",
    genre: [],
    tags: ["웹툰"],
    platform: []
  },
  {
    id: "disk-solution",
    title: "디스크 솔루션",
    oneLine: "한 줄 소개를 여기에 적어주세요.",
    description: "작품 소개를 2~4문장으로 적어주세요.",
    status: "작품",
    year: "",
    genre: [],
    tags: ["웹툰"],
    platform: []
  },
  {
    id: "hosiil",
    title: "호시일",
    oneLine: "한 줄 소개를 여기에 적어주세요.",
    description: "작품 소개를 2~4문장으로 적어주세요.",
    status: "작품",
    year: "",
    genre: [],
    tags: ["웹툰"],
    platform: []
  },
  {
    id: "pokju-guiding",
    title: "폭주가이딩",
    oneLine: "한 줄 소개를 여기에 적어주세요.",
    description: "작품 소개를 2~4문장으로 적어주세요.",
    status: "작품",
    year: "",
    genre: [],
    tags: ["웹툰"],
    platform: []
  }
];

// ===== DOM =====
const grid = document.getElementById("worksGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const tagChips = document.getElementById("tagChips");
const resetBtn = document.getElementById("resetBtn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalMeta = document.getElementById("modalMeta");
const modalActions = document.getElementById("modalActions");
const yearEl = document.getElementById("year");

// ===== 상태 =====
let activeTag = null;
let query = "";

// ===== 유틸 =====
function uniq(arr) { return [...new Set(arr)]; }
function normalize(s) { return (s || "").toString().trim().toLowerCase(); }

function inSearch(work, q) {
  const hay = [
    work.title,
    work.oneLine,
    work.description,
    work.status,
    work.year,
    ...(work.genre || []),
    ...(work.tags || []),
    ...(work.platform || []).map(p => p.label)
  ].map(normalize).join(" | ");
  return hay.includes(normalize(q));
}

function getAllTags() {
  return uniq(WORKS.flatMap(w => w.tags || [])).sort((a,b) => a.localeCompare(b, "ko"));
}

function currentFilteredWorks() {
  return WORKS.filter(w => {
    const okTag = activeTag ? (w.tags || []).includes(activeTag) : true;
    const okQuery = query ? inSearch(w, query) : true;
    return okTag && okQuery;
  });
}

// ===== 렌더 =====
function renderChips() {
  const tags = getAllTags();
  tagChips.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "chip";
  allBtn.type = "button";
  allBtn.textContent = "전체";
  allBtn.setAttribute("aria-pressed", String(activeTag === null));
  allBtn.addEventListener("click", () => {
    activeTag = null;
    renderAll();
  });
  tagChips.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = tag;
    btn.setAttribute("aria-pressed", String(activeTag === tag));
    btn.addEventListener("click", () => {
      activeTag = (activeTag === tag) ? null : tag;
      renderAll();
    });
    tagChips.appendChild(btn);
  });
}

function renderWorks() {
  const items = currentFilteredWorks();
  grid.innerHTML = "";

  items.forEach(work => {
    const el = document.createElement("article");
    el.className = "work";

    const thumb = document.createElement("div");
    thumb.className = "work__thumb";
    thumb.innerHTML = `
      <div class="work__badge">${escapeHtml(work.status || "작품")}</div>
      <div class="work__badge">${escapeHtml(work.year || "")}</div>
    `;

    const body = document.createElement("div");
    body.className = "work__body";

    const title = document.createElement("h3");
    title.className = "work__title";
    title.textContent = work.title;

    const desc = document.createElement("p");
    desc.className = "work__desc";
    desc.textContent = work.oneLine || "";

    const tags = document.createElement("div");
    tags.className = "work__tags";
    (work.tags || []).slice(0, 4).forEach(t => {
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      tags.appendChild(s);
    });

    const footer = document.createElement("div");
    footer.className = "work__footer";

    const detailBtn = document.createElement("button");
    detailBtn.className = "smallbtn";
    detailBtn.type = "button";
    detailBtn.textContent = "상세보기";
    detailBtn.addEventListener("click", () => openModal(work));

    const primaryLink = (work.platform && work.platform[0]) ? work.platform[0] : null;
    const goBtn = document.createElement("a");
    goBtn.className = "smallbtn";
    goBtn.textContent = primaryLink ? `${primaryLink.label}로 이동` : "링크 없음";
    if (primaryLink && primaryLink.url) {
      goBtn.href = primaryLink.url;
      goBtn.target = "_blank";
      goBtn.rel = "noreferrer";
    } else {
      goBtn.href = "#";
      goBtn.addEventListener("click", (e) => e.preventDefault());
      goBtn.style.opacity = ".6";
      goBtn.style.cursor = "not-allowed";
    }

    footer.appendChild(detailBtn);
    footer.appendChild(goBtn);

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(tags);
    body.appendChild(footer);

    el.appendChild(thumb);
    el.appendChild(body);

    grid.appendChild(el);
  });

  emptyState.hidden = items.length !== 0;
}

function renderAll() {
  renderChips();
  renderWorks();
}

// ===== 모달 =====
function openModal(work) {
  modalTitle.textContent = work.title;
  modalDesc.textContent = work.description || work.oneLine || "";

  modalMeta.innerHTML = "";
  const metas = [
    work.status ? `상태: ${work.status}` : null,
    work.year ? `연도: ${work.year}` : null,
    (work.genre && work.genre.length) ? `장르: ${work.genre.join(", ")}` : null
  ].filter(Boolean);

  metas.forEach(m => {
    const s = document.createElement("span");
    s.className = "meta";
    s.textContent = m;
    modalMeta.appendChild(s);
  });

  modalActions.innerHTML = "";
  (work.platform || []).forEach(p => {
    const a = document.createElement("a");
    a.className = "btn btn--ghost";
    a.textContent = p.label;
    a.href = p.url || "#";
    a.target = "_blank";
    a.rel = "noreferrer";
    modalActions.appendChild(a);
  });

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && "close" in e.target.dataset) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// ===== 검색/리셋 =====
searchInput.addEventListener("input", (e) => {
  query = e.target.value || "";
  renderWorks();
});

resetBtn.addEventListener("click", () => {
  activeTag = null;
  query = "";
  searchInput.value = "";
  renderAll();
});

// ===== escape =====
function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===== 초기 =====
yearEl.textContent = new Date().getFullYear();
renderAll();