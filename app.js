const STORAGE_KEY = "life-coach-v1";

const PRACTICE_SUGGESTIONS = [
  "Прогулка",
  "Стакан воды",
  "Лечь вовремя",
  "Спокойная еда",
  "Растяжка",
  "Пранаяма",
  "Утро без телефона"
];

const AREA_HINTS = {
  мужа: "Забота, которую он заметит: слово, дело, время.",
  мамы: "Звонок, внимание или помощь — что было на самом деле.",
  папы: "Разговор, помощь или просто присутствие.",
  сына: "Время рядом, разговор или дело вместе.",
  дочери: "Время рядом, разговор или дело вместе.",
  себя: "То, что восстановило тебя, а не ещё одна обязанность.",
  семьи: "Что собрало вас, а не только быт.",
  дома: "Порядок, еда, тепло — дом стал чуть живее.",
  дела: "Шаг в работе, которая кормит и растит.",
  учебы: "Что узнал, прочитал или потренировал.",
  друзей: "Живой контакт, не отложенный на потом.",
  отдыха: "Настоящая пауза, после которой стало тише внутри.",
  родителей: "Внимание тем, кто растил тебя."
};

const AREA_SUGGESTIONS = [
  "мужа",
  "мамы",
  "сына",
  "себя",
  "дома",
  "дела",
  "учебы",
  "друзей",
  "отдыха",
  "дочери",
  "папы",
  "семьи"
];

const FINANCE_QUESTION = "Что ты сделал для своей финансовой свободы?";
const GOD_QUESTION = "Что ты сделал для Бога?";

const DEFAULT_HELPS = [
  "Душ",
  "Прогулка",
  "Сурья намаскар",
  "Выпить воды",
  "Позвонить близкому",
  "Лечь и закрыть глаза на 5 минут"
];

const CALM_LINES = [
  "Тебе не нужно сейчас решать всё. Достаточно этого момента.",
  "Ты уже выдержал многое. Этот час тоже можно пережить.",
  "Плохое чувство — не приговор. Оно меняется, даже если не верится.",
  "Можно просто дышать. Этого уже достаточно на ближайшие минуты.",
  "Ты не обязан быть сильным каждую секунду.",
  "Сейчас тяжело — и это правда. Правда ещё и в том, что ты здесь.",
  "Один маленький шаг лучше идеального плана.",
  "Телу нужна опора. Ноги на полу — уже начало.",
  "Не обязательно понимать, почему плохо. Можно просто позаботиться о себе.",
  "Ты можешь замедлиться. Мир подождёт пару минут.",
  "Даже в тумане можно сделать глоток воды.",
  "Ты не один в этом. Многие проходили похожее и выходили.",
  "Сейчас можно ничего не чинить. Только успокоить дыхание.",
  "Чувства приходят волнами. Эта волна тоже спадёт.",
  "Быть живым — уже смелость, когда внутри шторм.",
  "Можно выбрать одно простое действие и остальное отложить.",
  "Ты заслуживаешь мягкости к себе, особенно сейчас.",
  "Не сравнивай себя с «нормальным» днём. Сегодня другой день.",
  "Тишина и вода иногда работают лучше советов.",
  "Можно пережить следующие десять минут. Потом ещё десять.",
  "Твоя боль важна. И твоя жизнь тоже важна.",
  "Не надо быть идеальным, чтобы попросить опору.",
  "Сегодня достаточно не усугублять. Отдых — тоже действие.",
  "Если мысли скачут — верни внимание к выдоху.",
  "Ты уже сделал шаг: открыл эту страницу.",
  "Можно быть уставшим и всё равно беречь себя.",
  "Плохое настроение врёт, будто всё навсегда. Это не так.",
  "Разреши себе паузу без объяснений.",
  "Сначала тело, потом решения. Сначала спокойствие, потом дела.",
  "Ты справишься с этим куском пути. Не со всей дорогой сразу."
];

const BREATH_PRESETS = [
  { id: "444", label: "4 · 4 · 4", hint: "ровно", in: 4, hold: 4, out: 4, rest: 0 },
  { id: "478", label: "4 · 7 · 8", hint: "классика", in: 4, hold: 7, out: 8, rest: 0 },
  { id: "789", label: "7 · 8 · 9", hint: "длинный выдох", in: 7, hold: 8, out: 9, rest: 0 },
  { id: "7474", label: "7 · 4 · 7 · 4", hint: "квадрат", in: 7, hold: 4, out: 7, rest: 4 }
];

let state = load();
let selectedKey = todayKey();
let weekAnchor = startOfWeek(new Date());
const ui = {
  editingPracticeId: null,
  practiceDraft: "",
  areaDraft: "",
  goalTitleDraft: "",
  goalSignDraft: "",
  practiceError: "",
  areaError: "",
  goalError: "",
  tipsOpen: !state.tipsDismissed,
  feelOpen: false,
  moodChartOpen: false,
  moodMonth: "",
  sheet: "day",
  goodDraft: "",
  goodError: "",
  breathing: false,
  calmLine: 0,
  helpDraft: "",
  helpError: "",
  ground: [false, false, false, false, false],
  body: { wash: false, water: false, walk: false },
  breathSetup: false
};

const app = document.querySelector("#app");
let breathTimer = null;

function defaultState() {
  return {
    practices: [{ id: "surya", title: "Сурья намаскар" }],
    areas: [],
    goals: [],
    seasonStart: "",
    reviews: {},
    entries: {},
    tipsDismissed: false,
    helps: DEFAULT_HELPS.slice(),
    breath: normalizeBreath(null)
  };
}

function clampBreathSec(value, fallback, allowZero = false) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return fallback;
  const min = allowZero ? 0 : 1;
  return Math.min(20, Math.max(min, number));
}

function normalizeBreath(raw) {
  if (!raw) {
    const first = BREATH_PRESETS[0];
    return { preset: first.id, in: first.in, hold: first.hold, out: first.out, rest: first.rest };
  }
  const presetId = raw.preset || raw.id;
  const preset = BREATH_PRESETS.find((item) => item.id === presetId);
  if (preset && presetId !== "custom") {
    return {
      preset: preset.id,
      in: preset.in,
      hold: preset.hold,
      out: preset.out,
      rest: preset.rest
    };
  }
  return {
    preset: "custom",
    in: clampBreathSec(raw.in, 4),
    hold: clampBreathSec(raw.hold, 4, true),
    out: clampBreathSec(raw.out, 4),
    rest: clampBreathSec(raw.rest, 0, true)
  };
}

function breathPattern() {
  return normalizeBreath(state.breath);
}

function breathLabel(pattern = breathPattern()) {
  return pattern.rest > 0
    ? `${pattern.in} · ${pattern.hold} · ${pattern.out} · ${pattern.rest}`
    : `${pattern.in} · ${pattern.hold} · ${pattern.out}`;
}

function breathPhases(pattern = breathPattern()) {
  const phases = [{ id: "in", text: "Вдох", seconds: pattern.in }];
  if (pattern.hold > 0) phases.push({ id: "hold", text: "Задержи", seconds: pattern.hold });
  phases.push({ id: "out", text: "Выдох", seconds: pattern.out });
  if (pattern.rest > 0) phases.push({ id: "rest", text: "Пауза", seconds: pattern.rest });
  return phases;
}

function breathHint(pattern = breathPattern()) {
  const parts = [`вдох ${pattern.in}`];
  if (pattern.hold > 0) parts.push(`задержка ${pattern.hold}`);
  parts.push(`выдох ${pattern.out}`);
  if (pattern.rest > 0) parts.push(`пауза ${pattern.rest}`);
  return `${parts.join(", ")}. Можно повторять, пока станет чуть тише.`;
}

function normalizeHelps(list) {
  if (!Array.isArray(list)) return DEFAULT_HELPS.slice();
  const clean = list
    .map((item) => String(item || "").trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .slice(0, 12);
  return clean.length ? clean : DEFAULT_HELPS.slice();
}

function pickCalmLine(avoid = -1) {
  if (CALM_LINES.length === 1) return 0;
  let next = Math.floor(Math.random() * CALM_LINES.length);
  if (next === avoid) next = (next + 1) % CALM_LINES.length;
  return next;
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.practices) || !Array.isArray(data.areas)) return defaultState();
    return {
      practices: data.practices,
      areas: data.areas,
      goals: Array.isArray(data.goals) ? data.goals.slice(0, 3) : [],
      seasonStart: typeof data.seasonStart === "string" ? data.seasonStart : "",
      reviews: data.reviews && typeof data.reviews === "object" ? data.reviews : {},
      entries: data.entries && typeof data.entries === "object" ? data.entries : {},
      tipsDismissed: Boolean(data.tipsDismissed),
      helps: normalizeHelps(data.helps),
      breath: normalizeBreath(data.breath)
    };
  } catch {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function todayKey() {
  return dayKey(new Date());
}

function dayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfWeek(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatLong(date) {
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

function weekdayShort(date) {
  return ["вс", "пн", "вт", "ср", "чт", "пт", "сб"][date.getDay()];
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Доброе утро";
  if (hour < 18) return "Добрый день";
  return "Добрый вечер";
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blankEntry() {
  return { health: {}, finance: "", god: "", areas: {}, focus: "", focusGoal: "", restNote: "", mood: 0, goods: [] };
}

function goodsOf(key) {
  const entry = readEntry(key);
  if (Array.isArray(entry.goods)) {
    return entry.goods
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }
  const legacy = String(entry.good || "").trim();
  return legacy ? [legacy] : [];
}

function ensureGoods(key) {
  const entry = ensureEntry(key);
  if (!Array.isArray(entry.goods)) {
    const legacy = String(entry.good || "").trim();
    entry.goods = legacy ? [legacy] : [];
    delete entry.good;
  }
  return entry;
}

function bankGoods() {
  return Object.keys(state.entries)
    .sort((a, b) => (a < b ? 1 : -1))
    .flatMap((key) => goodsOf(key).map((text) => ({ key, text })))
    .slice(0, 60);
}

function moodOf(key) {
  const value = Number(readEntry(key).mood);
  return Number.isInteger(value) && value >= 1 && value <= 10 ? value : 0;
}

function monthStamp(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(stamp) {
  const [y, m] = stamp.split("-").map(Number);
  const text = new Date(y, m - 1, 1).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  return text.charAt(0).toLocaleUpperCase("ru-RU") + text.slice(1);
}

function daysOfMonth(stamp) {
  const [y, m] = stamp.split("-").map(Number);
  const total = new Date(y, m, 0).getDate();
  return Array.from({ length: total }, (_, index) => `${stamp}-${String(index + 1).padStart(2, "0")}`);
}

function moodMonthStats(stamp) {
  const days = daysOfMonth(stamp);
  const scores = days.map((key) => ({ key, score: moodOf(key) })).filter((item) => item.score);
  const avg = scores.length
    ? Math.round((scores.reduce((sum, item) => sum + item.score, 0) / scores.length) * 10) / 10
    : 0;
  return { days, scores, avg };
}

function isSunday(key) {
  return parseKey(key).getDay() === 0;
}

function isSaturday(key) {
  return parseKey(key).getDay() === 6;
}

function saturdayOf(key) {
  const date = parseKey(key);
  const day = date.getDay();
  const delta = day === 0 ? -1 : 6 - day;
  return dayKey(addDays(date, delta));
}

function canOpen(key) {
  if (key <= todayKey()) return true;
  if (!isSaturday(key) && !isSunday(key)) return false;
  return dayKey(startOfWeek(parseKey(key))) === dayKey(startOfWeek(new Date()));
}

function seasonProgress() {
  if (!state.seasonStart) return null;
  const passed = Math.floor((parseKey(todayKey()) - parseKey(state.seasonStart)) / 86400000);
  return { day: passed + 1, left: 90 - passed };
}

function readEntry(key) {
  return state.entries[key] || blankEntry();
}

function ensureEntry(key) {
  if (!state.entries[key]) state.entries[key] = blankEntry();
  if (!state.entries[key].health) state.entries[key].health = {};
  if (!state.entries[key].areas) state.entries[key].areas = {};
  return state.entries[key];
}

function reviewOf(satKey) {
  return state.reviews?.[satKey] || {};
}

function reviewHasContent(satKey) {
  return Object.values(reviewOf(satKey)).some((item) => item && (item.move || String(item.decision || "").trim() || String(item.obstacle || "").trim()));
}

function reviewComplete(satKey) {
  const goals = state.goals.filter((goal) => String(goal.title || "").trim());
  if (!goals.length) return false;
  const review = reviewOf(satKey);
  return goals.every((goal) => {
    const item = review[goal.id];
    return item && item.move && String(item.decision || "").trim();
  });
}

function dayHasEntry(key) {
  const entry = state.entries[key];
  if (entry) {
    if (moodOf(key)) return true;
    if (goodsOf(key).length) return true;
    if ((entry.finance || "").trim() || (entry.god || "").trim() || (entry.focus || "").trim() || (entry.restNote || "").trim()) return true;
    if (Object.values(entry.areas || {}).some((answer) => String(answer || "").trim())) return true;
    if (Object.values(entry.health || {}).some((item) => item && (item.done || (item.note || "").trim()))) return true;
  }
  return isSaturday(key) && reviewHasContent(key);
}

function visibleAreas(key) {
  const entry = readEntry(key);
  return state.areas.filter((area) => {
    if (!area.archived) return true;
    return String(entry.areas?.[area.id] || "").trim().length > 0;
  });
}

function progress(key) {
  if (isSunday(key)) return { done: 0, total: 0 };
  const entry = readEntry(key);
  const parts = [];
  const futureSaturday = isSaturday(key) && key > todayKey();
  if (!futureSaturday) {
    parts.push(Boolean((entry.focus || "").trim()));
    parts.push(state.practices.some((practice) => entry.health?.[practice.id]?.done));
    parts.push(Boolean((entry.finance || "").trim()));
    visibleAreas(key).forEach((area) => {
      parts.push(Boolean(String(entry.areas?.[area.id] || "").trim()));
    });
    parts.push(Boolean((entry.god || "").trim()));
  }
  if (isSaturday(key)) parts.push(reviewComplete(key));
  const done = parts.filter(Boolean).length;
  return { done, total: parts.length };
}

function statusText(key) {
  if (isSunday(key)) return "День отдыха";
  if (isSaturday(key) && key > todayKey()) return "Разбор недели";
  const { done, total } = progress(key);
  return `${done} из ${total} пунктов`;
}

function captionText(key) {
  if (isSunday(key)) return "Воскресенье свободно";
  if (isSaturday(key)) return key === todayKey() ? "Суббота: день и разбор" : "Разбор недели";
  return key === todayKey() ? "Сегодняшний лист" : formatLong(parseKey(key));
}

function headingText(key) {
  if (isSunday(key)) return "День отдыха";
  if (isSaturday(key) && key !== todayKey()) return "Суббота";
  return key === todayKey() ? greeting() : "Этот день";
}

function ledeText(key) {
  if (isSunday(key)) {
    return key > todayKey()
      ? "Воскресенье ещё впереди и останется свободным. Разбор недели — в субботу."
      : "Сегодня ничего не отмечаем. Разбор недели был в субботу, список дел вернётся в понедельник.";
  }
  if (isSaturday(key) && key > todayKey()) {
    return "Разбор можно начать сейчас. Сам лист субботы откроется в субботу, воскресенье не трогаем.";
  }
  if (isSaturday(key)) {
    return "Проживи день как обычно и за пять минут разбери цели. Завтра весь день отдыха.";
  }
  return key === todayKey()
    ? "Сначала один шаг к главной цели. Потом короткий лист: что было сделано."
    : "Можно дописать этот день, если что-то вспомнилось.";
}

function sameTitle(a, b) {
  return a.trim().toLocaleLowerCase("ru-RU") === b.trim().toLocaleLowerCase("ru-RU");
}

function parseArea(raw) {
  let text = raw.trim().replace(/\s+/g, " ").replace(/[?.!]+$/g, "");
  text = text.replace(/^для\s+/i, "");
  if (!text) return { error: "Напиши, для кого этот пункт." };
  const label = text.charAt(0).toLocaleLowerCase("ru-RU") + text.slice(1);
  const key = label.toLocaleLowerCase("ru-RU");
  if (key === "бога" || key === "бог") return { error: "Вопрос о Боге уже стоит последним." };
  if (key.includes("финансов")) return { error: "Финансовая свобода уже есть отдельным пунктом." };
  if (key === "здоровья" || key === "здоровье") {
    return { error: "Здоровье уже первое. Новые практики добавляются внутри него." };
  }
  return {
    key,
    title: `Для ${label}`,
    question: `Что ты сделал для ${label}?`,
    hint: AREA_HINTS[key] || "Одно конкретное действие, без общего «я старался»."
  };
}

function render() {
  const selected = parseKey(selectedKey);
  const isToday = selectedKey === todayKey();
  const entry = readEntry(selectedKey);
  const areas = visibleAreas(selectedKey);
  const sunday = isSunday(selectedKey);
  const saturday = isSaturday(selectedKey);
  const futureSaturday = saturday && selectedKey > todayKey();
  const futureWeek = startOfWeek(addDays(weekAnchor, 7)) > startOfWeek(new Date());
  const dailySheet = !sunday && !futureSaturday;
  const onGoodSheet = ui.sheet === "good";
  const onCalmSheet = ui.sheet === "calm";
  const dayGoods = goodsOf(selectedKey);
  const bank = bankGoods();
  const title = onCalmSheet
    ? "Сейчас плохо"
    : onGoodSheet
      ? "Копилка хорошего"
      : headingText(selectedKey);
  const lede = onCalmSheet
    ? "Это пройдёт. Сначала дыхание — оно помогает телу успокоиться."
    : onGoodSheet
      ? "Сюда клади, что за день получилось хорошо. Даже маленькое."
      : ledeText(selectedKey);
  const sideStatus = onCalmSheet
    ? "техника спокойствия"
    : onGoodSheet
      ? (dayGoods.length ? `${dayGoods.length} за день` : "пока пусто")
      : statusText(selectedKey);

  if (!onCalmSheet) stopBreathing();

  app.innerHTML = `
    <header class="top">
      <div>
        <div class="mark" aria-hidden="true"><i></i></div>
        <p class="eyebrow">Коуч для жизни</p>
        <h1>${esc(title)}</h1>
        <p class="lede">${esc(lede)}</p>
      </div>
      <div class="today-side">
        <strong>${esc(formatLong(selected))}</strong>
        <span data-status>${esc(sideStatus)}</span>
      </div>
    </header>

    ${onCalmSheet ? "" : `
      <div class="weekbar">
        <button class="nav" type="button" data-action="week-prev" aria-label="Предыдущая неделя">←</button>
        <div class="week">${renderWeek()}</div>
        <button class="nav" type="button" data-action="week-next" aria-label="Следующая неделя" ${futureWeek ? "disabled" : ""}>→</button>
      </div>
    `}

    ${onGoodSheet || onCalmSheet ? `
      <div class="meta-row">
        <button class="linkish" type="button" data-action="open-day">← К дневному листу</button>
        ${isToday || onCalmSheet ? "" : '<button class="linkish" type="button" data-action="go-today">Сегодня</button>'}
      </div>
    ` : `
      ${renderFeel(selectedKey)}
      <div class="sheet-links">
        <button class="sheet-link" type="button" data-action="open-good">
          <span>Копилка хорошего</span>
          <em>${dayGoods.length ? `${dayGoods.length} сегодня` : "открыть лист"}</em>
        </button>
        <button class="sheet-link sheet-link-calm" type="button" data-action="open-calm">
          <span>Сейчас плохо</span>
          <em>дыхание</em>
        </button>
      </div>
      <div class="meta-row">
        <span data-progress>${esc(captionText(selectedKey))}</span>
        ${isToday ? "" : '<button class="linkish" type="button" data-action="go-today">Вернуться к сегодня</button>'}
      </div>
    `}

    <main class="stack">
      ${onCalmSheet ? renderCalmSheet() : onGoodSheet ? renderGoodSheet(dayGoods, bank) : `
        ${renderGoals()}
        ${sunday ? renderRest(entry) : ""}
        ${futureSaturday ? renderFutureSaturday() : ""}
        ${dailySheet ? renderFocus(entry) : ""}
        ${dailySheet ? renderHealth(entry) : ""}
        ${dailySheet ? renderFinance(entry) : ""}
        ${dailySheet ? areas.map((area, index) => renderArea(area, entry, index)).join("") : ""}
        ${dailySheet ? renderAddArea() : ""}
        ${saturday ? renderReview() : ""}
        ${dailySheet ? renderGod(entry) : ""}
      `}
    </main>

    <footer class="footer">
      <details>
        <summary>Данные на этом устройстве</summary>
        <p>Ответы остаются в этом браузере. Копию можно скачать и вернуть, если очистишь историю или сменишь браузер.</p>
        <div class="footer-actions">
          <button class="ghost" type="button" data-action="export">Скачать копию</button>
          <label class="ghost file-btn">Вернуть из файла
            <input data-action="import" type="file" accept="application/json" hidden>
          </label>
        </div>
      </details>
    </footer>
  `;
}

function renderCalmSheet() {
  const groundLabels = [
    "5 вещей, которые видишь",
    "4 звука, которые слышишь",
    "3 ощущения в теле",
    "2 запаха рядом",
    "1 вкус во рту или глоток воды"
  ];
  const groundList = groundLabels.map((label, index) => `
    <button class="calm-check ${ui.ground[index] ? "is-on" : ""}" type="button" data-action="toggle-ground" data-index="${index}">
      <i></i>
      <span>${esc(label)}</span>
    </button>
  `).join("");
  const bodyChecks = [
    { key: "wash", label: "Умыть лицо холодной водой" },
    { key: "water", label: "Выпить воды медленно, без телефона" },
    { key: "walk", label: "Пройтись по комнате 2 минуты" }
  ].map((item) => `
    <button class="calm-check ${ui.body[item.key] ? "is-on" : ""}" type="button" data-action="toggle-body" data-key="${item.key}">
      <i></i>
      <span>${esc(item.label)}</span>
    </button>
  `).join("");
  const helps = normalizeHelps(state.helps).map((title, index) => `
    <div class="help-chip">
      <button class="chip" type="button" data-action="use-help" data-index="${index}">${esc(title)}</button>
      <button class="linkish" type="button" data-action="remove-help" data-index="${index}" aria-label="Убрать">×</button>
    </div>
  `).join("");
  const breath = breathPattern();
  const presets = BREATH_PRESETS.map((item) => `
    <button class="chip ${breath.preset === item.id ? "is-on" : ""}" type="button" data-action="breath-preset" data-id="${item.id}">
      ${esc(item.label)}
      <small>${esc(item.hint)}</small>
    </button>
  `).join("");

  return `
    <section class="card card-calm-line">
      <p class="kicker">Сейчас</p>
      <p class="calm-line">${esc(CALM_LINES[ui.calmLine] || CALM_LINES[0])}</p>
      <button class="linkish" type="button" data-action="calm-line-next">Другая фраза</button>
    </section>
    <section class="card card-calm">
      <div class="card-head">
        <p class="kicker">Дыхание</p>
        <span>${esc(breathLabel(breath))}</span>
      </div>
      <h2>Успокой дыхание</h2>
      <p class="question">${esc(breathHint(breath))}</p>
      <button class="linkish breath-setup-toggle" type="button" data-action="toggle-breath-setup">${ui.breathSetup ? "Скрыть настройки" : "Настроить ритм"}</button>
      ${ui.breathSetup ? `
        <div class="breath-setup">
          <p class="hint">Выбери готовый ритм или поставь свои секунды. Пауза после выдоха может быть 0.</p>
          <div class="breath-presets">${presets}</div>
          <form class="breath-custom" data-form="breath-custom">
            <label>Вдох<input class="textin" name="in" type="number" min="1" max="20" value="${breath.in}"></label>
            <label>Задержка<input class="textin" name="hold" type="number" min="0" max="20" value="${breath.hold}"></label>
            <label>Выдох<input class="textin" name="out" type="number" min="1" max="20" value="${breath.out}"></label>
            <label>Пауза<input class="textin" name="rest" type="number" min="0" max="20" value="${breath.rest}"></label>
            <button class="solid" type="submit">Сохранить свой ритм</button>
          </form>
        </div>
      ` : ""}
      <div class="breath">
        <div class="breath-circle" data-breath-circle data-phase="idle" aria-hidden="true"></div>
        <p class="breath-label" data-breath-label>${ui.breathing ? "Вдох" : "Когда будешь готов — нажми «Начать»."}</p>
        <p class="breath-count" data-breath-count>${ui.breathing ? String(breath.in) : ""}</p>
        <button class="solid" type="button" data-action="breath-toggle">${ui.breathing ? "Остановить" : "Начать"}</button>
      </div>
    </section>
    <section class="card">
      <div class="card-head">
        <p class="kicker">Заземление</p>
        <span>5 · 4 · 3 · 2 · 1</span>
      </div>
      <h2>Вернись в комнату</h2>
      <p class="hint">Назови вслух или про себя. Отмечай шаги по одному — без спешки.</p>
      <div class="calm-checks">${groundList}</div>
    </section>
    <section class="card">
      <div class="card-head">
        <p class="kicker">Тело</p>
      </div>
      <h2>Холод, вода, движение</h2>
      <p class="hint">Тело часто успокаивается раньше головы. Выбери один шаг.</p>
      <div class="calm-checks">${bodyChecks}</div>
    </section>
    <section class="card">
      <div class="card-head">
        <p class="kicker">Шпаргалка</p>
        <span>${normalizeHelps(state.helps).length}</span>
      </div>
      <h2>Что уже помогало</h2>
      <p class="hint">Свой список. В тяжёлый момент не надо придумывать — выбери из знакомого.</p>
      <div class="help-list">${helps}</div>
      <form class="help-add" data-form="add-help">
        <input class="textin" name="title" type="text" placeholder="Например: тёплый чай" value="${esc(ui.helpDraft)}" maxlength="60">
        <button class="solid" type="submit">Добавить</button>
      </form>
      ${ui.helpError ? `<p class="error">${esc(ui.helpError)}</p>` : ""}
    </section>
    <section class="card card-exit">
      <div class="card-head">
        <p class="kicker">Дальше</p>
      </div>
      <h2>Мягкий выход</h2>
      <p class="hint">Один маленький шаг. Не надо возвращаться ко всему списку сразу.</p>
      <div class="exit-actions">
        <button class="sheet-link" type="button" data-action="exit-water">
          <span>Выпить воды</span>
          <em>отметить</em>
        </button>
        <button class="sheet-link" type="button" data-action="exit-mood">
          <span>Отметить, как сейчас</span>
          <em>настроение</em>
        </button>
        <button class="sheet-link" type="button" data-action="open-good">
          <span>Открыть копилку хорошего</span>
          <em>лист</em>
        </button>
        <button class="sheet-link" type="button" data-action="open-day">
          <span>Вернуться к дню</span>
          <em>тихо</em>
        </button>
      </div>
      <p class="hint crisis-hint">Если мысль о вреде себе не отпускает — обратись к живому человеку или на горячую линию. В экстренной ситуации — 112.</p>
    </section>
  `;
}

function stopBreathing(updateUi = true) {
  if (breathTimer) {
    clearInterval(breathTimer);
    breathTimer = null;
  }
  if (updateUi) ui.breathing = false;
}

function startBreathing() {
  stopBreathing(false);
  ui.breathing = true;
  const phases = breathPhases();
  let index = 0;
  let left = phases[0].seconds;

  const paint = () => {
    const phase = phases[index];
    const circle = app.querySelector("[data-breath-circle]");
    const label = app.querySelector("[data-breath-label]");
    const count = app.querySelector("[data-breath-count]");
    if (!circle) {
      stopBreathing();
      return;
    }
    circle.dataset.phase = phase.id;
    if (label) label.textContent = phase.text;
    if (count) count.textContent = String(left);
  };

  paint();
  breathTimer = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      index = (index + 1) % phases.length;
      left = phases[index].seconds;
    }
    paint();
  }, 1000);
}

function renderGoodSheet(dayGoods, bank) {
  const future = selectedKey > todayKey();
  const list = dayGoods.map((text, index) => `
    <li class="good-item">
      <p>${esc(text)}</p>
      <button class="linkish" type="button" data-action="remove-good" data-index="${index}">Убрать</button>
    </li>
  `).join("");
  const bankList = bank.length
    ? bank.map((item) => `
      <li class="bank-item">
        <time>${esc(formatLong(parseKey(item.key)))}</time>
        <p>${esc(item.text)}</p>
      </li>
    `).join("")
    : '<li class="bank-empty">Пока пусто. Первая запись уже делает копилку живой.</li>';

  return `
    <section class="card card-good">
      <div class="card-head">
        <p class="kicker">За день</p>
        <span>${dayGoods.length ? `${dayGoods.length}` : "—"}</span>
      </div>
      <h2>Что хорошего было</h2>
      <p class="question">Одной фразой. Можно несколько раз за день.</p>
      ${future ? "<p class=\"hint\">Этот день ещё не наступил.</p>" : `
        <form class="good-add" data-form="add-good">
          <textarea name="text" rows="3" placeholder="Например: спокойно поговорил с мамой">${esc(ui.goodDraft)}</textarea>
          <button class="solid" type="submit">Положить в копилку</button>
        </form>
        ${ui.goodError ? `<p class="error">${esc(ui.goodError)}</p>` : ""}
      `}
      ${dayGoods.length ? `<ul class="good-list">${list}</ul>` : '<p class="hint">За этот день записей ещё нет.</p>'}
    </section>
    <section class="card">
      <div class="card-head">
        <p class="kicker">Копилка</p>
        <span>${bank.length || "0"}</span>
      </div>
      <h2>Всё хорошее рядом</h2>
      <p class="hint">Последние записи из разных дней. Чтобы вернуться к дню — выбери его в календаре сверху.</p>
      <ul class="bank-list">${bankList}</ul>
    </section>
  `;
}

function renderWeek() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekAnchor, index);
    const key = dayKey(date);
    const future = !canOpen(key);
    const classes = [
      "day",
      key === selectedKey ? "is-selected" : "",
      key === todayKey() ? "is-today" : "",
      isSunday(key) ? "is-rest" : "",
      dayHasEntry(key) ? "has-entry" : ""
    ].filter(Boolean).join(" ");
    return `
      <button class="${classes}" type="button" data-action="pick-day" data-day="${key}" ${future ? "disabled" : ""}>
        <span class="day-wd">${weekdayShort(date)}</span>
        <span class="day-num">${date.getDate()}</span>
        <i class="dot"></i>
      </button>
    `;
  }).join("");
}

function renderFeel(key) {
  const score = moodOf(key);
  const future = key > todayKey();
  return `
    <section class="feel">
      <div class="feel-row">
        <button class="feel-btn ${score ? "has-score" : ""} ${ui.feelOpen ? "is-open" : ""}" type="button" data-action="toggle-feel" ${future ? "disabled" : ""}>
          <span>Как я себя чувствую</span>
          ${score ? `<strong>${score}<small>/10</small></strong>` : "<em>отметить</em>"}
        </button>
        <button class="linkish" type="button" data-action="toggle-mood-chart">${ui.moodChartOpen ? "Скрыть график" : "График за месяц"}</button>
      </div>
      ${ui.feelOpen && !future ? renderFeelScale(score) : ""}
      ${ui.moodChartOpen ? renderMoodMonth() : ""}
    </section>
  `;
}

function renderFeelScale(score) {
  const marks = Array.from({ length: 10 }, (_, index) => {
    const value = index + 1;
    return `
      <button class="mood-mark ${score === value ? "is-on" : ""}" type="button" data-action="set-mood" data-score="${value}" aria-label="Оценка ${value} из 10">
        ${value}
      </button>
    `;
  }).join("");
  return `
    <div class="feel-scale">
      <p class="feel-hint">Поставь от 1 до 10. 1 — совсем тяжело, 10 — очень хорошо.</p>
      <div class="mood-marks">${marks}</div>
    </div>
  `;
}

function renderMoodMonth() {
  const stamp = ui.moodMonth || monthStamp(parseKey(selectedKey));
  const { days, scores, avg } = moodMonthStats(stamp);
  const now = monthStamp(new Date());
  const [y, m] = stamp.split("-").map(Number);
  const prevStamp = monthStamp(new Date(y, m - 2, 1));
  const nextStamp = monthStamp(new Date(y, m, 1));
  const bars = days.map((key) => {
    const score = moodOf(key);
    const day = Number(key.slice(-2));
    const height = score ? 12 + score * 10 : 4;
    const future = key > todayKey();
    return `
      <button class="mood-bar ${score ? "has-score" : ""} ${key === selectedKey ? "is-selected" : ""}" type="button" data-action="pick-mood-day" data-day="${key}" ${future ? "disabled" : ""} title="${key}${score ? `: ${score}` : ""}">
        <span class="mood-bar-fill" style="height:${height}px"></span>
        <span class="mood-bar-day">${day}</span>
      </button>
    `;
  }).join("");
  return `
    <div class="mood-month">
      <div class="mood-month-head">
        <button class="nav" type="button" data-action="mood-month-prev" data-month="${prevStamp}" aria-label="Предыдущий месяц">←</button>
        <div>
          <p class="kicker">Состояние</p>
          <h2>${esc(monthLabel(stamp))}</h2>
        </div>
        <button class="nav" type="button" data-action="mood-month-next" data-month="${nextStamp}" aria-label="Следующий месяц" ${nextStamp > now ? "disabled" : ""}>→</button>
      </div>
      <p class="lede mood-month-lede">${scores.length ? `Среднее ${avg} из 10 · отмечено ${scores.length} ${dayWord(scores.length)}` : "Пока нет отметок за этот месяц."}</p>
      <div class="mood-chart" aria-label="График состояния за месяц">${bars}</div>
      <div class="mood-legend"><span>1</span><span>тяжело</span><span>хорошо</span><span>10</span></div>
    </div>
  `;
}

function dayWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

function renderHealth(entry) {
  const practices = state.practices.map((practice) => {
    const item = entry.health?.[practice.id] || { done: false, note: "" };
    if (ui.editingPracticeId === practice.id) {
      return `
        <form class="rename-form" data-form="rename-practice" data-id="${esc(practice.id)}">
          <input class="textin" name="title" value="${esc(practice.title)}" aria-label="Название практики" required>
          <button class="solid" type="submit">Ок</button>
        </form>
      `;
    }
    return `
      <div class="practice ${item.done ? "is-done" : ""}">
        <input class="check" id="practice-${esc(practice.id)}" type="checkbox" data-action="toggle-practice" data-id="${esc(practice.id)}" ${item.done ? "checked" : ""}>
        <label class="pname" for="practice-${esc(practice.id)}">${esc(practice.title)}</label>
        <span>
          <button class="icon-btn" type="button" data-action="edit-practice" data-id="${esc(practice.id)}" aria-label="Переименовать">✎</button>
          <button class="icon-btn" type="button" data-action="remove-practice" data-id="${esc(practice.id)}" aria-label="Убрать практику">×</button>
        </span>
        <input class="note" data-field="practice-note" data-id="${esc(practice.id)}" value="${esc(item.note || "")}" placeholder="Как прошло, если хочется отметить">
      </div>
    `;
  }).join("");

  const chips = PRACTICE_SUGGESTIONS
    .filter((title) => !state.practices.some((practice) => sameTitle(practice.title, title)))
    .map((title) => `<button class="chip" type="button" data-action="add-practice" data-title="${esc(title)}">${esc(title)}</button>`)
    .join("");

  return `
    <section class="card">
      <div class="card-head">
        <p class="kicker">01 · тело</p>
        <span class="kicker" data-health-count>${healthCount(entry)}</span>
      </div>
      <h2>Здоровье</h2>
      <p class="hint">Отмечай, что сделал. Сурья намаскар уже здесь — рядом можно поставить сон, еду, воду и прогулку.</p>
      <div class="practices">${practices || '<p class="hint">Пока пусто. Добавь первую практику.</p>'}</div>
      ${chips ? `<div class="chips">${chips}</div>` : ""}
      <form class="add-form" data-form="add-practice">
        <input class="textin" name="title" value="${esc(ui.practiceDraft)}" placeholder="Своя практика" aria-label="Новая практика">
        <button class="solid" type="submit">Добавить</button>
      </form>
      ${ui.practiceError ? `<p class="error">${esc(ui.practiceError)}</p>` : ""}
    </section>
  `;
}

function healthCount(entry) {
  const done = state.practices.filter((practice) => entry.health?.[practice.id]?.done).length;
  if (!state.practices.length) return "";
  return `${done} из ${state.practices.length}`;
}

function renderFinance(entry) {
  return `
    <section class="card">
      <p class="kicker">02 · опора</p>
      <h2>Финансовая свобода</h2>
      <p class="question">${esc(FINANCE_QUESTION)}</p>
      <p class="hint">Деньги, которые сохранил. Навык, который растит доход. Отказ от лишнего. Шаг в своём деле.</p>
      <textarea data-field="finance" placeholder="Например: отложил часть, не купил лишнее, час поработал над своим делом">${esc(entry.finance || "")}</textarea>
    </section>
  `;
}

function renderArea(area, entry, index) {
  const number = String(index + 3).padStart(2, "0");
  return `
    <section class="card card-person ${area.archived ? "is-archived" : ""}">
      <div class="card-head">
        <p class="kicker">${number} · забота</p>
        ${area.archived
          ? `<button class="text-btn" type="button" data-action="restore-area" data-id="${esc(area.id)}">Вернуть</button>`
          : `<button class="text-btn" type="button" data-action="archive-area" data-id="${esc(area.id)}">Убрать</button>`}
      </div>
      <h2>${esc(area.title)}</h2>
      ${area.archived ? '<p class="archived-note">Убран из ежедневного списка, ответ этого дня сохранён</p>' : ""}
      <p class="question">${esc(area.question)}</p>
      <p class="hint">${esc(area.hint || "")}</p>
      <textarea data-field="area" data-id="${esc(area.id)}" placeholder="Одно конкретное действие">${esc(entry.areas?.[area.id] || "")}</textarea>
    </section>
  `;
}

function renderAddArea() {
  const taken = new Set(state.areas.filter((area) => !area.archived).map((area) => area.key));
  const chips = AREA_SUGGESTIONS
    .filter((label) => !taken.has(label))
    .map((label) => `<button class="chip" type="button" data-action="add-suggestion" data-label="${esc(label)}">Для ${esc(label)}</button>`)
    .join("");

  const advice = ui.tipsOpen ? `
    <div class="advice">
      <p>В здоровье, кроме сурьи намаскар, держи сон, еду, воду и прогулку. В заботах — мужа, маму, сына, и отдельно себя, дом и дело. Не набирай всё сразу: 4–6 честных вопросов сильнее длинного списка. Вопрос о Боге пусть остаётся последним.</p>
      <button class="linkish" type="button" data-action="hide-tips">Скрыть подсказку</button>
    </div>
  ` : `<button class="linkish" type="button" data-action="show-tips">Что ещё можно добавить</button>`;

  return `
    <section class="card">
      <p class="kicker">Дальше по желанию</p>
      <h2>Добавить пункт</h2>
      ${advice}
      ${chips ? `<div class="chips">${chips}</div>` : ""}
      <form class="add-form" data-form="add-area">
        <input class="textin" name="label" value="${esc(ui.areaDraft)}" placeholder="для кого: мамы, сына, себя…" aria-label="Новый пункт">
        <button class="solid" type="submit">Добавить</button>
      </form>
      ${ui.areaError ? `<p class="error">${esc(ui.areaError)}</p>` : ""}
    </section>
  `;
}

function renderGoals() {
  const season = seasonProgress();
  const seasonLine = !season
    ? "90 дней"
    : season.left <= 0
      ? "Сезон завершён"
      : `день ${season.day} из 90`;
  const goals = state.goals.map((goal, index) => `
    <div class="goal">
      <div class="card-head">
        <p class="kicker">Цель ${index + 1}</p>
        <button class="text-btn" type="button" data-action="remove-goal" data-id="${esc(goal.id)}">Убрать</button>
      </div>
      <input class="textin" data-field="goal-title" data-id="${esc(goal.id)}" value="${esc(goal.title || "")}" placeholder="Опиши цель" aria-label="Цель ${index + 1}">
    </div>
  `).join("");
  const form = state.goals.length >= 3
    ? '<p class="hint">Три цели — потолок сезона. Чтобы добавить новую, убери одну.</p>'
    : `
      <form class="goal-add" data-form="add-goal">
        <input class="textin" name="title" value="${esc(ui.goalTitleDraft)}" placeholder="Опиши цель" aria-label="Опиши цель" required>
        <button class="solid" type="submit">Добавить</button>
      </form>
      ${ui.goalError ? `<p class="error">${esc(ui.goalError)}</p>` : ""}
    `;
  const renew = season && season.left <= 0
    ? '<button class="ghost" type="button" data-action="renew-season">Начать сезон заново</button>'
    : "";

  return `
    <section class="card">
      <div class="card-head">
        <p class="kicker">Курс</p>
        <span class="kicker">${esc(seasonLine)}</span>
      </div>
      <h2>Главные цели</h2>
      <p class="hint">Напиши своими словами, чего хочешь добиться. Можно до трёх целей.</p>
      <div class="goal-list">${goals}</div>
      ${form}
      ${renew}
    </section>
  `;
}

function renderFocus(entry) {
  const chips = state.goals
    .filter((goal) => String(goal.title || "").trim())
    .map((goal) => `
      <button class="chip ${entry.focusGoal === goal.id ? "is-on" : ""}" type="button" data-action="focus-goal" data-id="${esc(goal.id)}">${esc(goal.title)}</button>
    `).join("");
  return `
    <section class="card">
      <p class="kicker">Главное сегодня</p>
      <h2>Один шаг</h2>
      <p class="question">Какой один шаг сегодня двигает главную цель?</p>
      <p class="hint">${chips ? "Отметь, к какой цели этот шаг." : "Когда наверху появятся цели, шаг можно будет привязать к одной из них."}</p>
      ${chips ? `<div class="chips">${chips}</div>` : ""}
      <textarea data-field="focus" placeholder="Одно действие. Если сделано оно — день уже не пустой.">${esc(entry.focus || "")}</textarea>
    </section>
  `;
}

function renderRest(entry) {
  return `
    <section class="card card-rest">
      <p class="kicker">Воскресенье</p>
      <h2>Весь день отдыха</h2>
      <p class="question">Сегодня нет листа, нет разбора и нет отметки «сделано».</p>
      <p class="hint">Суббота забирает пять минут на цели. Воскресенье пусть останется тихим целиком.</p>
      <textarea data-field="rest-note" placeholder="Одна тихая заметка, если хочется. Можно оставить пустым.">${esc(entry.restNote || "")}</textarea>
    </section>
  `;
}

function renderFutureSaturday() {
  return `
    <section class="card">
      <p class="kicker">Ещё не наступила</p>
      <h2>Лист субботы</h2>
      <p class="hint">Откроется в субботу: один шаг, здоровье, деньги, близкие и вопрос о Боге. Сейчас можно только разобрать неделю. Воскресенье остаётся днём отдыха.</p>
    </section>
  `;
}

function renderReview() {
  const satKey = isSaturday(selectedKey) ? selectedKey : saturdayOf(selectedKey);
  const review = reviewOf(satKey);
  const goals = state.goals.filter((goal) => String(goal.title || "").trim());
  const blocks = goals.length
    ? goals.map((goal) => {
      const item = review[goal.id] || { move: "", decision: "" };
      return `
        <div class="review-block">
          <h2>${esc(goal.title)}</h2>
          <div class="choices">
            <button class="choice ${item.move === "shift" ? "is-on" : ""}" type="button" data-action="review-move" data-id="${esc(goal.id)}" data-move="shift">Движение</button>
            <button class="choice ${item.move === "still" ? "is-on" : ""}" type="button" data-action="review-move" data-id="${esc(goal.id)}" data-move="still">Застой</button>
          </div>
          ${item.move === "still" ? `<input class="textin obstacle" data-field="review-obstacle" data-id="${esc(goal.id)}" value="${esc(item.obstacle || "")}" placeholder="Что помешало?" aria-label="Что помешало">` : ""}
          <textarea data-field="review-decision" data-id="${esc(goal.id)}" placeholder="Одно решение на следующую неделю">${esc(item.decision || "")}</textarea>
        </div>
      `;
    }).join("")
    : '<p class="hint">Сначала запиши наверху одну, две или три цели. Разбор идёт по ним, не по всему списку дня.</p>';

  return `
    <section class="card">
      <p class="kicker">Суббота · пять минут</p>
      <h2>Разбор недели</h2>
      <p class="hint">По каждой цели: движение или застой. Если застой — одной фразой, что помешало. Потом одно решение на следующую неделю.</p>
      ${blocks}
    </section>
  `;
}

function renderGod(entry) {
  return `
    <section class="card card-god">
      <p class="kicker">Последний вопрос дня</p>
      <h2>Для Бога</h2>
      <p class="question">${esc(GOD_QUESTION)}</p>
      <p class="hint">Молитва, тишина, доброе дело, удержанный язык — как было на самом деле.</p>
      <textarea data-field="god" placeholder="Что сегодня было сделано для Бога">${esc(entry.god || "")}</textarea>
    </section>
  `;
}

function paintMeta() {
  const status = app.querySelector("[data-status]");
  const progressLabel = app.querySelector("[data-progress]");
  if (status) status.textContent = statusText(selectedKey);
  if (progressLabel) progressLabel.textContent = captionText(selectedKey);
  app.querySelectorAll("[data-day]").forEach((button) => {
    button.classList.toggle("has-entry", dayHasEntry(button.dataset.day));
  });
  const count = app.querySelector("[data-health-count]");
  if (count && state.practices.length) count.textContent = healthCount(readEntry(selectedKey));
}

function addGoal(title, sign) {
  const cleanTitle = String(title || "").trim().replace(/\s+/g, " ");
  const cleanSign = String(sign || "").trim().replace(/\s+/g, " ");
  if (!cleanTitle) {
    ui.goalError = "Опиши цель в поле выше и нажми «Добавить».";
    ui.goalTitleDraft = String(title || "");
    ui.goalSignDraft = String(sign || "");
    return false;
  }
  if (state.goals.length >= 3) {
    ui.goalError = "Три цели — потолок. Убери одну, если нужна новая.";
    return false;
  }
  if (!state.seasonStart) state.seasonStart = todayKey();
  state.goals.push({ id: uid(), title: cleanTitle, sign: cleanSign });
  ui.goalTitleDraft = "";
  ui.goalSignDraft = "";
  ui.goalError = "";
  save();
  return true;
}

function ensureReviewItem(goalId) {
  const satKey = isSaturday(selectedKey) ? selectedKey : saturdayOf(selectedKey);
  if (!state.reviews[satKey]) state.reviews[satKey] = {};
  if (!state.reviews[satKey][goalId]) state.reviews[satKey][goalId] = { move: "", decision: "", obstacle: "" };
  return state.reviews[satKey][goalId];
}

function addPractice(title) {
  const clean = title.trim().replace(/\s+/g, " ");
  if (!clean) {
    ui.practiceError = "Напиши название практики.";
    return false;
  }
  if (state.practices.some((practice) => sameTitle(practice.title, clean))) {
    ui.practiceError = "Такая практика уже есть.";
    ui.practiceDraft = clean;
    return false;
  }
  state.practices.push({ id: uid(), title: clean });
  ui.practiceDraft = "";
  ui.practiceError = "";
  save();
  return true;
}

function addArea(raw) {
  const parsed = parseArea(raw);
  if (parsed.error) {
    ui.areaError = parsed.error;
    ui.areaDraft = raw;
    return false;
  }
  const existing = state.areas.find((area) => area.key === parsed.key);
  if (existing) {
    existing.archived = false;
    existing.title = parsed.title;
    existing.question = parsed.question;
    existing.hint = parsed.hint;
  } else {
    state.areas.push({ id: uid(), archived: false, ...parsed });
  }
  ui.areaDraft = "";
  ui.areaError = "";
  save();
  return true;
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "pick-day") {
    selectedKey = target.dataset.day;
    ui.editingPracticeId = null;
    render();
  }

  if (action === "week-prev") {
    weekAnchor = addDays(weekAnchor, -7);
    render();
  }

  if (action === "week-next") {
    const next = addDays(weekAnchor, 7);
    if (startOfWeek(next) > startOfWeek(new Date())) return;
    weekAnchor = next;
    render();
  }

  if (action === "go-today") {
    selectedKey = todayKey();
    weekAnchor = startOfWeek(new Date());
    render();
  }

  if (action === "open-good") {
    stopBreathing();
    ui.sheet = "good";
    ui.goodError = "";
    render();
  }

  if (action === "open-calm") {
    stopBreathing();
    ui.sheet = "calm";
    ui.goodError = "";
    ui.helpError = "";
    ui.calmLine = pickCalmLine(ui.calmLine);
    ui.ground = [false, false, false, false, false];
    ui.body = { wash: false, water: false, walk: false };
    render();
  }

  if (action === "open-day") {
    stopBreathing();
    ui.sheet = "day";
    ui.goodError = "";
    ui.helpError = "";
    render();
  }

  if (action === "calm-line-next") {
    ui.calmLine = pickCalmLine(ui.calmLine);
    render();
  }

  if (action === "toggle-ground") {
    const index = Number(target.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index > 4) return;
    ui.ground[index] = !ui.ground[index];
    render();
  }

  if (action === "toggle-body") {
    const key = target.dataset.key;
    if (!(key in ui.body)) return;
    ui.body[key] = !ui.body[key];
    render();
  }

  if (action === "use-help") {
    const index = Number(target.dataset.index);
    const helps = normalizeHelps(state.helps);
    if (!Number.isInteger(index) || !helps[index]) return;
    target.classList.add("is-on");
    window.setTimeout(() => target.classList.remove("is-on"), 900);
  }

  if (action === "remove-help") {
    const index = Number(target.dataset.index);
    const helps = normalizeHelps(state.helps);
    if (!Number.isInteger(index) || index < 0 || index >= helps.length) return;
    helps.splice(index, 1);
    state.helps = helps.length ? helps : DEFAULT_HELPS.slice();
    save();
    render();
  }

  if (action === "exit-water") {
    ui.body.water = true;
    render();
  }

  if (action === "exit-mood") {
    stopBreathing();
    ui.sheet = "day";
    ui.feelOpen = true;
    render();
    app.querySelector("[data-action='toggle-feel']")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (action === "toggle-breath-setup") {
    ui.breathSetup = !ui.breathSetup;
    render();
  }

  if (action === "breath-preset") {
    const preset = BREATH_PRESETS.find((item) => item.id === target.dataset.id);
    if (!preset) return;
    const wasBreathing = ui.breathing;
    stopBreathing();
    state.breath = normalizeBreath(preset);
    save();
    render();
    if (wasBreathing) {
      ui.breathing = true;
      render();
      startBreathing();
    }
  }

  if (action === "breath-toggle") {
    if (ui.sheet !== "calm") return;
    if (ui.breathing) {
      stopBreathing();
      render();
      return;
    }
    ui.breathing = true;
    render();
    startBreathing();
  }

  if (action === "remove-good") {
    const entry = ensureGoods(selectedKey);
    const index = Number(target.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index >= entry.goods.length) return;
    entry.goods.splice(index, 1);
    save();
    render();
  }

  if (action === "toggle-feel") {
    ui.feelOpen = !ui.feelOpen;
    render();
  }

  if (action === "set-mood") {
    if (selectedKey > todayKey()) return;
    const score = Number(target.dataset.score);
    if (!Number.isInteger(score) || score < 1 || score > 10) return;
    const entry = ensureEntry(selectedKey);
    entry.mood = entry.mood === score ? 0 : score;
    save();
    render();
  }

  if (action === "toggle-mood-chart") {
    ui.moodChartOpen = !ui.moodChartOpen;
    if (ui.moodChartOpen && !ui.moodMonth) ui.moodMonth = monthStamp(parseKey(selectedKey));
    render();
  }

  if (action === "mood-month-prev" || action === "mood-month-next") {
    const next = target.dataset.month;
    if (!next) return;
    if (action === "mood-month-next" && next > monthStamp(new Date())) return;
    ui.moodMonth = next;
    render();
  }

  if (action === "pick-mood-day") {
    const day = target.dataset.day;
    if (!day || !canOpen(day)) return;
    selectedKey = day;
    weekAnchor = startOfWeek(parseKey(day));
    ui.feelOpen = true;
    render();
  }

  if (action === "add-practice") {
    addPractice(target.dataset.title);
    render();
  }

  if (action === "edit-practice") {
    ui.editingPracticeId = target.dataset.id;
    render();
    app.querySelector(".rename-form input")?.focus();
  }

  if (action === "remove-practice") {
    const practice = state.practices.find((item) => item.id === target.dataset.id);
    if (!practice) return;
    if (!window.confirm(`Убрать «${practice.title}» из здоровья?`)) return;
    state.practices = state.practices.filter((item) => item.id !== practice.id);
    save();
    render();
  }

  if (action === "add-suggestion") {
    addArea(target.dataset.label);
    render();
  }

  if (action === "archive-area") {
    const area = state.areas.find((item) => item.id === target.dataset.id);
    if (!area) return;
    if (!window.confirm(`Убрать «${area.title}» из ежедневного списка?`)) return;
    area.archived = true;
    save();
    render();
  }

  if (action === "restore-area") {
    const area = state.areas.find((item) => item.id === target.dataset.id);
    if (!area) return;
    area.archived = false;
    save();
    render();
  }

  if (action === "hide-tips") {
    state.tipsDismissed = true;
    ui.tipsOpen = false;
    save();
    render();
  }

  if (action === "show-tips") {
    ui.tipsOpen = true;
    render();
  }

  if (action === "remove-goal") {
    const goal = state.goals.find((item) => item.id === target.dataset.id);
    if (!goal) return;
    const name = goal.title.trim() || "эту цель";
    if (!window.confirm(`Убрать «${name}» из целей сезона?`)) return;
    state.goals = state.goals.filter((item) => item.id !== goal.id);
    save();
    render();
  }

  if (action === "renew-season") {
    state.seasonStart = todayKey();
    save();
    render();
  }

  if (action === "focus-goal") {
    const entry = ensureEntry(selectedKey);
    entry.focusGoal = entry.focusGoal === target.dataset.id ? "" : target.dataset.id;
    save();
    render();
  }

  if (action === "review-move") {
    const item = ensureReviewItem(target.dataset.id);
    item.move = item.move === target.dataset.move ? "" : target.dataset.move;
    save();
    render();
    if (item.move === "still") {
      app.querySelector(`[data-field="review-obstacle"][data-id="${target.dataset.id}"]`)?.focus();
    }
  }

  if (action === "export") exportData();
});

app.addEventListener("input", (event) => {
  const field = event.target.dataset.field;
  if (field === "finance") {
    ensureEntry(selectedKey).finance = event.target.value;
    save();
    paintMeta();
  }
  if (field === "god") {
    ensureEntry(selectedKey).god = event.target.value;
    save();
    paintMeta();
  }
  if (field === "area") {
    ensureEntry(selectedKey).areas[event.target.dataset.id] = event.target.value;
    save();
    paintMeta();
  }
  if (field === "focus") {
    ensureEntry(selectedKey).focus = event.target.value;
    save();
    paintMeta();
  }
  if (field === "rest-note") {
    ensureEntry(selectedKey).restNote = event.target.value;
    save();
    paintMeta();
  }
  if (field === "goal-title" || field === "goal-sign") {
    const goal = state.goals.find((item) => item.id === event.target.dataset.id);
    if (goal) goal[field === "goal-title" ? "title" : "sign"] = event.target.value;
    save();
  }
  if (field === "review-decision") {
    ensureReviewItem(event.target.dataset.id).decision = event.target.value;
    save();
    paintMeta();
  }
  if (field === "review-obstacle") {
    ensureReviewItem(event.target.dataset.id).obstacle = event.target.value;
    save();
    paintMeta();
  }
  if (field === "practice-note") {
    const entry = ensureEntry(selectedKey);
    const current = entry.health[event.target.dataset.id] || { done: false, note: "" };
    current.note = event.target.value;
    entry.health[event.target.dataset.id] = current;
    save();
    paintMeta();
  }
  if (event.target.name === "title" && event.target.form?.dataset.form === "add-practice") {
    ui.practiceDraft = event.target.value;
    ui.practiceError = "";
  }
  if (event.target.name === "label" && event.target.form?.dataset.form === "add-area") {
    ui.areaDraft = event.target.value;
    ui.areaError = "";
  }
  if (event.target.form?.dataset.form === "add-goal") {
    if (event.target.name === "title") ui.goalTitleDraft = event.target.value;
    if (event.target.name === "sign") ui.goalSignDraft = event.target.value;
    ui.goalError = "";
  }
  if (event.target.form?.dataset.form === "add-good" && event.target.name === "text") {
    ui.goodDraft = event.target.value;
    ui.goodError = "";
  }
  if (event.target.form?.dataset.form === "add-help" && event.target.name === "title") {
    ui.helpDraft = event.target.value;
    ui.helpError = "";
  }
});

app.addEventListener("change", (event) => {
  if (event.target.dataset.action === "toggle-practice") {
    const entry = ensureEntry(selectedKey);
    const current = entry.health[event.target.dataset.id] || { done: false, note: "" };
    current.done = event.target.checked;
    entry.health[event.target.dataset.id] = current;
    event.target.closest(".practice")?.classList.toggle("is-done", current.done);
    save();
    paintMeta();
  }
  if (event.target.dataset.action === "import") {
    importData(event.target.files?.[0]);
    event.target.value = "";
  }
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.dataset.form === "add-practice") {
    addPractice(new FormData(form).get("title") || "");
    render();
  }
  if (form.dataset.form === "add-area") {
    addArea(new FormData(form).get("label") || "");
    render();
  }
  if (form.dataset.form === "add-goal") {
    const data = new FormData(form);
    addGoal(data.get("title") || "", data.get("sign") || "");
    render();
  }
  if (form.dataset.form === "add-good") {
    if (selectedKey > todayKey()) return;
    const text = String(new FormData(form).get("text") || "").trim().replace(/\s+/g, " ");
    if (!text) {
      ui.goodError = "Напиши, что хорошего было, и нажми «Положить в копилку».";
      ui.goodDraft = "";
      render();
      return;
    }
    const entry = ensureGoods(selectedKey);
    entry.goods.push(text);
    ui.goodDraft = "";
    ui.goodError = "";
    save();
    render();
  }
  if (form.dataset.form === "add-help") {
    const title = String(new FormData(form).get("title") || "").trim().replace(/\s+/g, " ");
    if (!title) {
      ui.helpError = "Напиши, что тебе помогало, и нажми «Добавить».";
      render();
      return;
    }
    const helps = normalizeHelps(state.helps);
    if (helps.some((item) => item.toLocaleLowerCase("ru-RU") === title.toLocaleLowerCase("ru-RU"))) {
      ui.helpError = "Такое уже есть в списке.";
      ui.helpDraft = title;
      render();
      return;
    }
    if (helps.length >= 12) {
      ui.helpError = "Двенадцать пунктов — потолок. Убери один, если нужен новый.";
      ui.helpDraft = title;
      render();
      return;
    }
    helps.push(title);
    state.helps = helps;
    ui.helpDraft = "";
    ui.helpError = "";
    save();
    render();
  }
  if (form.dataset.form === "breath-custom") {
    const data = new FormData(form);
    const wasBreathing = ui.breathing;
    stopBreathing();
    state.breath = normalizeBreath({
      preset: "custom",
      in: data.get("in"),
      hold: data.get("hold"),
      out: data.get("out"),
      rest: data.get("rest")
    });
    ui.breathSetup = true;
    save();
    render();
    if (wasBreathing) {
      ui.breathing = true;
      render();
      startBreathing();
    }
  }
  if (form.dataset.form === "rename-practice") {
    const title = String(new FormData(form).get("title") || "").trim().replace(/\s+/g, " ");
    const practice = state.practices.find((item) => item.id === form.dataset.id);
    if (practice && title) {
      const duplicate = state.practices.some((item) => item.id !== practice.id && sameTitle(item.title, title));
      if (!duplicate) practice.title = title;
    }
    ui.editingPracticeId = null;
    save();
    render();
  }
});

function exportData() {
  const blob = new Blob([JSON.stringify({
    app: "life-coach",
    version: 2,
    exportedAt: new Date().toISOString(),
    ...state
  }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `coach-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      if (!data || !Array.isArray(data.practices) || !Array.isArray(data.areas) || typeof data.entries !== "object") {
        window.alert("В файле нет данных коуча.");
        return;
      }
      state = {
        practices: data.practices,
        areas: data.areas,
        goals: Array.isArray(data.goals) ? data.goals.slice(0, 3) : [],
        seasonStart: typeof data.seasonStart === "string" ? data.seasonStart : "",
        reviews: data.reviews && typeof data.reviews === "object" ? data.reviews : {},
        entries: data.entries || {},
        tipsDismissed: Boolean(data.tipsDismissed),
        helps: normalizeHelps(data.helps),
        breath: normalizeBreath(data.breath)
      };
      ui.tipsOpen = !state.tipsDismissed;
      save();
      render();
    } catch {
      window.alert("Не получилось прочитать файл.");
    }
  };
  reader.readAsText(file);
}

render();
