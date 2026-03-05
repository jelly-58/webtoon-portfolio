// ===== 작품 데이터 (너는 여기만 채우면 됨) =====
const WORKS = [
  { title: "만신 노해", status: "작품", year: "", tags: ["웹툰"], oneLine: "한 줄 소개", linkLabel: "", linkUrl: "" },
  { title: "조선방랑야사", status: "작품", year: "", tags: ["웹툰"], oneLine: "한 줄 소개", linkLabel: "", linkUrl: "" },
  { title: "풀 인더 풀", status: "작품", year: "", tags: ["웹툰"], oneLine: "한 줄 소개", linkLabel: "", linkUrl: "" },
  { title: "산신부", status: "작품", year: "", tags: ["웹툰"], oneLine: "한 줄 소개", linkLabel: "", linkUrl: "" },
  { title: "디스크 솔루션", status: "작품", year: "", tags: ["웹툰"], oneLine: "한 줄 소개", linkLabel: "", linkUrl: "" },
  { title: "호시일", status: "작품", year: "", tags: ["웹툰"], oneLine: "한 줄 소개", linkLabel: "", linkUrl: "" },
  { title: "폭주가이딩", status: "작품", year: "", tags: ["웹툰"], oneLine: "한 줄 소개", linkLabel: "", linkUrl: "" },
];

const grid = document.getElementById("worksGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const tagChips = document.getElementById("tagChips");
const resetBtn = document.getElementById("resetBtn");
const yearEl = document.getElementById("year");

let activeTag = null;
let query = "";

function uniq(arr){ return [...new Set(arr)]; }
function normalize(s){ return (s || "").toString().trim().toLowerCase(); }

function getAllTags(){
  return uniq(WORKS.flatMap(w => w.tags || [])).sort((a,b)=>a.localeCompare(b, "ko"));
}

function inSearch(work, q){
  const hay = [work.title, work.oneLine, ...(work.tags||[])].map(normalize).join(" | ");
  return hay.includes(normalize(q));
}

function currentFilteredWorks(){
  return WORKS.filter(w=>{
    const okTag = activeTag ? (w.tags||[]).includes(activeTag) : true;
    const okQuery = query ? inSearch(w, query) : true;
    return okTag && okQuery;
  });
}

function renderChips(){
  const tags = getAllTags();
  tagChips.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "chip";
  allBtn.type = "button";
  allBtn.textContent = "전체";
  allBtn.setAttribute("aria-pressed", String(activeTag === null));
  allBtn.onclick = () => { activeTag = null; renderAll(); };
  tagChips.appendChild(allBtn);

  tags.forEach(tag=>{
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.textContent = tag;
    btn.setAttribute("aria-pressed", String(activeTag === tag));
    btn.onclick = () => { activeTag = (activeTag===tag)?null:tag; renderAll(); };
    tagChips.appendChild(btn);
  });
}

function renderWorks(){
  const items = currentFilteredWorks();
  grid.innerHTML = "";

  items.forEach(work=>{
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
    (work.tags||[]).slice(0,6).forEach(t=>{
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      tags.appendChild(s);
    });

    const footer = document.createElement("div");
    footer.className = "work__footer";

    // 링크 버튼(없으면 비활성)
    const linkBtn = document.createElement("a");
    linkBtn.className = "smallbtn";
    if (work.linkUrl) {
      linkBtn.href = work.linkUrl;
      linkBtn.target = "_blank";
      linkBtn.rel = "noreferrer";
      linkBtn.textContent = work.linkLabel ? `${work.linkLabel}로 이동` : "연재처로 이동";
    } else {
      linkBtn.href = "#";
      linkBtn.textContent = "링크 없음";
      linkBtn.setAttribute("aria-disabled", "true");
      linkBtn.onclick = (e)=>e.preventDefault();
    }

    footer.appendChild(linkBtn);

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

function renderAll(){
  renderChips();
  renderWorks();
}

searchInput.addEventListener("input", (e)=>{
  query = e.target.value || "";
  renderWorks();
});

resetBtn.addEventListener("click", ()=>{
  activeTag = null;
  query = "";
  searchInput.value = "";
  renderAll();
});

function escapeHtml(str){
  return String(str||"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

yearEl.textContent = new Date().getFullYear();
renderAll();
