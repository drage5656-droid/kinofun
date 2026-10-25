import React, { useEffect, useMemo, useRef, useState } from "react";
import { CONTACTS, ITEMS, SITE } from "../data.js";
import { getSeoMetadata } from "./seo.js";

const BASE_URL = "https://kinofun.ru";
const paletteNames = ["violet", "gold", "blue", "green", "pink", "orange"];
const navigation = [
  ["Главная", "/"],
  ["Каталог", "/#catalog"],
  ["Мультфильмы", "/cartoons.html"],
  ["Новинки", "/#new"],
  ["О проекте", "/about.html"],
  ["FAQ", "/faq.html"],
  ["Поддержка", "/support.html"],
];
const faqEntries = [
  ["Как найти нужный фильм?", "Введите название в поиске каталога. Можно также выбрать тип материала и один или несколько жанров."],
  ["Как перейти к просмотру?", "Откройте карточку и нажмите «Смотреть». Видео откроется на ВКонтакте, если для фильма добавлена ссылка."],
  ["Как посмотреть трейлер?", "Если для фильма добавлена ссылка на трейлер YouTube или VK Видео, нажмите «Трейлер» — он откроется во встроенном окне сайта."],
  ["Что делать, если ссылка не работает?", "Сообщите автору название материала и что именно не работает через страницу поддержки."],
  ["Почему не открывается видео?", "Проверьте интернет и доступность видео ВКонтакте. Иногда для просмотра нужно войти в аккаунт."],
  ["Как связаться с автором?", "На странице поддержки размещаются контакты MAX, Telegram и ВКонтакте."],
  ["Можно ли предложить материал?", "Да. Отправьте название и предложение автору через доступный мессенджер."],
  ["Где публикуются новости?", "В сообществе ВКонтакте. Кнопка перехода находится в шапке сайта."],
  ["Как сообщить об ошибке?", "Напишите в поддержку: укажите название, описание ошибки и платформу. Никому не отправляйте пароли и коды входа."],
];

const getPage = (pathname) => {
  if (/\/movie\/[^/]+\/?$/.test(pathname) || pathname.endsWith("/movie.html"))
    return "movie";
  const page = pathname.split("/").filter(Boolean).at(-1)?.replace(/\.html$/, "");
  return ["about", "cartoons", "faq", "support", "admin"].includes(page)
    ? page
    : "index";
};

const getItemUrl = (item) => `/movie/${encodeURIComponent(item.id)}/`;

function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(
      value,
      typeof window === "undefined" ? BASE_URL : window.location.href,
    );
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function imageUrl(value) {
  return typeof value === "string" && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)
    ? value
    : safeUrl(value);
}

function vkTrailerEmbedUrl(value) {
  const safe = safeUrl(value);
  if (!safe) return "";
  try {
    const url = new URL(safe);
    const match = url.hostname === "vkvideo.ru" || url.hostname === "www.vkvideo.ru"
      ? url.pathname.match(/^\/video(-?\d+)_(\d+)\/?$/)
      : null;
    if (!match) return "";
    const embed = new URL("https://vk.com/video_ext.php");
    embed.searchParams.set("oid", match[1]);
    embed.searchParams.set("id", match[2]);
    embed.searchParams.set("hd", "2");
    return embed.href;
  } catch {
    return "";
  }
}

function youtubeEmbedUrl(value) {
  const safe = safeUrl(value);
  if (!safe) return "";
  try {
    const url = new URL(safe);
    const host = url.hostname.toLowerCase();
    let id = "";
    if (host === "youtu.be") {
      id = url.pathname.slice(1);
    } else if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) {
      id = url.pathname === "/watch"
        ? url.searchParams.get("v") || ""
        : url.pathname.match(/^\/(?:embed|shorts)\/([A-Za-z0-9_-]{11})$/)?.[1] || "";
    } else if (host === "www.youtube-nocookie.com") {
      id = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})$/)?.[1] || "";
    }
    return /^[A-Za-z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
      : "";
  } catch {
    return "";
  }
}

function readTheme() {
  try {
    return localStorage.getItem("ks-theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function getItemByPath(pathname, search) {
  const pathMatch = pathname.match(/\/movie\/([^/]+)\/?$/);
  const id = pathMatch
    ? decodeURIComponent(pathMatch[1])
    : new URLSearchParams(search).get("id");
  return ITEMS.find((item) => item.id === id) ?? null;
}

function useDocumentMetadata(metadata) {
  useEffect(() => {
    document.title = metadata.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.content = metadata.description;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = metadata.canonical;
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.content = metadata.robots;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = metadata.title;
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = metadata.description;
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = metadata.canonical;
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = metadata.image;
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) twitterCard.content = metadata.twitterCard;
    const jsonLd = document.getElementById("seo-jsonld");
    if (jsonLd) jsonLd.textContent = JSON.stringify(metadata.structuredData);
  }, [metadata]);
}

function SkyCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    let width = 0;
    let height = 0;
    let ratio = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      const count = Math.min(150, Math.round((width * height) / 9000));
      for (let index = 0; index < count; index += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 1.2 + 0.3;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(230, 235, 240, ${Math.random() * 0.35 + 0.08})`;
        context.fill();
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return <canvas id="sky" ref={canvasRef} aria-hidden="true" />;
}

function Header({ page, theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="header" id="top">
      <a className="logo" href={CONTACTS.vk} target="_blank" rel="noopener noreferrer" aria-label="KinoFun — открыть сообщество ВКонтакте">
        <img className="logo-image" src="/kinofun-favicon.svg" alt="" />
        <span>KinoFun<small>КиноФан</small></span>
      </a>
      <button
        className="burger icon"
        type="button"
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-controls="navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "×" : "☰"}
      </button>
      <nav id="navigation" className={menuOpen ? "open" : ""} aria-label="Основное меню">
        {navigation.map(([label, href]) => {
          const selected = href === `/${page === "index" ? "" : `${page}.html`}`;
          return (
            <a
              key={label}
              href={href}
              aria-current={selected ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}{label === "Новинки" && <i />}
            </a>
          );
        })}
      </nav>
      <div className="header-actions">
        <button
          className="icon theme"
          type="button"
          aria-label="Переключить тему"
          aria-pressed={theme === "light"}
          onClick={onToggleTheme}
        >
          ◐
        </button>
        <a className="mini-social" href={CONTACTS.vk} target="_blank" rel="noopener noreferrer">
          VK ↗
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <a className="logo" href={CONTACTS.vk} target="_blank" rel="noopener noreferrer">
          <img className="logo-image" src="/kinofun-favicon.svg" alt="" />
          <span>KinoFun<small>КиноФан</small></span>
        </a>
        <p>Хорошие истории становятся ближе.</p>
        <div>
          <a href="/about.html">О проекте</a>
          <a href="/faq.html">Вопросы</a>
          <a href="/support.html">Поддержка</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>Ссылки ведут только на разрешённые источники.</span>
      </div>
    </footer>
  );
}

function Poster({ item, priority = false }) {
  const image = imageUrl(item.poster);
  const image2x = item.poster2x?.startsWith("data:")
    ? ""
    : imageUrl(item.poster2x);
  return (
    <div className={`poster ${paletteNames.includes(item.palette) ? item.palette : "violet"}`}>
      <span>{item.title}</span>
      <small className="poster-number" aria-hidden="true">
        {item.type === "animation" ? "АНИМАЦИЯ" : "КИНО"} / {item.year}
      </small>
      {image && (
        <img
          src={image}
          srcSet={image2x ? `${image} 1x, ${image2x} 2x` : undefined}
          alt={`Постер: ${item.title}`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          sizes="(max-width: 600px) 88vw, (max-width: 850px) 44vw, (max-width: 1200px) 30vw, 260px"
        />
      )}
    </div>
  );
}

function MovieCard({ item, onPreview, priority = false }) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const watchUrl = safeUrl(item.links?.vk);
  const trailerUrl = safeUrl(item.trailer);
  const trailerEmbed = youtubeEmbedUrl(item.trailer) || vkTrailerEmbedUrl(item.trailer);
  return (
    <article className="movie-card">
      <button
        className="poster-link"
        type="button"
        aria-label={`Быстрый просмотр: ${item.title}`}
        onClick={() => onPreview(item)}
      >
        <Poster item={item} priority={priority} />
      </button>
      {item.isNew && <span className="new-badge">НОВИНКА</span>}
      <div className="card-body">
        <div className="card-meta">
          <span>{item.year} · {item.genre}</span>
          {item.age && <span>{item.age}</span>}
        </div>
        <h3><a href={getItemUrl(item)}>{item.title}</a></h3>
        <p>{item.description}</p>
        <div className="actions card-actions">
          {watchUrl
            ? <a className="button primary watch-button" href={watchUrl} target="_blank" rel="noopener noreferrer">Смотреть</a>
            : <button className="button primary watch-button" type="button" disabled>Смотреть — скоро</button>}
          {trailerEmbed
            ? <button className="button secondary card-action-button" type="button" onClick={() => setTrailerOpen(true)}>Трейлер</button>
            : trailerUrl && <a className="button secondary card-action-button" href={trailerUrl} target="_blank" rel="noopener noreferrer">Трейлер ↗</a>}
          <a className="button secondary card-action-button" href={getItemUrl(item)}>Подробнее</a>
        </div>
      </div>
      {trailerOpen && <TrailerDialog item={item} src={trailerEmbed} onClose={() => setTrailerOpen(false)} />}
    </article>
  );
}

function TrailerDialog({ item, src, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (src) dialogRef.current?.showModal();
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [src]);
  return (
    <dialog
      ref={dialogRef}
      aria-label={`Трейлер: ${item.title}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
      onClose={onClose}
    >
      <div className="modal-shell">
        <button className="icon close-modal" type="button" aria-label="Закрыть окно" onClick={onClose}>×</button>
        <h2>Трейлер — {item.title}</h2>
        <iframe
          className="trailer-frame"
          src={src}
          title={`Трейлер: ${item.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <a className="text-link" href={item.trailer} target="_blank" rel="noopener noreferrer">Не запускается? Открыть видео ↗</a>
      </div>
    </dialog>
  );
}

function PreviewDialog({ item, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (item) dialogRef.current?.showModal();
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [item]);

  if (!item) return null;
  return (
    <dialog
      ref={dialogRef}
      aria-label={`Кратко о фильме: ${item.title}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
      onClose={onClose}
    >
      <div className="modal-shell preview-layout">
        <button className="icon close-modal" type="button" aria-label="Закрыть окно" onClick={onClose}>×</button>
        <Poster item={item} />
        <div>
          <p className="eyebrow">{item.type === "animation" ? "МУЛЬТФИЛЬМ" : "ФИЛЬМ"} / {item.year}</p>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <p>{item.genre} · {item.age || "Возраст не указан"}</p>
          <div className="actions">
            {safeUrl(item.links?.vk) && <a className="button primary" href={safeUrl(item.links.vk)} target="_blank" rel="noopener noreferrer">Смотреть</a>}
            <a className="button secondary" href={getItemUrl(item)}>Подробнее ↗</a>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function Catalog({ defaultType = "all", onPreview, standalone = false }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(defaultType);
  const [genres, setGenres] = useState([]);
  const [sort, setSort] = useState("new");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  useEffect(() => {
    const applyMood = (event) => {
      setQuery("");
      setType("all");
      setGenres(event.detail ? [event.detail] : []);
      setSuggestionsOpen(false);
    };
    window.addEventListener("kinofun:mood", applyMood);
    return () => window.removeEventListener("kinofun:mood", applyMood);
  }, []);
  const uniqueGenres = useMemo(
    () => [...new Set(ITEMS.map((item) => item.genre))].sort((a, b) => a.localeCompare(b, "ru")),
    [],
  );
  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("ru");
    const items = ITEMS.filter((item) =>
      (type === "all" || item.type === type)
      && (!genres.length || genres.some((genre) =>
        item.genre.toLocaleLowerCase("ru").includes(genre.toLocaleLowerCase("ru"))))
      && (!search || [item.title, item.details?.originalTitle]
        .filter(Boolean)
        .some((title) => title.toLocaleLowerCase("ru").includes(search))),
    );
    return items.sort(sort === "title"
      ? (a, b) => a.title.localeCompare(b.title, "ru")
      : sort === "year"
        ? (a, b) => b.year - a.year
        : (a, b) => Number(b.isNew) - Number(a.isNew) || b.year - a.year);
  }, [genres, query, sort, type]);
  const suggestions = query.trim()
    ? filtered.slice(0, 6)
    : [];

  const toggleGenre = (genre) => setGenres((current) =>
    current.includes(genre) ? current.filter((value) => value !== genre) : [...current, genre],
  );
  const reset = () => {
    setQuery("");
    setType(defaultType);
    setGenres([]);
    setSort("new");
    setSuggestionsOpen(false);
  };

  return (
    <section className={`section${standalone ? "" : " catalog-section"}`} id="catalog">
      <div className="section-title reveal">
        <div>
          <p className="eyebrow">{standalone ? "МИРЫ, ГДЕ ВОЗМОЖНО ВСЁ" : "МАЛЕНЬКИЙ ВЫБОР — БОЛЬШОЕ ПУТЕШЕСТВИЕ"}</p>
          <h1>{standalone ? <>Каталог <em>мультфильмов</em></> : <>Ваша следующая <em>история</em></>}</h1>
          <p className="muted">Ищите историю, изучайте подробности и выбирайте просмотр.</p>
        </div>
        {!standalone && <span className="muted">Фильмы и мультфильмы</span>}
      </div>
      {standalone && <a className="button secondary" href="/#catalog">← Весь каталог</a>}
      <div className="catalog-tools">
        <div className="search-wrap">
          <label className="sr-only" htmlFor="search">Найти материал</label>
          <input
            id="search"
            type="search"
            placeholder="Название фильма или мультфильма…"
            role="combobox"
            aria-expanded={suggestionsOpen && suggestions.length > 0}
            aria-controls="suggestions"
            aria-autocomplete="list"
            autoComplete="off"
            value={query}
            onFocus={() => setSuggestionsOpen(true)}
            onChange={(event) => { setQuery(event.target.value); setSuggestionsOpen(true); }}
            onKeyDown={(event) => { if (event.key === "Escape") setSuggestionsOpen(false); }}
          />
          {suggestionsOpen && suggestions.length > 0 && (
            <ul id="suggestions" role="listbox">
              {suggestions.map((item) => (
                <li key={item.id} role="option" aria-selected="false">
                  <button type="button" onClick={() => { setSuggestionsOpen(false); onPreview(item); }}>
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label className="sort">
          <span className="sr-only">Сортировка</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="new">Сначала новинки</option>
            <option value="year">По году выпуска</option>
            <option value="title">По названию</option>
          </select>
        </label>
      </div>
      <div className="filters" role="group" aria-label="Тип материала">
        {[["all", "Все истории"], ["film", "Фильмы"], ["animation", "Мультфильмы"]].map(([value, label]) => (
          <button
            key={value}
            type="button"
            data-type={value}
            className={type === value ? "active" : ""}
            aria-pressed={type === value}
            onClick={() => setType(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="genres" role="group" aria-label="Жанры">
        {uniqueGenres.map((genre) => (
          <button
            key={genre}
            className={`chip${genres.includes(genre) ? " active" : ""}`}
            type="button"
            aria-pressed={genres.includes(genre)}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      <p className="muted" aria-live="polite">Найдено историй: <strong>{filtered.length}</strong></p>
      <div className="cards" id={standalone ? "cartoons-grid" : "catalog-grid"}>
        {filtered.map((item, index) => <MovieCard key={item.id} item={item} onPreview={onPreview} priority={index < 4} />)}
      </div>
      {!filtered.length && (
        <div className="empty">
          <h3>История пока не нашлась</h3>
          <p>Попробуйте другое название или сбросьте фильтры.</p>
          <button className="button secondary" type="button" onClick={reset}>Сбросить фильтры</button>
        </div>
      )}
    </section>
  );
}

function HomePage({ onPreview }) {
  const newest = ITEMS.filter((item) => item.isNew).slice(0, 3);
  const [randomItem, setRandomItem] = useState(null);
  const chooseMood = (genre) => {
    const section = document.getElementById("catalog");
    window.dispatchEvent(new CustomEvent("kinofun:mood", { detail: genre }));
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> ВАШ ЛИЧНЫЙ КИНОМИР</p>
          <h1>Не просто вечер.<br />Начало <em>истории.</em></h1>
          <p className="hero-sub">Истории, которые остаются с вами.</p>
          <div className="actions">
            <a className="button primary" href="#catalog">Найти своё кино <span>↗</span></a>
            <button className="button secondary" type="button" onClick={() => setRandomItem(ITEMS[Math.floor(Math.random() * ITEMS.length)])}>⚄ Случайный выбор</button>
          </div>
          <div className="hero-stats">
            <div><strong>{ITEMS.length}</strong><span>историй в каталоге</span></div>
            <div><strong>{ITEMS.filter((item) => item.isNew).length}</strong><span>новых историй</span></div>
            <div><strong>∞</strong><span>поводов собраться</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit o1" /><div className="orbit o2" />
          <div className="hero-card rear"><span>ФЭНТЕЗИ / 2026</span><b>ПРАКТИЧЕСКАЯ<br />МАГИЯ 2</b><i>✦</i></div>
          <div className="hero-card front"><span>БОЕВИК / 2026</span><div className="portal" /><b>НАТИСК</b><small>БЕГСТВО ИЗ СЕКРЕТНОЙ ЛАБОРАТОРИИ</small></div>
          <div className="floating-label">✦ Следующая любимая история — здесь</div>
        </div>
        <a className="scroll-cue" href="#new">ЛИСТАЙТЕ, ЧТОБЫ ОТКРЫТЬ БОЛЬШЕ ↓</a>
      </section>
      <div className="ticker" aria-hidden="true"><div>ФАНТАСТИКА ✦ ПРИКЛЮЧЕНИЯ ✦ СЕМЕЙНЫЙ ВЕЧЕР ✦ ДРАМА ✦ КОМЕДИЯ ✦ АНИМАЦИЯ ✦ ФАНТАСТИКА ✦ ПРИКЛЮЧЕНИЯ ✦ СЕМЕЙНЫЙ ВЕЧЕР ✦ ДРАМА ✦ КОМЕДИЯ ✦ АНИМАЦИЯ ✦</div></div>
      <section className="section" id="new">
        <div className="section-title reveal"><div><p className="eyebrow">СВЕЖИЙ ВЗГЛЯД</p><h2>Новые <em>впечатления</em></h2></div><a className="text-link" href="#catalog">Весь каталог ↗</a></div>
        <div className="cards featured">{newest.map((item, index) => <MovieCard key={item.id} item={item} onPreview={onPreview} priority={index === 0} />)}</div>
      </section>
      <section className="section mood-section reveal">
        <div><p className="eyebrow">СЕГОДНЯ ХОЧЕТСЯ…</p><h2>Выберите настроение.<br /><em>Мы найдём историю.</em></h2></div>
        <div className="moods">
          <button type="button" onClick={() => chooseMood("Приключения")}>↗<b>Отправиться в путь</b><span>Приключения</span></button>
          <button type="button" onClick={() => chooseMood("Семейный")}>✦<b>Собраться вместе</b><span>Для всей семьи</span></button>
          <button type="button" onClick={() => chooseMood("Комедия")}>☺<b>Просто улыбнуться</b><span>Комедии</span></button>
          <button type="button" onClick={() => chooseMood("Драма")}>◒<b>Почувствовать больше</b><span>Драмы</span></button>
        </div>
      </section>
      <Catalog onPreview={onPreview} />
      <section className="section random-banner reveal">
        <div className="random-symbol" aria-hidden="true">⚄</div>
        <div><p className="eyebrow">ПОЗВОЛЬТЕ СЛУЧАЮ РЕШИТЬ</p><h2>А если самое интересное —<br /><em>то, что вы не искали?</em></h2><p className="muted">Один клик. Случайная история. Неожиданно хороший вечер.</p>
          <button className="button primary" type="button" onClick={() => setRandomItem(ITEMS[Math.floor(Math.random() * ITEMS.length)])}>Удивите меня ↗</button>
        </div>
      </section>
      <section className="section">
        <div className="section-title reveal"><div><p className="eyebrow">ТРИ ПРОСТЫХ ШАГА</p><h2>От выбора <em>к просмотру</em></h2></div></div>
        <div className="steps">
          <article className="glass reveal"><span>01 /</span><h3>Найдите свою историю</h3><p>Выберите жанр, воспользуйтесь поиском или доверьтесь случайному выбору.</p></article>
          <article className="glass reveal"><span>02 /</span><h3>Нажмите «Смотреть»</h3><p>Если для фильма есть ссылка, она откроется на ВКонтакте.</p></article>
          <article className="glass reveal"><span>03 /</span><h3>Устройтесь поудобнее</h3><p>Перейдите по добавленной владельцем ссылке и наслаждайтесь историей.</p></article>
        </div>
      </section>
      <section className="section community reveal">
        <p className="eyebrow">НЕ ТЕРЯЕМСЯ ПОСЛЕ ТИТРОВ</p><h2>Больше кино.<br /><em>Ближе друг к другу.</em></h2>
        <p>Обновления каталога и новые подборки — в наших сообществах.</p>
        <div className="actions"><a className="button primary" href={CONTACTS.vk} target="_blank" rel="noopener noreferrer">ВКонтакте ↗</a><a className="button secondary" href="/support.html">Связаться с поддержкой ↗</a></div>
      </section>
      {randomItem && <PreviewDialog item={randomItem} onClose={() => setRandomItem(null)} />}
    </main>
  );
}

function AboutPage() {
  return (
    <main id="main">
      <section className="section">
        <p className="eyebrow">БОЛЬШЕ, ЧЕМ КАТАЛОГ</p><h1>Истории <em>объединяют.</em></h1><p className="lead">{SITE.story}</p>
        <div className="stats-panel glass"><div><strong>{ITEMS.length}</strong><span>историй в каталоге</span></div><div className="vk-stat"><span>Подписчики сообщества VK</span><VkCommunityWidget /></div></div>
      </section>
      <section className="section"><p className="eyebrow">НАША ИСТОРИЯ</p><h2>От идеи <em>к сообществу</em></h2><div className="timeline">{SITE.milestones.map((milestone, index) => <article className="reveal" key={milestone.title}><small>ЭТАП 0{index + 1}</small><h3>{milestone.title}</h3><p className="muted">{milestone.description}</p></article>)}</div></section>
      <section className="section"><p className="eyebrow">ПО ТУ СТОРОНУ ЭКРАНА</p><h2>Знакомьтесь: <em>ваша команда</em></h2>
        <div className="steps">
          <article className="glass reveal"><span>◈</span><h3>Автор канала</h3><p>КиноФан — самостоятельный проект: каталог развивается, чтобы сделать выбор фильма простым и приятным.</p></article>
          <article className="glass reveal"><span>✦</span><h3>Редактор подборок</h3><p>В каталоге появляются интересные фильмы и мультфильмы, описания, постеры, трейлеры и ссылки.</p></article>
          <article className="glass reveal"><span>♡</span><h3>Наши зрители</h3><p>Вы помогаете КиноФан становиться лучше: смотрите, обсуждаете и подсказываете, что добавить.</p></article>
        </div>
      </section>
      <section className="section narrow"><p className="eyebrow">НАШИ ДОГОВОРЁННОСТИ</p><h2>Вместе <em>комфортнее</em></h2><div className="glass"><p>01. Уважайте других участников и их мнение.</p><p>02. Предупреждайте о спойлерах.</p><p>03. Делитесь только разрешёнными ссылками.</p><p>04. Сообщайте автору о неработающих материалах.</p></div><a className="button primary" href={CONTACTS.vkChat} target="_blank" rel="noopener noreferrer">Присоединиться к разговору</a></section>
    </main>
  );
}

function VkCommunityWidget() {
  const widgetRef = useRef(null);

  useEffect(() => {
    const widget = widgetRef.current;
    if (!widget) return undefined;

    let script = document.getElementById("vk-openapi");
    const renderWidget = () => {
      if (widget.isConnected && window.VK?.Widgets) {
        window.VK.Widgets.Group(
          widget.id,
          { mode: 3, width: "auto" },
          SITE.vkGroupId,
        );
      }
    };

    if (window.VK?.Widgets) {
      renderWidget();
      return () => widget.replaceChildren();
    }

    if (!script) {
      script = document.createElement("script");
      script.id = "vk-openapi";
      script.src = "https://vk.com/js/api/openapi.js?169";
      script.async = true;
      document.head.append(script);
    }

    script.addEventListener("load", renderWidget);
    return () => {
      script.removeEventListener("load", renderWidget);
      widget.replaceChildren();
    };
  }, []);

  return (
    <div className="vk-community-widget">
      <div className="vk-widget-mount" id="vk-community-widget" ref={widgetRef} />
      <a href={CONTACTS.vk} target="_blank" rel="noopener noreferrer">
        Открыть сообщество ↗
      </a>
    </div>
  );
}

function FaqPage({ onToast }) {
  const [query, setQuery] = useState("");
  const entries = faqEntries.filter(([question, answer]) => `${question} ${answer}`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru")));
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      onToast("Ответ скопирован.");
    } catch {
      onToast("Не удалось скопировать. Выделите текст и скопируйте его вручную.");
    }
  };
  return (
    <main id="main"><section className="section narrow">
      <p className="eyebrow">ВСЁ ПОНЯТНО</p><h1>Есть <em>вопрос?</em></h1><p className="lead">Здесь собраны ответы, которые помогут быстрее начать просмотр.</p>
      <label htmlFor="faq-search">Поиск по вопросам</label><input id="faq-search" type="search" placeholder="Например: фильм или ссылка" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="faq-list">{entries.map(([question, answer]) => <details className="faq-item reveal" key={question}><summary>{question}</summary><div className="answer"><p>{answer}</p><button type="button" className="text-link" onClick={() => copy(answer)}>Скопировать ответ ↗</button></div></details>)}</div>
      {!entries.length && <p>Ничего не найдено. Попробуйте другой запрос.</p>}
      <a className="button primary" href="/support.html">Связаться с поддержкой ↗</a>
    </section></main>
  );
}

function SupportPage() {
  const [result, setResult] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setResult("Форма демонстрационная, сообщение не отправлено. Для связи воспользуйтесь кнопками мессенджеров.");
  };
  return (
    <main id="main"><section className="section">
      <p className="eyebrow">ПОМОЩЬ РЯДОМ</p><h1>Давайте <em>разберёмся.</em></h1><p className="lead">Не работает ссылка, есть идея для подборки или просто вопрос? Выберите удобный способ связи.</p>
      <div className="steps contacts">
        {[["MAX", "max"], ["Telegram", "telegram"], ["VK", "vkChat"]].map(([name, key]) => <article className="glass reveal" key={key}><span className="contact-symbol wordmark" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span><h2>{name}</h2><p>Вопросы, предложения и обратная связь.</p><a className="button secondary" href={CONTACTS[key]} target="_blank" rel="noopener noreferrer">Написать ↗</a></article>)}
      </div>
      <div className="random-banner support-community reveal"><div className="random-symbol" aria-hidden="true">✦</div><div><p className="eyebrow">КИНОФАН — ЭТО ПРО ВЫБОР И ОБЩЕНИЕ</p><h2>Найдите историю.<br /><em>Обсудите её вместе.</em></h2><p className="muted">В каталоге — фильмы, мультфильмы, описания и трейлеры. В сообществе можно следить за обновлениями и делиться впечатлениями.</p><div className="actions"><a className="button primary" href="/cartoons.html">Открыть каталог</a><a className="button secondary" href={CONTACTS.vkChat} target="_blank" rel="noopener noreferrer">Чат VK</a></div></div></div>
      <div className="support-layout"><div><p className="eyebrow">НАПИШИТЕ НАМ</p><h2>Каждый вопрос<br /><em>имеет значение.</em></h2><p className="muted">Форма демонстрационная: сообщения не отправляются и не сохраняются. Свяжитесь с автором через кнопки мессенджеров выше.</p></div>
        <form className="glass" onSubmit={submit}><label htmlFor="person">Имя</label><input id="person" name="person" required autoComplete="name" /><label htmlFor="contact">Контакт для ответа</label><input id="contact" name="contact" required /><label htmlFor="message">Сообщение</label><textarea id="message" name="message" required rows="5" /><button className="button primary" type="submit">Проверить поля</button><p className="muted" role="status" aria-live="polite">{result}</p></form>
      </div>
    </section></main>
  );
}

function MoviePage({ item, onPreview }) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const seo = item
    ? getSeoMetadata(`/movie/${encodeURIComponent(item.id)}/`)
    : getSeoMetadata("/movie.html", "?id=missing");
  useDocumentMetadata(seo);
  if (!item) return <main id="main"><section className="section" id="movie-detail"><h1>Материал не найден</h1><p className="muted">Выберите историю из каталога.</p><a className="button primary" href="/#catalog">Вернуться в каталог</a></section></main>;
  const similar = ITEMS.filter((candidate) => candidate.id !== item.id && (candidate.genre === item.genre || candidate.type === item.type)).slice(0, 3);
  const trailerEmbed = youtubeEmbedUrl(item.trailer) || vkTrailerEmbedUrl(item.trailer);
  return (
    <main id="main"><section className="section" id="movie-detail">
      <a className="button secondary back-to-catalog" href="/#catalog">← Весь каталог</a>
      <div className="detail-layout"><Poster item={item} priority /><div>
        <p className="eyebrow">{item.type === "animation" ? "АНИМАЦИЯ" : "КИНО"}</p><h1>{item.title}</h1>
        <div className="facts">{[item.year, item.genre, item.age].filter(Boolean).map((fact) => <span key={fact}>{fact}</span>)}</div>
        <p className="description">{item.description}</p>
        {(item.team?.director || item.team?.cast) && <div className="team"><h3>Кто в команде</h3>{item.team.director && <p>Режиссёр: {item.team.director}</p>}{item.team.cast && <p>Актёры / озвучка: {item.team.cast}</p>}</div>}
        {item.details?.synopsis && <div className="team movie-synopsis"><h3>Подробности сюжета</h3><p>{item.details.synopsis}</p></div>}
        <div className="actions">{safeUrl(item.links?.vk) && <a className="button primary" href={safeUrl(item.links.vk)} target="_blank" rel="noopener noreferrer">Смотреть ↗</a>}{trailerEmbed ? <button className="button secondary" type="button" onClick={() => setTrailerOpen(true)}>Трейлер</button> : safeUrl(item.trailer) && <a className="button secondary" href={safeUrl(item.trailer)} target="_blank" rel="noopener noreferrer">Трейлер ↗</a>}<button className="button secondary" type="button" onClick={() => onPreview(item)}>Кратко о фильме</button></div>
      </div></div>
      <div className="team"><h2>Информация о фильме</h2>{[["Оригинальное название", item.details?.originalTitle], ["Дата выхода", item.details?.releaseDate], ["Продолжительность", item.details?.runtime], ["Страна", item.details?.country], ["Язык", item.details?.language], ["Возрастная классификация", item.details?.classification], ["Сценарий", item.details?.screenplay], ["Дистрибьютор", item.details?.distribution]].filter(([, value]) => value).map(([label, value]) => <p key={label}>{label}: {value}</p>)}</div>
    </section>{similar.length > 0 && <section className="section"><h2>Похожие <em>истории</em></h2><div className="cards">{similar.map((entry) => <MovieCard key={entry.id} item={entry} onPreview={onPreview} />)}</div></section>}{trailerOpen && <TrailerDialog item={item} src={trailerEmbed} onClose={() => setTrailerOpen(false)} />}</main>
  );
}

const editorFields = [
  ["title", "Название", "text", true],
  ["type", "Тип", "select", true],
  ["year", "Год выпуска", "number", true],
  ["genre", "Жанр", "text", true],
  ["age", "Возрастная категория", "text"],
  ["description", "Описание", "textarea", true],
  ["poster", "Ссылка на постер или путь к файлу", "text"],
  ["poster2x", "Версия постера высокого разрешения (2×)", "text"],
  ["palette", "Цвет заглушки", "select"],
  ["director", "Режиссёр", "text"],
  ["cast", "Актёры / озвучка", "text"],
  ["vk", "Ссылка ВКонтакте", "url"],
  ["trailer", "Ссылка на трейлер", "url"],
];
const emptyDraft = () => ({
  title: "",
  type: "film",
  year: new Date().getFullYear(),
  genre: "",
  age: "",
  description: "",
  poster: "",
  poster2x: "",
  palette: "violet",
  director: "",
  cast: "",
  vk: "",
  trailer: "",
  isNew: false,
});

function AdminPage({ onToast }) {
  const [draft, setDraft] = useState(() => ITEMS.map((item) => ({ ...item })));
  const [form, setForm] = useState(emptyDraft);
  const [posterFile, setPosterFile] = useState("");
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState("");
  const [exportText, setExportText] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ks-draft");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setDraft(parsed);
      } else {
        setStatus("Не удалось загрузить сохранённый черновик: данные имеют неверный формат.");
      }
    } catch {
      setStatus("Не удалось загрузить сохранённый черновик из хранилища браузера.");
    }
  }, []);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };
  const persist = (next) => {
    setDraft(next);
    try {
      localStorage.setItem("ks-draft", JSON.stringify(next));
      setStatus("Черновик сохранён в этом браузере. Для публикации экспортируйте данные.");
    } catch {
      setStatus("Не удалось сохранить черновик: хранилище браузера недоступно или переполнено. Экспортируйте данные перед закрытием страницы.");
    }
  };
  const reset = () => { setForm(emptyDraft()); setPosterFile(""); setEditingId(""); setStatus(""); };
  const submit = (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    for (const key of ["poster", "poster2x", "vk", "trailer"]) {
      if (form[key] && !safeUrl(form[key])) {
        setStatus(`Проверьте ссылку в поле «${key}»: используйте полный адрес https://.`);
        return;
      }
    }
    const old = draft.find((item) => item.id === editingId);
    const item = {
      ...old,
      ...form,
      id: editingId || form.title.toLocaleLowerCase("ru").replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "") || `material-${Date.now()}`,
      year: Number(form.year),
      poster: posterFile || form.poster || old?.poster || "",
      poster2x: form.poster2x || old?.poster2x || "",
      team: { ...old?.team, director: form.director, cast: form.cast },
      details: old?.details || {},
      links: { ...old?.links, vk: form.vk },
      trailer: form.trailer,
    };
    const next = editingId ? draft.map((entry) => entry.id === editingId ? item : entry) : [...draft, item];
    persist(next);
    reset();
  };
  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      ...emptyDraft(),
      ...item,
      palette: paletteNames.includes(item.palette) ? item.palette : "violet",
      poster: item.poster?.startsWith("data:") ? "" : item.poster || "",
      director: item.team?.director || "",
      cast: item.team?.cast || "",
      vk: item.links?.vk || item.vk || "",
      trailer: item.trailer || "",
    });
    setPosterFile(item.poster?.startsWith("data:") ? item.poster : "");
    document.getElementById("editor")?.scrollIntoView({ behavior: "smooth" });
  };
  const exportItems = async () => {
    const text = `export const ITEMS = ${JSON.stringify(draft, null, 2)};`;
    setExportText(text);
    try {
      await navigator.clipboard.writeText(text);
      onToast("Данные каталога скопированы. В data.js замените массив ITEMS.");
    } catch {
      onToast("Скопируйте данные из поля экспорта вручную.");
    }
  };

  return (
    <main id="main"><section className="section">
      <p className="eyebrow">МАСТЕРСКАЯ КАТАЛОГА</p><h1>Панель <em>владельца</em></h1><p className="lead">Это локальный редактор. Черновики сохраняются в этом браузере, публикация выполняется через экспорт данных.</p>
      <p className="notice">Редактор не является защищённой административной системой. Не размещайте его как приватную панель без авторизации.</p>
      <div className="admin-layout">
        <form id="editor" className="glass" onSubmit={submit}>
          <h2>{editingId ? "Редактирование материала" : "Новый материал"}</h2>
          {editorFields.map(([name, label, kind, required]) => <React.Fragment key={name}><label htmlFor={`edit-${name}`}>{label}</label>{kind === "textarea"
            ? <textarea id={`edit-${name}`} name={name} rows="4" required={required} value={form[name]} onChange={update} />
            : kind === "select"
              ? <select id={`edit-${name}`} name={name} value={form[name]} required={required} onChange={update}>{(name === "type" ? [["film", "Фильм"], ["animation", "Мультфильм"]] : paletteNames.map((color) => [color, color])).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select>
              : <input id={`edit-${name}`} name={name} type={kind} required={required} min={name === "year" ? "1888" : undefined} max={name === "year" ? String(new Date().getFullYear() + 5) : undefined} value={form[name]} onChange={(event) => { if (name === "poster") setPosterFile(""); update(event); }} />}</React.Fragment>)}
                  <label htmlFor="poster-file">Или выберите постер с компьютера</label>
                  <input
                    id="poster-file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
                        setStatus("Выберите файл PNG, JPEG, WebP или GIF.");
                        event.target.value = "";
                        return;
                      }
                      if (file.size > 3 * 1024 * 1024) {
                        setStatus("Изображение слишком большое. Выберите файл до 3 МБ.");
                        event.target.value = "";
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setPosterFile(reader.result);
                          setStatus("Изображение загружено. Сохраните материал.");
                        }
                      };
                      reader.onerror = () => setStatus("Не удалось прочитать файл изображения.");
                      reader.readAsDataURL(file);
                    }}
                  />
                  {(posterFile || form.poster) && <img id="poster-preview" src={posterFile || imageUrl(form.poster)} alt="Предпросмотр выбранного постера" />}
          <label className="check-label"><input type="checkbox" name="isNew" checked={form.isNew} onChange={update} /> Показывать метку «Новинка»</label>
          <div className="actions"><button className="button primary" type="submit">Сохранить материал</button><button className="button secondary" type="button" onClick={reset}>Очистить</button></div>
          <p id="editor-status" role="status" aria-live="polite">{status}</p>
        </form>
        <div><div className="section-title"><h2>Материалы</h2><button type="button" className="button secondary" onClick={exportItems}>Скопировать данные ↗</button></div>
          <div id="admin-list">{draft.map((item) => <div className="admin-row" key={item.id}><b>{item.title}</b><button type="button" className="text-link" onClick={() => edit(item)}>Изменить</button><button type="button" className="text-link" onClick={() => { if (window.confirm(`Удалить «${item.title}» из локального черновика?`)) persist(draft.filter((entry) => entry.id !== item.id)); }}>Удалить</button></div>)}</div>
          {exportText && <textarea className="share-value" aria-label="Экспорт данных каталога" readOnly value={exportText} onFocus={(event) => event.target.select()} />}
        </div>
      </div>
    </section></main>
  );
}

function App({ url }) {
  const [currentUrl, setCurrentUrl] = useState(() =>
    typeof window === "undefined"
      ? url || "/"
      : `${window.location.pathname}${window.location.search}${window.location.hash}`,
  );
  const location = new URL(
    currentUrl,
    BASE_URL,
  );
  const path = location.pathname;
  const search = location.search;
  const page = getPage(path);
  const movie = page === "movie" ? getItemByPath(path, search) : null;
  const [theme, setTheme] = useState("dark");
  const [preview, setPreview] = useState(null);
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  useEffect(() => {
    setTheme(readTheme());
  }, []);
  useEffect(() => {
    const restoreRoute = () => setCurrentUrl(
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    );
    window.addEventListener("popstate", restoreRoute);
    return () => window.removeEventListener("popstate", restoreRoute);
  }, []);
  useEffect(() => {
    const hash = location.hash.slice(1);
    const timerId = window.setTimeout(() => {
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      } else if (!hash) {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        });
      }
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [currentUrl, location.hash]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const notify = (message) => {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(""), 4500);
  };
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.body.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("ks-theme", next);
    } catch {
      notify("Не удалось сохранить тему. Она останется включённой до закрытия страницы.");
    }
  };
  const handleNavigation = (event) => {
    if (event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element
      ? event.target.closest("a[href]")
      : null;
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    event.preventDefault();
    const nextUrl = `${destination.pathname}${destination.search}${destination.hash}`;
    if (nextUrl === currentUrl) {
      if (destination.hash) {
        document.getElementById(destination.hash.slice(1))?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      }
      return;
    }
    window.history.pushState(null, "", nextUrl);
    setCurrentUrl(nextUrl);
    setPreview(null);
  };

  const pageMeta = getSeoMetadata(path, search);
  useDocumentMetadata(pageMeta);

  return (
    <div className="site-shell" onClick={handleNavigation}>
      <a className="skip-link" href="#main">К содержимому</a>
      <SkyCanvas />
      <div className="cursor-glow" aria-hidden="true" />
      <div className="reading-progress" aria-hidden="true" />
      <Header page={page} theme={theme} onToggleTheme={toggleTheme} />
      {page === "index" && <HomePage onPreview={setPreview} />}
      {page === "about" && <AboutPage />}
      {page === "cartoons" && <main id="main"><Catalog defaultType="animation" onPreview={setPreview} standalone /></main>}
      {page === "faq" && <FaqPage onToast={notify} />}
      {page === "support" && <SupportPage />}
      {page === "movie" && <MoviePage item={movie} onPreview={setPreview} />}
      {page === "admin" && <AdminPage onToast={notify} />}
      <Footer />
      <a className="back-top icon" href="#top" aria-label="Наверх">↑</a>
      {toast && <div className="toasts" role="status" aria-live="polite"><div className="toast">{toast}</div></div>}
      <PreviewDialog item={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

export default App;
