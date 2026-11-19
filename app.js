(() => {
  const state = {
    data: null,
    fnMap: {},
    gallery: [],
    lbIndex: 0,
    fontSize: 17,
    ambientOn: true,
    focusOn: false,
    currentZone: "zone-whitegate",
  };

  const ZONE_META = {
    abstract:    { zone: "zone-whitegate", pill: "白门商埠", axis: "总问题意识 · 韦伯：现代性的铁笼", kicker: "ABSTRACT · 论文摘要", epigraph: "局部受制于严密算术法则，总体却受制于盲目拜物教危机。" },
    methodology: { zone: "zone-whitegate", pill: "白门商埠", axis: "理论架构 · 韦伯 × 马克思 × 黑格尔 × 本雅明", kicker: "METHODOLOGY · 架构说明", epigraph: "以四十八话实机剧本与终局机制为经，以马克思—黑格尔双主轴为纬。" },
    intro:       { zone: "zone-whitegate", pill: "白门商埠", axis: "总问题意识 · 韦伯：白门商埠与现代性铁笼", kicker: "INTRODUCTION · 白门商埠", epigraph: "暗碧海的豆蔻茶香、烤鱼油脂，与白门二层噼啪作响的山猫算盘。" },
    ch1:         { zone: "zone-whitegate", pill: "白门商埠", axis: "第一主轴 · 马克思：雇佣算术与反向原始积累", kicker: "CHAPTER I · 山猫的算盘", epigraph: "一张哄骗签名的卖身羊皮纸，与十一阶山猫佣兵的契约罗网。" },
    ch2:         { zone: "zone-whitegate", pill: "白门商埠", axis: "第一主轴 · 马克思：第一级戒严令与市井守望", kicker: "CHAPTER II · 野生洋葱的外皮", epigraph: "白门灯火与阿尔扎比城墙之间，五蛇将与一顶平民瓦拉拉头巾。" },
    ch3:         { zone: "zone-alzadaal",  pill: "冷白遗迹", axis: "第一主轴 · 马克思：冷白遗迹与二十重流水线解体", kicker: "CHAPTER III · 巨神的解剖图", epigraph: "踏入冷白色海底遗迹回廊，在血髓油薄膜与二十枚云属晶片间拆解肉身。" },
    ch4:         { zone: "zone-alzadaal",  pill: "冷白遗迹", axis: "第一主轴 · 马克思 × 本雅明：三重血液与濒死灵光", kicker: "CHAPTER IV · 苍狮子的末路", epigraph: "天然血髓油、拉米亚青血与人工血髓油——在 1%–10% 濒死快门中凝视灵光。" },
    ch5:         { zone: "zone-coffin",    pill: "漆黑发条", axis: "第二主轴 · 黑格尔 × 本雅明：蓝血对质与下跪铁律", kicker: "CHAPTER V · 漆黑之柩的赌徒", epigraph: "迷雾海面上的阿舒塔里夫幽灵船，与塔拉卡湾掷出的偶然性海盗骰子。" },
    ch6:         { zone: "zone-coffin",    pill: "漆黑发条", axis: "第二主轴 · 黑格尔：发条之心刺穿国家总体性", kicker: "CHAPTER VI · 发条之心与秘银镜", epigraph: "父母遗留的旧式发条人偶、深海秘银之镜，与具体个人的微温集合。" },
    ch7:         { zone: "zone-ragnarok",  pill: "诸神归航", axis: "第二主轴 · 黑格尔：奴隶收剑与诸神黄昏的中断", kicker: "CHAPTER VII · 诸神黄昏的中断", epigraph: "黑白二神从 XIII 到 I 的审判倒数，终结于凡人拒绝下跪的收剑决断。" },
    conclusion:  { zone: "zone-ragnarok",  pill: "诸神归航", axis: "双主轴合流 · 3+2 辩证转化：无冠加冕与世俗归航", kicker: "CONCLUSION · 世俗归航", epigraph: "千年王冠熔铸为玩偶齿轮，九万八千枚金币化作永不结清的同伴欠条。" },
    footnotes:   { zone: "zone-whitegate", pill: "一手档案", axis: "全篇一手档案 · 54 条一手原典与实机尾注", kicker: "ENDNOTES · 全篇注释", epigraph: "正文内所有［注N］均可直接悬停或点击原地展开；此处汇总全篇 54 条总注。" },
    appendix:    { zone: "zone-whitegate", pill: "一手档案", axis: "一手游戏档案与哲学原典索引表", kicker: "APPENDIX · 核验总表", epigraph: "日英双语实机剧本、终局机制档案与哲学原典出处总览。" }
  };

  const MERCENARY_RANKS = [
    "PSC · 山猫二等兵", "PFC · 山猫一等兵", "SP · 山猫上等兵",
    "LC · 山猫伍长", "C · 山猫军曹", "S · 山猫曹长",
    "SM · 山猫准尉", "CS · 山猫少尉", "SL · 山猫中尉",
    "FL · 山猫大尉", "CAPTAIN · 无冠世俗归航"
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Convert ANY footnote link (<a href="#fn-N">) OR bare ［注N］ into non-jumping <button class="fn-ref">
  function upgradeFootnotesHtml(htmlStr) {
    let s = String(htmlStr);
    // 1. Convert any <a ... href="#fn-N" ...>...</a>
    s = s.replace(
      /<a\b[^>]*href="#fn-(\d+)"[^>]*>.*?<\/a>/gi,
      '<button type="button" class="fn-ref" data-fn="$1" aria-expanded="false" aria-label="展开注$1">注$1</button>'
    );
    // 2. Convert any remaining bare ［注N］ or [注N]
    s = s.replace(
      /[［\[]注(\d+)[］\]]/g,
      '<button type="button" class="fn-ref" data-fn="$1" aria-expanded="false" aria-label="展开注$1">注$1</button>'
    );
    // 3. Clean any stray **bold** markdown artifacts
    s = s.replace(/\*\*([^*<>]+?)\*\*/g, "<strong>$1</strong>");
    return s;
  }

  // Whisper-quiet Canvas Atmospheric Particle Field tailored to each TOAU zone
  function initAmbientCanvas() {
    const canvas = document.getElementById("ambientCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.9 + Math.random() * 2.1,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -0.15 - Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.14 + Math.random() * 0.28,
    }));

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const ZONE_COLORS = {
      "zone-whitegate": { rgb: "238, 194, 112", mode: "drift-up" },    // Warm spice-dust & Astral Wind gold
      "zone-alzadaal":  { rgb: "110, 198, 242", mode: "bubble-up" },   // Subterranean cerulean plasma-oil bubbles
      "zone-coffin":    { rgb: "212, 138, 128", mode: "mist-across" }, // Ashu Talif mist & clockwork brass sparks
      "zone-ragnarok":  { rgb: "248, 224, 158", mode: "star-drift" },  // White-gold dawn stardust
    };

    function tick(t) {
      if (state.ambientOn && document.documentElement.getAttribute("data-theme") === "toau-dusk") {
        ctx.clearRect(0, 0, w, h);
        const cfg = ZONE_COLORS[state.currentZone] || ZONE_COLORS["zone-whitegate"];
        for (const p of particles) {
          p.phase += 0.012;
          if (cfg.mode === "mist-across") {
            p.x += Math.abs(p.vx) + 0.18;
            p.y += Math.sin(p.phase) * 0.16;
          } else if (cfg.mode === "bubble-up") {
            p.x += Math.sin(p.phase) * 0.25;
            p.y += p.vy * 1.15;
          } else {
            p.x += p.vx + Math.sin(p.phase) * 0.14;
            p.y += p.vy * 0.8;
          }
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x > w + 10) { p.x = -10; p.y = Math.random() * h; }
          if (p.x < -10) { p.x = w + 10; }

          const pulse = p.alpha * (0.65 + 0.35 * Math.sin(p.phase * 1.5));
          ctx.beginPath();
          if (cfg.mode === "bubble-up") {
            ctx.arc(p.x, p.y, p.r * 1.25, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${cfg.rgb}, ${pulse.toFixed(3)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          } else {
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${cfg.rgb}, ${pulse.toFixed(3)})`;
            ctx.fill();
          }
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  async function loadData() {
    if (window.__EMBEDDED_MANUSCRIPT__) return window.__EMBEDDED_MANUSCRIPT__;
    const res = await fetch("./data/manuscript.json");
    if (!res.ok) throw new Error("Failed to load ./data/manuscript.json");
    return await res.json();
  }

  function renderFigureHtml(sc) {
    const idx = state.gallery.length;
    state.gallery.push(sc);
    return `
      <figure class="game-figure">
        <div class="figure-frame">
          <img src="${escapeHtml(sc.url)}" alt="${escapeHtml(sc.alt)}" loading="lazy" data-lb-idx="${idx}" />
        </div>
        <figcaption>
          <span class="fig-badge">${escapeHtml(sc.fig_no)}</span>
          <strong>${escapeHtml(sc.title)}</strong> — ${escapeHtml(sc.caption)}
          <span>（来源：<a href="${escapeHtml(sc.source_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sc.source_title)}</a>）</span>
        </figcaption>
      </figure>`;
  }

  function renderTOC(chapters) {
    const nav = document.getElementById("tocNav");
    const ul = document.createElement("ul");
    chapters.forEach((ch) => {
      const li = document.createElement("li");
      li.className = "toc-h2";
      li.innerHTML = `<a href="#${ch.id}" data-toc-id="${ch.id}">${escapeHtml(ch.title)}</a>`;
      if (ch.subheadings && ch.subheadings.length) {
        const subUl = document.createElement("ul");
        ch.subheadings.forEach((sh) => {
          const sli = document.createElement("li");
          sli.className = "toc-h3";
          sli.innerHTML = `<a href="#${sh.id}">${escapeHtml(sh.title)}</a>`;
          subUl.appendChild(sli);
        });
        li.appendChild(subUl);
      }
      ul.appendChild(li);
    });
    nav.innerHTML = "";
    nav.appendChild(ul);
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => document.getElementById("tocDrawer").classList.remove("open"));
    });
  }

  function renderArticle(data) {
    state.gallery = [];
    const root = document.getElementById("articleRoot");
    const parts = [];
    const subShots = data.subsectionScreenshots || {};

    data.chapters.forEach((ch) => {
      const meta = ZONE_META[ch.id] || { zone: "zone-whitegate", pill: "白门商埠", axis: "阿特尔冈批评档案", kicker: "", epigraph: "" };
      parts.push(`<section id="${ch.id}" class="doc-section" data-zone="${meta.zone}" data-pill="${escapeHtml(meta.pill)}" data-axis="${escapeHtml(meta.axis)}" data-section-title="${escapeHtml(ch.title)}">`);
      parts.push(`<div class="section-header-block">`);
      if (meta.kicker) parts.push(`<div class="section-kicker">${escapeHtml(meta.kicker)}</div>`);
      parts.push(`<h2 class="section-title">${escapeHtml(ch.title)}</h2>`);
      if (meta.epigraph) parts.push(`<div class="section-sensory-epigraph">${escapeHtml(meta.epigraph)}</div>`);
      parts.push(`</div>`);

      if (ch.screenshot) parts.push(renderFigureHtml(ch.screenshot));

      ch.blocks.forEach((blk) => {
        if (blk.type === "subheading") {
          parts.push(`<h3 id="${blk.id}" class="subsection-title">${escapeHtml(blk.text)}</h3>`);
          if (subShots[blk.id]) parts.push(renderFigureHtml(subShots[blk.id]));
        } else if (blk.type === "paragraph") {
          if (ch.id === "footnotes") {
            const m = blk.text.match(/^[［\[]?注(\d+)[］\]]?/);
            if (m) {
              parts.push(`<p id="fn-${m[1]}" class="footnote-item">${blk.html}</p>`);
              return;
            }
          }
          const t = blk.text.trim();
          const isDialogue =
            t.startsWith("「") ||
            t.startsWith("按照传统惯例，战利品") ||
            (t.includes("日文原段参见") && t.length < 260) ||
            ((t.startsWith("“") || t.startsWith("『")) && t.length < 220 && (t.includes("——") || t.includes("（\"")));
          const cls = isDialogue ? ' class="ffxi-dialogue"' : "";
          parts.push(`<p${cls}>${upgradeFootnotesHtml(blk.html)}</p>`);
        } else if (blk.type === "list") {
          const tag = blk.ordered ? "ol" : "ul";
          const lis = (blk.itemsHtml || []).map((ih) => `<li>${upgradeFootnotesHtml(ih)}</li>`).join("");
          parts.push(`<${tag}>${lis}</${tag}>`);
        } else if (blk.type === "diagram") {
          parts.push(`
            <figure class="diagram-figure">
              <div class="svg-wrap">${blk.svg}</div>
              <figcaption><span class="fig-badge">图 0</span> <strong>${escapeHtml(blk.title)}</strong></figcaption>
            </figure>`);
        } else if (blk.type === "table") {
          const rows = blk.rowsHtml || [];
          if (rows.length) {
            const thead = `<tr>${rows[0].map((c) => `<th>${upgradeFootnotesHtml(c)}</th>`).join("")}</tr>`;
            const tbody = rows.slice(1).map((r) => `<tr>${r.map((c) => `<td>${upgradeFootnotesHtml(c)}</td>`).join("")}</tr>`).join("");
            parts.push(`<div class="table-wrap"><table><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`);
          }
        }
      });

      if (ch.id === "abstract" && data.meta.keywords && data.meta.keywords.length) {
        parts.push(`<div class="kw-bar">${data.meta.keywords.map((k) => `<span class="kw-tag">${escapeHtml(k)}</span>`).join("")}</div>`);
      }

      parts.push(`</section>`);
    });

    root.innerHTML = parts.join("\n");
    const galBtn = document.getElementById("btnGalleryOpen");
    if (galBtn) galBtn.textContent = `图鉴 (${state.gallery.length})`;
    bindInteractions();
  }

  function openLightboxAt(idx) {
    if (!state.gallery.length) return;
    state.lbIndex = (idx + state.gallery.length) % state.gallery.length;
    const sc = state.gallery[state.lbIndex];
    document.getElementById("lightboxImg").src = sc.url;
    document.getElementById("lightboxImg").alt = sc.alt;
    document.getElementById("lightboxCounter").textContent = `${state.lbIndex + 1} / ${state.gallery.length} · ${sc.fig_no}`;
    document.getElementById("lightboxCaption").innerHTML = `<strong>${escapeHtml(sc.title)}</strong> — ${escapeHtml(sc.caption)}`;
    const lb = document.getElementById("lightbox");
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  }

  function bindInteractions() {
    // Lightbox & Gallery triggers
    const lb = document.getElementById("lightbox");
    document.querySelectorAll("[data-lb-idx]").forEach((img) => {
      img.addEventListener("click", () => openLightboxAt(Number(img.getAttribute("data-lb-idx"))));
    });
    const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
    document.getElementById("lightboxClose").addEventListener("click", closeLb);
    document.getElementById("lightboxPrev").addEventListener("click", (e) => { e.stopPropagation(); openLightboxAt(state.lbIndex - 1); });
    document.getElementById("lightboxNext").addEventListener("click", (e) => { e.stopPropagation(); openLightboxAt(state.lbIndex + 1); });
    lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

    // Touch swipe support for mobile lightbox
    let touchStartX = 0;
    let touchStartY = 0;
    lb.addEventListener("touchstart", (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 38 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0) openLightboxAt(state.lbIndex + 1);
          else openLightboxAt(state.lbIndex - 1);
        } else if (dy > 60 && Math.abs(dy) > Math.abs(dx)) {
          closeLb();
        }
      }
    }, { passive: true });

    const openGal = () => openLightboxAt(0);
    const b1 = document.getElementById("btnGalleryOpen");
    const b2 = document.getElementById("btnHeroGallery");
    if (b1) b1.addEventListener("click", openGal);
    if (b2) b2.addEventListener("click", openGal);

    document.addEventListener("keydown", (e) => {
      if (lb.classList.contains("open")) {
        if (e.key === "Escape") closeLb();
        if (e.key === "ArrowLeft") openLightboxAt(state.lbIndex - 1);
        if (e.key === "ArrowRight") openLightboxAt(state.lbIndex + 1);
      } else if (e.key === "Escape") {
        document.querySelectorAll(".inline-fn-drawer").forEach((d) => d.remove());
        document.querySelectorAll("button.fn-ref[aria-expanded='true']").forEach((b) => b.setAttribute("aria-expanded", "false"));
      }
    });

    // Non-Jumping Footnotes: Hover Floating Card + Click In-Place Inline Drawer
    const pop = document.getElementById("fnPopover");
    let hideTimer = null;

    document.querySelectorAll("button.fn-ref").forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        if (window.matchMedia && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        if (btn.getAttribute("aria-expanded") === "true") return;
        clearTimeout(hideTimer);
        const id = btn.getAttribute("data-fn");
        if (!state.fnMap[id]) return;
        pop.innerHTML = `${state.fnMap[id]}<div class="fn-popover-tip">▸ 点击［注${id}］可在段下原地固定展开，绝不跳转打断阅读</div>`;
        pop.style.display = "block";
        pop.setAttribute("aria-hidden", "false");
        const rect = btn.getBoundingClientRect();
        const popW = Math.min(450, window.innerWidth - 32);
        const left = Math.min(window.innerWidth - popW - 16, Math.max(16, rect.left - 36));
        const estH = pop.offsetHeight || 160;
        const top = rect.bottom + estH + 20 > window.innerHeight ? Math.max(58, rect.top - estH - 12) : rect.bottom + 10;
        pop.style.left = `${left}px`;
        pop.style.top = `${top}px`;
      });

      btn.addEventListener("mouseleave", () => {
        hideTimer = setTimeout(() => {
          if (!pop.matches(":hover")) {
            pop.style.display = "none";
            pop.setAttribute("aria-hidden", "true");
          }
        }, 200);
      });

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        pop.style.display = "none";
        const id = btn.getAttribute("data-fn");
        if (!state.fnMap[id]) return;

        const blockEl = btn.closest("p, li, table");
        if (!blockEl) return;

        const existing = blockEl.nextElementSibling;
        if (existing && existing.classList.contains("inline-fn-drawer") && existing.getAttribute("data-fn-id") === id) {
          existing.remove();
          btn.setAttribute("aria-expanded", "false");
          return;
        }
        if (existing && existing.classList.contains("inline-fn-drawer")) {
          const prevId = existing.getAttribute("data-fn-id");
          blockEl.querySelectorAll(`button.fn-ref[data-fn="${prevId}"]`).forEach((b) => b.setAttribute("aria-expanded", "false"));
          existing.remove();
        }

        const drawer = document.createElement("aside");
        drawer.className = "inline-fn-drawer";
        drawer.setAttribute("data-fn-id", id);
        drawer.innerHTML = `
          <div class="inline-fn-header">
            <span>❖ 原地注释 · 注${id}</span>
            <div class="inline-fn-actions">
              <a class="inline-fn-jump" href="#fn-${id}">文末总注 ↘</a>
              <button type="button" class="inline-fn-close" aria-label="收起注释">收起 ✕</button>
            </div>
          </div>
          <div class="inline-fn-body">${state.fnMap[id]}</div>`;
        drawer.querySelector(".inline-fn-close").addEventListener("click", () => {
          drawer.remove();
          btn.setAttribute("aria-expanded", "false");
        });
        blockEl.insertAdjacentElement("afterend", drawer);
        btn.setAttribute("aria-expanded", "true");
      });
    });

    pop.addEventListener("mouseleave", () => {
      pop.style.display = "none";
      pop.setAttribute("aria-hidden", "true");
    });

    // Scrollspy, Ambient Zone Transition & 11-Rank Mercenary Telemetry
    const sections = Array.from(document.querySelectorAll(".doc-section"));
    const tocLinks = Array.from(document.querySelectorAll("[data-toc-id]"));
    const mobileCur = document.getElementById("mobileCurSec");
    const telemetryBar = document.getElementById("telemetryBar");
    const zonePill = document.getElementById("zonePill");
    const axisLabel = document.getElementById("axisLabel");
    const rankBadge = document.getElementById("rankBadge");
    const rankPct = document.getElementById("rankPct");
    const heroEl = document.getElementById("top");

    const onScroll = () => {
      const docEl = document.documentElement;
      const pct = Math.min(100, Math.max(0, (docEl.scrollTop / Math.max(1, docEl.scrollHeight - docEl.clientHeight)) * 100));
      document.getElementById("readingProgress").style.width = `${pct}%`;

      if (heroEl && telemetryBar) {
        telemetryBar.classList.toggle("visible", heroEl.getBoundingClientRect().bottom < 20);
      }

      const rankIdx = Math.min(MERCENARY_RANKS.length - 1, Math.floor((pct / 100) * MERCENARY_RANKS.length));
      if (rankBadge) rankBadge.textContent = MERCENARY_RANKS[rankIdx];
      if (rankPct) rankPct.textContent = `${Math.round(pct)}%`;

      let activeSec = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= 160) activeSec = s;
      }
      if (activeSec) {
        tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("data-toc-id") === activeSec.id));
        if (mobileCur) mobileCur.textContent = activeSec.getAttribute("data-section-title").slice(0, 18);
        if (axisLabel) axisLabel.textContent = activeSec.getAttribute("data-axis");
        if (zonePill) zonePill.textContent = activeSec.getAttribute("data-pill") || "白门商埠";
        const z = activeSec.getAttribute("data-zone");
        if (z) {
          state.currentZone = z;
          document.documentElement.setAttribute("data-zone", z);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setupControls() {
    const applyTheme = (t) => {
      document.documentElement.setAttribute("data-theme", t);
      document.querySelectorAll("[data-theme-btn]").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-theme-btn") === t);
      });
      try { localStorage.setItem("toau_theme", t); } catch (_) {}
    };

    const saved = (() => { try { return localStorage.getItem("toau_theme"); } catch (_) { return null; } })();
    applyTheme(saved || "toau-dusk");

    document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
      btn.addEventListener("click", () => applyTheme(btn.getAttribute("data-theme-btn")));
    });

    const ambBtn = document.getElementById("btnAmbientToggle");
    if (ambBtn) {
      ambBtn.addEventListener("click", () => {
        state.ambientOn = !state.ambientOn;
        document.documentElement.setAttribute("data-ambient", state.ambientOn ? "on" : "off");
        ambBtn.textContent = state.ambientOn ? "氛围场：开" : "氛围场：静默";
        ambBtn.classList.toggle("active", state.ambientOn);
      });
    }

    const focusBtn = document.getElementById("btnFocusToggle");
    if (focusBtn) {
      focusBtn.addEventListener("click", () => {
        state.focusOn = !state.focusOn;
        document.documentElement.setAttribute("data-focus", state.focusOn ? "on" : "off");
        focusBtn.textContent = state.focusOn ? "退出专注" : "专注阅读";
        focusBtn.classList.toggle("active", state.focusOn);
      });
    }

    const setFont = (delta) => {
      state.fontSize = Math.max(14, Math.min(22, state.fontSize + delta));
      document.documentElement.style.setProperty("--base-size", `${state.fontSize}px`);
    };
    document.getElementById("btnFontDec").addEventListener("click", () => setFont(-1));
    document.getElementById("btnFontInc").addEventListener("click", () => setFont(1));
    document.getElementById("btnPrint").addEventListener("click", () => window.print());
    const pt = document.getElementById("btnPrintTop");
    if (pt) pt.addEventListener("click", () => window.print());

    const drawer = document.getElementById("tocDrawer");
    const openToc = () => drawer.classList.add("open");
    const closeToc = () => drawer.classList.remove("open");
    document.getElementById("btnOpenToc").addEventListener("click", openToc);
    const mobSec = document.getElementById("mobileCurSec");
    if (mobSec) mobSec.addEventListener("click", openToc);
    document.getElementById("btnCloseToc").addEventListener("click", closeToc);
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) closeToc();
    });

    const input = document.getElementById("searchInput");
    const status = document.getElementById("searchStatus");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const secs = Array.from(document.querySelectorAll(".doc-section"));
      if (!q) {
        secs.forEach((s) => (s.style.display = ""));
        status.textContent = "";
        return;
      }
      let matched = 0;
      secs.forEach((s) => {
        const hit = s.textContent.toLowerCase().includes(q);
        s.style.display = hit ? "" : "none";
        if (hit) matched++;
      });
      status.textContent = matched ? `匹配到 ${matched} 个章节 / 区块` : "未找到匹配段落";
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    setupControls();
    initAmbientCanvas();
    try {
      const data = await loadData();
      state.data = data;
      (data.footnotes || []).forEach((fn) => {
        state.fnMap[String(fn.id)] = fn.html;
      });
      const bd = document.getElementById("entranceBackdrop");
      if (bd && data.screenshots && data.screenshots[0]) {
        bd.style.backgroundImage = `url(${JSON.stringify(data.screenshots[0].url)})`;
      }
      renderTOC(data.chapters);
      renderArticle(data);
    } catch (err) {
      document.getElementById("articleRoot").innerHTML = `
        <p style="color:var(--accent-gold-bright);">
          无法通过本地 file:// 协议直接读取 <code>./data/manuscript.json</code>。
          请将本文件夹部署至 GitHub Pages，或在本地执行 <code>python3 -m http.server 8000</code> 后访问 <code>http://localhost:8000</code>；
          也可直接双击打开随附的独立离线预览版 HTML。
        </p>`;
    }
  });
})();
