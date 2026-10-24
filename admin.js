/* Локальный редактор каталога. Откройте admin.html напрямую, сохраните материалы и скопируйте массив ITEMS в data.js. */
(() => {
  "use strict";
  const C = window.Cinema,
    form = document.getElementById("editor");
  if (!C || !form) return;
  const $ = (s) => document.querySelector(s),
    fields = $("#editor-fields");
  let draft = [],
    filePoster = "",
    readerToken = 0;
  try {
    const saved = JSON.parse(C.storage.get("draft") || "null");
    draft = Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string",
        )
      : JSON.parse(JSON.stringify(ITEMS));
  } catch {
    draft = JSON.parse(JSON.stringify(ITEMS));
  };
  const specs = 
    ["title", "Название", "text"],
    ["type", "Тип", "select", ["film", "animation"], ["Фильм", "Мультфильм"]],
    ["year", "Год выпуска", "number"],
    ["genre", "Жанр", "text"],
    ["age", "Возрастная категория", "text"],
    ["description", "Описание", "textarea"],
    ["poster", "Ссылка на постер или путь images/poster.jpg", "text"],
    [
      "palette",
      "Цвет заглушки",
      "select",
      ["violet", "gold", "blue", "green", "pink", "orange"],
      ["Фиолетовый", "Золотой", "Синий", "Зелёный", "Розовый", "Оранжевый"],
    ],
    ["director", "Режиссёр", "text"],
    ["cast", "Актёры / озвучка", "text"],
    ...Object.entries({
      telegram: "Ссылка Telegram",
      vk: "Ссылка ВКонтакте",
      max: "Ссылка MAX",
      whatsapp: "Ссылка WhatsApp",
      other: "Другой источник",
    }).map(([key, label]) => [key, label, "url"]),
  specs.forEach(([key, label, type, values, labels]) => {
    const l = C.el("label", "", label);
    l.htmlFor = "edit-" + key;
    let input;
    if (type === "select") {
      input = C.el("select");
      values.forEach((value, index) => {
        const option = C.el("option", "", labels[index]);
        option.value = value;
        input.append(option);
      });
    } else if (type === "textarea") {
      input = C.el("textarea");
      input.rows = 4;
    } else {
      input = C.el("input");
      input.type = type;
    }
    input.name = key;
    input.id = l.htmlFor;
    if (["title", "year", "genre", "description"].includes(key))
      input.required = true;
    if (key === "year") {
      input.min = "1888";
      input.max = String(new Date().getFullYear() + 5);
    }
    fields.append(l, input);
  });
  const newLabel = C.el("label", "check-label");
  const newInput = C.el("input");
  newInput.type = "checkbox";
  newInput.name = "isNew";
  newLabel.append(
    newInput,
    document.createTextNode(" Показывать метку «Новинка»"),
  );
  fields.append(newLabel);
  function status(text) {
    $("#editor-status").textContent = text;
  }
  function persist() {
    const ok = C.storage.set("draft", JSON.stringify(draft));
    status(
      ok
        ? "Черновик сохранён в этом браузере. Для публикации скопируйте данные."
        : "Браузер не сохранил черновик: хранилище недоступно или переполнено. Скопируйте данные перед закрытием страницы.",
    );
  }
  function preview(value) {
    const url = C.imageUrl(value),
      img = $("#poster-preview");
    img.hidden = !url;
    if (url) img.src = url;
    else img.removeAttribute("src");
  }
  $("#poster-preview").addEventListener("error", () => {
    $("#poster-preview").hidden = true;
    status("Изображение не открылось. Проверьте путь или ссылку.");
  });
  function reset() {
    readerToken++;
    form.reset();
    form.elements.id.value = "";
    filePoster = "";
    preview("");
    form.elements.year.value = new Date().getFullYear();
    $("#editor-title").textContent = "Новый материал";
    status("");
  }
  function render() {
    const list = $("#admin-list");
    list.replaceChildren();
    draft.forEach((item) => {
      const row = C.el("div", "admin-row");
      row.append(C.el("b", "", item.title));
      row.append(
        C.button(
          "Изменить",
          () => {
            reset();
            form.elements.id.value = item.id;
            for (const [key] of specs) {
              const value =
                key in (item.links || {})
                  ? item.links[key]
                  : ["director", "cast"].includes(key)
                    ? item.team?.[key]
                    : item[key];
              form.elements[key].value = value ?? "";
            }
            form.elements.isNew.checked = !!item.isNew;
            if (item.poster?.startsWith("data:")) {
              filePoster = item.poster;
              form.elements.poster.value = "";
            }
            preview(item.poster);
            $("#editor-title").textContent = "Редактирование материала";
            form.scrollIntoView({
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
            form.elements.title.focus();
          },
          "text-link",
        ),
      );
      row.append(
        C.button(
          "Удалить",
          () => {
            const text = C.el(
              "p",
              "",
              "Удалить «" + item.title + "» из локального черновика?",
            );
            C.showModal("Удалить материал?", [
              text,
              C.button(
                "Удалить",
                () => {
                  draft = draft.filter((entry) => entry.id !== item.id);
                  if (form.elements.id.value === item.id) reset();
                  persist();
                  render();
                  C.closeModal();
                },
                "button primary",
              ),
              C.button("Отмена", C.closeModal),
            ]);
          },
          "text-link",
        ),
      );
      list.append(row);
    });
    if (!draft.length)
      list.append(
        C.el("p", "muted", "Черновик пуст. Добавьте первый материал."),
      );
  }
  form.elements.poster.addEventListener("input", () => {
    readerToken++;
    filePoster = "";
    $("#poster-file").value = "";
    preview(form.elements.poster.value);
  });
  $("#poster-file").addEventListener("change", () => {
    const file = $("#poster-file").files[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
      status("Выберите изображение PNG, JPEG, WebP или GIF.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      status(
        "Изображение слишком большое. Выберите файл до 3 МБ, чтобы черновик помещался в хранилище.",
      );
      return;
    }
    const token = ++readerToken;
    const reader = new FileReader();
    reader.onload = () => {
      if (token !== readerToken) return;
      filePoster = String(reader.result);
      form.elements.poster.value = "";
      preview(filePoster);
      status("Изображение прочитано локально. Теперь сохраните материал.");
    };
    reader.onerror = () => status("Не удалось прочитать файл.");
    reader.readAsDataURL(file);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const f = form.elements;
    for (const key of ["title", "genre", "description"])
      if (!f[key].value.trim()) {
        f[key].focus();
        status("Обязательные поля не могут состоять из пробелов.");
        return;
      }
    const links = {};
    for (const key of ["telegram", "vk", "max", "whatsapp", "other"]) {
      const raw = f[key].value.trim();
      if (raw && !C.webUrl(raw)) {
        status("Укажите полную ссылку http:// или https://.");
        f[key].focus();
        return;
      }
      links[key] = raw;
    }
    const poster = filePoster || f.poster.value.trim();
    if (poster && !C.imageUrl(poster)) {
      status("Проверьте путь или адрес постера.");
      return;
    }
    const id =
      f.id.value ||
      "story-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 6);
    const item = {
      id,
      title: f.title.value.trim(),
      type: f.type.value,
      year: Number(f.year.value),
      genre: f.genre.value.trim(),
      age: f.age.value.trim(),
      description: f.description.value.trim(),
      poster,
      palette: f.palette.value,
      team: { director: f.director.value.trim(), cast: f.cast.value.trim() },
      links,
      isNew: f.isNew.checked,
    };
    const index = draft.findIndex((entry) => entry.id === id);
    if (index >= 0) draft[index] = item;
    else draft.push(item);
    reset();
    persist();
    render();
    C.toast("Материал добавлен в локальный черновик");
  });
  $("#editor-reset").addEventListener("click", reset);
  $("#export").addEventListener("click", () => {
    const intro = C.el(
      "p",
      "notice",
      "Другие посетители пока не видят эти изменения. В data.js замените весь блок const ITEMS = [...] на текст ниже. Настройки SITE и CONTACTS оставьте на месте.",
    );
    const area = C.el("textarea");
    area.id = "export-code";
    area.readOnly = true;
    area.setAttribute("aria-label", "Код массива GHBDTN");
    area.value = "const ITEMS = " + JSON.stringify(draft, null, 2) + ";";
    C.showModal("Данные для публикации", [
      intro,
      area,
      C.button(
        "Скопировать весь массив",
        async () => {
          if (!(await C.copyText(area.value))) {
            area.focus();
            area.select();
            C.toast("Нажмите Ctrl+C или выберите «Копировать»");
          }
        },
        "button primary",
      ),
    ]);
  });
  reset();
  render();
})();
