/* Общая логика сайта: каталог, поиск, фильтры, контакты и доступные модальные окна. Данные берутся из data.js. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const el = (tag, className = "", text = "") => {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  };
  const button = (text, action, className = "button secondary") => {
    const node = el("button", className, text);
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  };
  const storage = {
    get(key) {
      try {
        return localStorage.getItem("ks-" + key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("ks-" + key, value);
        return true;
      } catch {
        return false;
      }
    },
  };
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dialog = $("#modal"),
    modalBody = $("#modal-body");
  let returnFocus = null,
    closeTimer = null;
  function toast(text) {
    const node = el("div", "toast", text);
    $("#toasts").append(node);
    setTimeout(() => node.remove(), 4800);
  }
  function webUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }
  function imageUrl(value) {
    if (typeof value !== "string") return "";
    if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)) return value;
    try {
      const url = new URL(value, location.href);
      return ["file:", "http:", "https:"].includes(url.protocol) && value
        ? url.href
        : "";
    } catch {
      return "";
    }
  }
  function trailerEmbedUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") return "";
      const host = url.hostname.toLowerCase();
      let id = "";
      if (host === "youtu.be") {
        id = url.pathname.slice(1);
      } else if (
        ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
      ) {
        id =
          url.pathname === "/watch"
            ? url.searchParams.get("v")
            : url.pathname.match(/^\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})$/)?.[1];
      } else if (host === "www.youtube-nocookie.com") {
        id = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})$/)?.[1];
      }
      return id && /^[A-Za-z0-9_-]{11}$/.test(id)
        ? "https://www.youtube-nocookie.com/embed/" +
            id +
            "?autoplay=1&rel=0"
        : "";
    } catch {
      return "";
    }
  }
  function vkVideoUrl(value) {
    const safeUrl = webUrl(value);
    if (!safeUrl) return "";
    try {
      const url = new URL(safeUrl);
      return ["vkvideo.ru", "www.vkvideo.ru"].includes(url.hostname) &&
        /^\/video-?\d+_\d+\/?$/.test(url.pathname)
        ? url.href
        : "";
    } catch {
      return "";
    }
  }
  function vkTrailerEmbedUrl(value) {
    const videoUrl = vkVideoUrl(value);
    if (!videoUrl) return "";
    const url = new URL(videoUrl);
    const match = url.pathname.match(/^\/video(-?\d+)_(\d+)\/?$/);
    if (!match) return "";
    const embedUrl = new URL("https://vk.com/video_ext.php");
    embedUrl.searchParams.set("oid", match[1]);
    embedUrl.searchParams.set("id", match[2]);
    embedUrl.searchParams.set("hd", "2");
    embedUrl.searchParams.set("autoplay", "1");
    return embedUrl.href;
  }
  function externalLink(text, href, className = "button primary") {
    const link = el("a", className, text);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }
  function watchLink(item, className = "button primary") {
    const url = webUrl(item.links?.vk);
    return url ? externalLink("Смотреть", url, className) : null;
  }
  function trailerButton(item, className = "button secondary") {
    if (vkTrailerEmbedUrl(item.trailer) && (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(max-width: 600px)").matches
    ))
      return externalLink("Трейлер ↗", item.trailer, className);
    if (trailerEmbedUrl(item.trailer) || vkTrailerEmbedUrl(item.trailer))
      return button(
        "Трейлер",
        () => playTrailer(item),
        className,
      );
    return null;
  }
  function showModal(title, contents) {
    clearTimeout(closeTimer);
    dialog.classList.remove("leaving");
    if (!dialog.open) returnFocus = document.activeElement;
    modalBody.replaceChildren();
    const heading = el("h2", "", title);
    heading.id = "modal-title";
    modalBody.append(heading, ...contents);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("modal-open");
    $(".close-modal").focus();
  }
  function closeModal() {
    if (!dialog.open) return;
    dialog.classList.add("leaving");
    closeTimer = setTimeout(
      () => {
        dialog.close();
      },
      reduced() ? 0 : 170,
    );
  }
  function playTrailer(item) {
    const youtubeEmbed = trailerEmbedUrl(item.trailer),
      vkEmbed = vkTrailerEmbedUrl(item.trailer);
    if (location.protocol === "file:" && !vkEmbed) {
      const note = el(
        "p",
        "muted trailer-unavailable",
        "Браузер не разрешает YouTube-плеер во встроенном окне, когда сайт открыт напрямую с компьютера. Откройте сайт через localhost или хостинг; пока можно перейти к трейлеру на YouTube.",
      );
      const open = externalLink(
        "Открыть трейлер на YouTube ↗",
        item.trailer,
      );
      const actions = el("div", "actions");
      actions.append(open);
      showModal("Трейлер — " + item.title, [note, actions]);
      return;
    }
    const frame = el("iframe", "trailer-frame");
    frame.src = youtubeEmbed || vkEmbed;
    frame.title = "Трейлер: " + item.title;
    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allowFullscreen = true;
    const fallback = externalLink(
      vkEmbed
        ? "Не запускается? Открыть в VK Видео ↗"
        : "Не запускается? Открыть на YouTube ↗",
      item.trailer,
      "text-link",
    );
    const actions = el("div", "actions");
    actions.append(fallback);
    showModal("Трейлер — " + item.title, [frame, actions]);
  }
  $(".close-modal").addEventListener("click", closeModal);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      closeModal();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    dialog.classList.remove("leaving");
    modalBody.replaceChildren();
    if (returnFocus?.isConnected) returnFocus.focus();
  });
  // Нативный dialog удерживает фокус; явная обработка Tab охватывает и программно созданные элементы.
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const nodes = $$(
      'button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]',
      dialog,
    ).filter((n) => !n.hidden && n.getClientRects().length);
    const first = nodes[0],
      last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  function poster(item) {
    const wrap = el(
      "div",
      "poster " +
        (["violet", "gold", "blue", "green", "orange", "pink"].includes(
          item.palette,
        )
          ? item.palette
          : "violet"),
    );
    wrap.append(el("span", "", item.title));
    const caption = el(
      "small",
      "poster-number",
      (item.type === "animation" ? "АНИМАЦИЯ" : "КИНО") + " / " + item.year,
    );
    caption.setAttribute("aria-hidden", "true");
    wrap.append(caption);
    const url = imageUrl(item.poster);
    if (url) {
      const img = new Image();
      img.alt = "Постер: " + item.title;
      img.loading = "lazy";
      img.src = url;
      img.addEventListener("error", () => img.remove(), { once: true });
      wrap.append(img);
    }
    return wrap;
  }
  function card(item) {
    const article = el("article", "movie-card");
    const open = button("", () => preview(item), "poster-link");
    open.setAttribute("aria-label", "Быстрый просмотр: " + item.title);
    open.append(poster(item));
    article.append(open);
    if (item.isNew) article.append(el("span", "new-badge", "НОВИНКА"));
    const body = el("div", "card-body"),
      meta = el("div", "card-meta");
    meta.append(el("span", "", item.year + " · " + item.genre));
    if (item.age) meta.append(el("span", "", item.age));
    const heading = el("h3"),
      link = el("a", "", item.title);
    link.href = "movie.html?id=" + encodeURIComponent(item.id);
    heading.append(link);
    body.append(meta, heading, el("p", "", item.description));
    const actions = el("div", "actions card-actions"),
      watch = watchLink(item, "button primary watch-button"),
      trailer = trailerButton(item, "button secondary card-action-button"),
      more = el("a", "button secondary card-action-button", "Подробнее");
    if (!watch) {
      const unavailable = el(
        "button",
        "button primary watch-button",
        "Смотреть — скоро",
      );
      unavailable.type = "button";
      unavailable.disabled = true;
      unavailable.title = "Ссылка на просмотр появится позже";
      actions.append(unavailable);
    }
    more.href = link.href;
    if (watch) actions.append(watch);
    if (trailer) actions.append(trailer);
    actions.append(more);
    body.append(actions);
    article.append(body);
    return article;
  }
  function preview(item) {
    const layout = el("div", "preview-layout"),
      copy = el("div");
    copy.append(
      el(
        "p",
        "eyebrow",
        (item.type === "animation" ? "МУЛЬТФИЛЬМ" : "ФИЛЬМ") +
          " / " +
          item.year,
      ),
      el("p", "", item.description),
      el("p", "", item.genre + " · " + (item.age || "Возраст не указан")),
    );
    layout.append(poster(item), copy);
    const actions = el("div", "actions"),
      more = el("a", "button secondary", "Подробнее");
    more.href = "movie.html?id=" + encodeURIComponent(item.id);
    const watch = watchLink(item);
    if (watch) actions.append(watch);
    const trailer = trailerButton(item);
    if (trailer) actions.append(trailer);
    actions.append(more);
    showModal(item.title, [layout, actions]);
  }
  async function copyText(text) {
    try {
      if (!navigator.clipboard) throw new Error("unavailable");
      await navigator.clipboard.writeText(text);
      toast("Текст скопирован");
      return true;
    } catch {
      return false;
    }
  }
  async function share(item) {
    const url = new URL(
      "movie.html?id=" + encodeURIComponent(item.id),
      location.href,
    ).href;
    const input = el("input", "share-value");
    input.readOnly = true;
    input.value = url;
    input.setAttribute("aria-label", "Ссылка для копирования");
    const note = el(
      "p",
      "muted",
      location.protocol === "file:"
        ? "Это локальная ссылка. Для других посетителей сначала разместите сайт на хостинге."
        : "Скопируйте ссылку и отправьте друзьям.",
    );
    showModal("Поделиться историей", [
      note,
      input,
      button(
        "Скопировать ссылку",
        async () => {
          if (!(await copyText(url))) {
            input.focus();
            input.select();
            toast("Выделите и скопируйте ссылку вручную");
          }
        },
        "button primary",
      ),
    ]);
    await copyText(url);
  }
  function count(node, target) {
    if (!node) return;
    if (reduced() || document.visibilityState === "hidden") {
      node.textContent = target.toLocaleString("ru-RU");
      return;
    }
    cancelAnimationFrame(node._countFrame);
    const from = Number(node.textContent.replace(/\s/g, "")) || 0,
      start = performance.now();
    const frame = (now) => {
      const t = Math.min((now - start) / 650, 1);
      node.textContent = Math.round(
        from + (target - from) * (1 - Math.pow(1 - t, 3)),
      ).toLocaleString("ru-RU");
      if (t < 1) node._countFrame = requestAnimationFrame(frame);
    };
    node._countFrame = requestAnimationFrame(frame);
  }
  function initCatalog() {
    const grid = $("#catalog-grid");
    if (!grid) return;
    const input = $("#search"),
      suggestions = $("#suggestions"),
      chosen = new Set();
    const pageType = document.body.dataset.catalogType || "all";
    let type = pageType,
      found = [],
      active = -1;
    const genres = $("#genres");
    const pageGenres = [
      ...new Set(
        ITEMS.filter((item) => pageType === "all" || item.type === pageType).map(
          (item) => item.genre,
        ),
      ),
    ];
    pageGenres.forEach((genre) => {
      const chip = button(
        genre,
        () => {
          if (chosen.has(genre)) chosen.delete(genre);
          else chosen.add(genre);
          chip.classList.toggle("active", chosen.has(genre));
          chip.setAttribute("aria-pressed", String(chosen.has(genre)));
          render();
        },
        "",
      );
      chip.setAttribute("aria-pressed", "false");
      genres.append(chip);
    });
    function hideSuggestions() {
      suggestions.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      active = -1;
    }
    function render() {
      let data = ITEMS.filter(
        (item) =>
          (type === "all" || item.type === type) &&
          (!chosen.size || chosen.has(item.genre)) &&
          [item.title, item.details?.originalTitle]
            .filter(Boolean)
            .some((title) =>
              title
                .toLocaleLowerCase("ru")
                .includes(input.value.trim().toLocaleLowerCase("ru")),
            ),
      );
      const sort = $("#sort").value;
      data.sort(
        sort === "title"
          ? (a, b) => a.title.localeCompare(b.title, "ru")
          : sort === "year"
            ? (a, b) => b.year - a.year
            : (a, b) => Number(b.isNew) - Number(a.isNew) || b.year - a.year,
      );
      grid.replaceChildren(...data.map(card));
      $("#empty").hidden = !!data.length;
      const label = el("span", "", "Найдено историй: "),
        number = el("strong", "", "0");
      $("#results").replaceChildren(label, number);
      count(number, data.length);
    }
    function suggest() {
      const q = input.value.trim().toLocaleLowerCase("ru");
      found = q
        ? ITEMS.filter((item) =>
            (type === "all" || item.type === type) &&
            [item.title, item.details?.originalTitle]
              .filter(Boolean)
              .some((title) => title.toLocaleLowerCase("ru").includes(q)),
          ).slice(0, 6)
        : [];
      active = -1;
      suggestions.replaceChildren();
      input.removeAttribute("aria-activedescendant");
      found.forEach((item, index) => {
        const option = el("li", "", item.title);
        option.id = "suggestion-" + index;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", "false");
        option.addEventListener("click", () => {
          hideSuggestions();
          preview(item);
        });
        suggestions.append(option);
      });
      suggestions.hidden = !found.length;
      input.setAttribute("aria-expanded", String(!!found.length));
    }
    input.addEventListener("input", () => {
      render();
      suggest();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideSuggestions();
        return;
      }
      if (event.key === "Enter" && active >= 0 && !suggestions.hidden) {
        event.preventDefault();
        const item = found[active];
        hideSuggestions();
        preview(item);
        return;
      }
      if (!["ArrowDown", "ArrowUp"].includes(event.key) || suggestions.hidden)
        return;
      event.preventDefault();
      active =
        (active + (event.key === "ArrowDown" ? 1 : -1) + found.length) %
        found.length;
      $$("[role=option]", suggestions).forEach((node, i) =>
        node.setAttribute("aria-selected", String(i === active)),
      );
      input.setAttribute("aria-activedescendant", "suggestion-" + active);
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".search-wrap")) hideSuggestions();
    });
    $$("[data-type]").forEach((btn) =>
      btn.addEventListener("click", () => {
        type = btn.dataset.type;
        $$("[data-type]").forEach((node) => {
          node.classList.toggle("active", node === btn);
          node.setAttribute("aria-pressed", String(node === btn));
        });
        render();
      }),
    );
    $("#sort").addEventListener("change", render);
    $("#reset").addEventListener("click", () => {
      input.value = "";
      chosen.clear();
      type = pageType;
      $$("[data-type]").forEach((node) => {
        node.classList.toggle("active", node.dataset.type === pageType);
        node.setAttribute("aria-pressed", String(node.dataset.type === pageType));
      });
      $$("button", genres).forEach((node) => {
        node.classList.remove("active");
        node.setAttribute("aria-pressed", "false");
      });
      hideSuggestions();
      render();
    });
    $$("[data-mood]").forEach((btn) =>
      btn.addEventListener("click", () => {
        chosen.clear();
        chosen.add(btn.dataset.mood);
        $$("button", genres).forEach((node) => {
          const on = chosen.has(node.textContent);
          node.classList.toggle("active", on);
          node.setAttribute("aria-pressed", String(on));
        });
        input.value = "";
        type = "all";
        $$("[data-type]").forEach((node) => {
          node.classList.toggle("active", node.dataset.type === "all");
          node.setAttribute(
            "aria-pressed",
            String(node.dataset.type === "all"),
          );
        });
        render();
        $("#catalog").scrollIntoView({
          behavior: reduced() ? "instant" : "smooth",
        });
      }),
    );
    const newGrid = $("#new-grid");
    if (newGrid)
      newGrid.replaceChildren(
        ...ITEMS.filter((item) => item.isNew)
          .slice(0, 3)
          .map(card),
      );
    render();
  }
  function initMovie() {
    const root = $("#movie-detail");
    if (!root) return;
    const id = new URLSearchParams(location.search).get("id"),
      item = ITEMS.find((entry) => entry.id === id);
    if (!item) {
      root.append(
        el("h1", "", "Материал не найден"),
        el("p", "muted", "Выберите историю из каталога."),
      );
      const link = el("a", "button primary", "Вернуться в каталог");
      link.href = "index.html#catalog";
      root.append(link);
      return;
    }
    document.title = item.title + " — КиноФан";
    $("meta[name=description]").content = item.description;
    const back = el("a", "button secondary back-to-catalog", "←  Весь каталог");
    back.href = "index.html#catalog";
    const layout = el("div", "detail-layout"),
      copy = el("div");
    copy.append(
      el("p", "eyebrow", item.type === "animation" ? "АНИМАЦИЯ" : "КИНО"),
      el("h1", "", item.title),
    );
    const facts = el("div", "facts");
    [item.year, item.genre, item.age]
      .filter(Boolean)
      .forEach((text) => facts.append(el("span", "", String(text))));
    copy.append(facts, el("p", "description", item.description));
    if (item.team?.director || item.team?.cast) {
      const team = el("div", "team");
      team.append(el("h3", "", "Кто в команде"));
      if (item.team.director)
        team.append(el("p", "", "Режиссёр: " + item.team.director));
      if (item.team.cast)
        team.append(el("p", "", "Актёры / озвучка: " + item.team.cast));
      copy.append(team);
    }
    const detailRows = [
      ["Оригинальное название", item.details?.originalTitle],
      ["Дата выхода", item.details?.releaseDate],
      ["Продолжительность", item.details?.runtime],
      ["Страна", item.details?.country],
      ["Язык", item.details?.language],
      ["Возрастная классификация", item.details?.classification],
      ["Сценарий", item.details?.screenplay],
      ["Дистрибьютор", item.details?.distribution],
    ].filter(([, value]) => value);
    if (detailRows.length) {
      const details = el("div", "team");
      details.append(el("h3", "", "Информация о фильме"));
      detailRows.forEach(([label, value]) =>
        details.append(el("p", "", label + ": " + value)),
      );
      copy.append(details);
    }
    if (item.details?.synopsis) {
      const synopsis = el("div", "team movie-synopsis");
      synopsis.append(
        el("h3", "", "Подробнее о сюжете"),
        el("p", "", item.details.synopsis),
      );
      copy.append(synopsis);
    }
    const actions = el("div", "actions");
    const watch = watchLink(item);
    if (watch) actions.append(watch);
    const trailer = trailerButton(item);
    if (trailer) actions.append(trailer);
    actions.append(button("Поделиться ↗", () => share(item)));
    copy.append(actions);
    layout.append(poster(item), copy);
    root.append(back, layout);
    const similar = ITEMS.filter(
      (entry) => entry.id !== id && entry.genre === item.genre,
    ).slice(0, 4);
    $("#related").append(...similar.map(card));
    if (!similar.length)
      $("#related").append(
        el("p", "muted", "Похожие истории появятся после обновления каталога."),
      );
  }
  function initFaq() {
    const search = $("#faq-search");
    if (!search) return;
    search.addEventListener("input", () => {
      let count = 0;
      $$(".faq-item").forEach((item) => {
        const visible = item.textContent
          .toLowerCase()
          .includes(search.value.trim().toLowerCase());
        item.hidden = !visible;
        if (visible) count++;
      });
      $("#faq-empty").hidden = !!count;
    });
    $$(".copy-answer").forEach((btn) =>
      btn.addEventListener("click", async () => {
        const text = $("p", btn.closest(".answer")).textContent;
        if (!(await copyText(text))) {
          const area = el("textarea");
          area.value = text;
          area.readOnly = true;
          area.setAttribute("aria-label", "Текст ответа");
          showModal("Скопируйте ответ вручную", [area]);
          area.select();
        }
      }),
    );
  }
  function initShared() {
    $$("[data-site-name]").forEach((node) => (node.textContent = SITE.name));
    $$("[data-year]").forEach(
      (node) => (node.textContent = new Date().getFullYear()),
    );
    $$("[data-count]").forEach((node) =>
      count(
        node,
        node.dataset.count === "materials"
          ? ITEMS.length
          : node.dataset.count === "new"
            ? ITEMS.filter((item) => item.isNew).length
            : Number(SITE.stats?.subscribers) || 0,
      ),
    );
    if ($("#site-story")) $("#site-story").textContent = SITE.story;
    if ($("#timeline"))
      SITE.milestones.forEach((milestone, i) => {
        const article = el("article", "reveal");
        article.append(
          el("small", "", "ЭТАП 0" + (i + 1)),
          el("h3", "", milestone.title),
          el("p", "muted", milestone.description),
        );
        $("#timeline").append(article);
      });
    $$("[data-contact]").forEach((link) => {
      const url = webUrl(CONTACTS[link.dataset.contact]);
      link.href = url || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.addEventListener("click", (event) => {
        if (!url) {
          event.preventDefault();
          toast("Контакт пока не добавлен");
        }
      });
    });
    $$("[data-random]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (ITEMS.length)
          preview(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
        else toast("В каталоге пока нет материалов");
      }),
    );
    const theme = $(".theme");
    const applyTheme = (value) => {
      document.body.dataset.theme = value;
      theme.setAttribute("aria-pressed", String(value === "light"));
    };
    applyTheme(storage.get("theme") === "light" ? "light" : "dark");
    theme.addEventListener("click", () => {
      const next = document.body.dataset.theme === "light" ? "dark" : "light";
      applyTheme(next);
      storage.set("theme", next);
    });
    const menu = $("#navigation"),
      burger = $(".burger");
    function closeMenu() {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
        burger.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".header")) closeMenu();
    });
    $$("a", menu).forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const destination = new URL(link.href, location.href);
      if (
        destination.origin !== location.origin ||
        destination.pathname !== location.pathname ||
        destination.search !== location.search
      )
        return;
      const id = destination.hash.slice(1);
      const target = id ? document.getElementById(id) : document.documentElement;
      if (!target) return;
      event.preventDefault();
      if (destination.hash !== location.hash) {
        if (location.protocol === "file:") location.hash = destination.hash;
        else history.pushState(null, "", destination.href);
      }
      target.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
    const current = location.pathname.split("/").pop() || "index.html";
    $$("a", menu).forEach((link) => {
      if (link.getAttribute("href") === current)
        link.setAttribute("aria-current", "page");
    });
    if (!storage.get("notice")) {
      const note = el(
        "p",
        "muted",
        "Сайт не использует отслеживающие cookie. В браузере могут сохраняться тема, закрытые подсказки и ваши черновики редактора.",
      );
      showModal("Небольшая заметка о настройках", [
        note,
        button(
          "Понятно",
          () => {
            storage.set("notice", "1");
            closeModal();
          },
          "button primary",
        ),
      ]);
    }
    if (document.body.dataset.page === "index" && !storage.get("tip")) {
      const tip = el(
        "div",
        "first-tip",
        "Наведите на карточку, чтобы увидеть эффект. На телефоне нажмите на постер.",
      );
      tip.append(
        button(
          "Понятно",
          () => {
            storage.set("tip", "1");
            tip.remove();
          },
          "",
        ),
      );
      document.body.append(tip);
    }
  }
  window.Cinema = {
    el,
    button,
    toast,
    webUrl,
    trailerEmbedUrl,
    imageUrl,
    poster,
    showModal,
    closeModal,
    copyText,
    storage,
    count,
  };
  initCatalog();
  initMovie();
  initFaq();
  initShared();
})();
