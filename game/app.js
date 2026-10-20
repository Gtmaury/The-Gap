import { allSentences, collections as seedCollections, pairs } from "./data.js?v=10";
import {
  applyAnswer,
  blankProgress,
  buildRound,
  bumpCollectionDay,
  bumpDay,
  clozeWords,
  dayKey,
  distractors,
  filterByStatus,
  goalJustMet,
  gradeClozes,
  intervalLabels,
  libraryPayload,
  markPlayed,
  masteryPercent,
  mergeLibrary,
  nextReviewLabel,
  pairSettings,
  sentenceParts,
  sentenceStatus,
  setMastery,
  setReady,
  summarize,
  touchStudied,
} from "./engine.js?v=14";

const STORAGE_KEY = "blankline-v2";
const seedSentences = allSentences();

const state = load();
const view = {
  screen: "dashboard",
  collectionId: null,
  query: "",
  round: [],
  index: 0,
  picked: "",
  result: null,
  hint: false,
  grammar: false,
  mode: "collection",
  editor: null,
  listening: false,
  listenPaused: false,
  listenRound: false,
  filter: "all",
  visible: 40,
  selected: {},
  picks: [],
  slotIndex: 0,
  startedAt: 0,
};

const app = document.querySelector("#app");
let listenQueue = [];
let listenGeneration = 0;

function load() {
  const fallback = {
    progress: {},
    streak: { count: 0, lastDay: "" },
    maxReviews: 10,
    reminder: false,
    pairId: "en-es",
    offline: {},
    customCollections: [],
    customSentences: [],
    lastSaved: 0,
    roundsPlayed: 0,
    dailyGoal: 10,
    today: null,
    collectionDays: {},
    lastStudied: {},
    pairSettings: {},
    theme: "",
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return saved ? { ...fallback, ...saved, progress: saved.progress || {} } : fallback;
  } catch {
    return fallback;
  }
}

function save() {
  state.lastSaved = Date.now();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      progress: state.progress,
      streak: state.streak,
      maxReviews: state.maxReviews,
      reminder: state.reminder,
      pairId: state.pairId,
      offline: state.offline,
      customCollections: state.customCollections,
      customSentences: state.customSentences,
      lastSaved: state.lastSaved,
      roundsPlayed: state.roundsPlayed,
      dailyGoal: state.dailyGoal,
      today: state.today,
      collectionDays: state.collectionDays,
      lastStudied: state.lastStudied,
      pairSettings: state.pairSettings,
      theme: state.theme,
    }),
  );
}

function entry(id) {
  return { ...blankProgress(), ...state.progress[id] };
}

function put(id, patch) {
  state.progress[id] = { ...entry(id), ...patch };
  save();
}

function catalog() {
  const custom = state.customCollections.map((collection) => ({
    ...collection,
    custom: true,
  }));
  return [...seedCollections, ...custom].filter((collection) => collection.pairId === state.pairId);
}

function sentences() {
  const custom = state.customSentences.map((sentence) => ({ ...sentence, custom: true }));
  return [...seedSentences, ...custom].filter((sentence) => sentence.pairId === state.pairId);
}

function sentenceById(id) {
  return [...seedSentences, ...state.customSentences].find((sentence) => sentence.id === id);
}

function collectionById(id) {
  return [...seedCollections, ...state.customCollections].find((collection) => collection.id === id);
}

function currentSettings() {
  return pairSettings(state.pairSettings, state.pairId);
}

function offlineSentences(collectionId = null) {
  return sentences().filter((sentence) => {
    if (collectionId && sentence.collectionId !== collectionId) return false;
    return Boolean(state.offline[sentence.collectionId]);
  });
}

function preferredTheme() {
  if (state.theme === "light" || state.theme === "dark") return state.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme() {
  document.documentElement.dataset.theme = preferredTheme();
}

function wordmark() {
  const mark = document.createElement("p");
  mark.className = "mark";
  const gap = document.createElement("span");
  gap.textContent = "Gap";
  mark.append(document.createTextNode("The "), gap);
  return mark;
}

function render() {
  const shell = document.createElement("div");
  shell.append(wordmark(), nav(), screen());
  app.replaceChildren(shell);
}

function nav() {
  const bar = document.createElement("nav");
  bar.className = "nav";
  for (const [id, label] of [
    ["dashboard", "Dashboard"],
    ["collections", "Collections"],
    ["search", "Search"],
    ["settings", "Settings"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = view.screen === id ? "nav-on" : "ghost";
    button.textContent = label;
    button.addEventListener("click", () => {
      stopListening();
      view.screen = id;
      view.query = "";
      render();
    });
    bar.append(button);
  }
  const themeButton = document.createElement("button");
  themeButton.type = "button";
  themeButton.className = "ghost";
  themeButton.textContent = preferredTheme() === "dark" ? "Light" : "Dark";
  themeButton.addEventListener("click", () => {
    state.theme = preferredTheme() === "dark" ? "light" : "dark";
    applyTheme();
    save();
    render();
  });
  bar.append(themeButton);
  return bar;
}

function screen() {
  if (view.screen === "collections") return collectionsView();
  if (view.screen === "collection") return collectionView();
  if (view.screen === "play") return playView();
  if (view.screen === "search") return searchView();
  if (view.screen === "settings") return settingsView();
  if (view.screen === "editor") return editorView();
  return dashboardView();
}

function dashboardView() {
  const root = document.createElement("main");
  const pair = pairs.find((item) => item.id === state.pairId);
  root.append(title("Dashboard"), pairSelect());
  const stats = summarize(offlineSentences(), state.progress);
  const list = document.createElement("dl");
  list.className = "stats";
  for (const [label, value] of [
    ["Sentences offline", stats.total],
    ["Playing", stats.playing],
    ["Mastered", stats.mastered],
    ["Ready for review", stats.ready],
    ["Streak", state.streak.count === 1 ? "1 day" : state.streak.count ? `${state.streak.count} days` : "none yet"],
    ["Today", `${state.today?.day === dayKey(Date.now()) ? state.today.correct : 0} / ${state.dailyGoal || 10}`],
    ["Rounds", state.roundsPlayed || 0],
  ]) {
    const row = document.createElement("div");
    const name = document.createElement("dt");
    name.textContent = label;
    const number = document.createElement("dd");
    number.textContent = String(value);
    row.className = label === "Today" || label === "Streak" ? "emphasis" : "";
    row.append(name, number);
    list.append(row);
  }
  const primary = document.createElement("div");
  primary.className = "actions";
  primary.append(
    solid("Play ready reviews", () => startRound({ reviewsOnly: true, roundSize: 20, mode: "reviews" })),
    solid("Play new sentences", () => startRound({ newOnly: true, mode: "new" })),
    solid("Play every collection", () => startRound({ mode: "all", shuffle: true })),
  );
  const secondary = document.createElement("div");
  secondary.className = "actions quiet";
  secondary.append(
    ghost("Play favorites", () => startRound({ favoritesOnly: true, mode: "favorites" })),
    ghost("Only sentences I've played", () => startRound({ playedOnly: true, mode: "played" })),
    ghost("Random collection", playRandomCollection),
    ghost("Listen and answer", () => startRound({ newOnly: true, mode: "listen", listenRound: true })),
    ghost(view.listening ? "Stop listening" : "Listen through reviews", toggleListen),
  );
  if (view.listening) {
    secondary.append(
      ghost(view.listenPaused ? "Resume" : "Pause", () => {
        view.listenPaused = !view.listenPaused;
        if (view.listenPaused) window.speechSynthesis?.pause();
        else window.speechSynthesis?.resume();
        render();
      }),
      ghost("Next sentence", nextListen),
    );
  }
  const note = document.createElement("p");
  note.className = "lede";
  const goalLeft = Math.max(0, (state.dailyGoal || 10) - (state.today?.day === dayKey(Date.now()) ? state.today.correct : 0));
  note.textContent = goalLeft
    ? `${goalLeft} correct answers left to keep today's streak. ${pair.language} practice stays on this device.`
    : `Daily goal reached. ${pair.language} practice stays on this device.`;
  root.append(list, primary, secondary, note);
  return root;
}

function collectionsView() {
  const root = document.createElement("main");
  root.append(title("Collections"), searchBox("Search collections", () => render()));
  const query = view.query.trim().toLowerCase();
  for (const collection of catalog()) {
    if (query && !collection.name.toLowerCase().includes(query)) continue;
    const items = sentences().filter((sentence) => sentence.collectionId === collection.id);
    const row = document.createElement("article");
    row.className = "row";
    const copy = document.createElement("div");
    const heading = document.createElement("h2");
    heading.textContent = collection.name;
    const meta = document.createElement("p");
    meta.className = "meta";
    const downloaded = Boolean(state.offline[collection.id]);
    const studied = state.lastStudied?.[collection.id];
    const day = state.collectionDays?.[collection.id];
    const today = day?.day === dayKey(Date.now())
      ? ` Today ${day.correct} correct of ${day.played}, ${Math.round(day.elapsedMs / 1000)}s.`
      : "";
    const playable = items.filter((sentence) => {
      const progress = state.progress[sentence.id];
      if (!progress || progress.ignored) return !progress?.ignored;
      return masteryPercent(progress.level) < 100;
    }).length;
    meta.textContent = downloaded
      ? `${items.length.toLocaleString()} sentences, ${playable.toLocaleString()} left to play, saved offline.${today}${studied ? ` Last studied ${new Date(studied).toLocaleDateString()}.` : ""}`
      : `${items.length.toLocaleString()} sentences, not downloaded`;
    if (collection.credit) {
      const credit = document.createElement("p");
      credit.className = "meta";
      credit.textContent = collection.credit;
      copy.append(heading, meta, credit);
    } else {
      copy.append(heading, meta);
    }
    const actions = document.createElement("div");
    actions.className = "actions";
    if (downloaded) {
      actions.append(
        solid("Play", () => startRound({ collectionId: collection.id, mode: "collection" })),
        ghost("Manage", () => openCollection(collection.id)),
        ghost("Remove download", () => removeDownload(collection)),
      );
    } else {
      actions.append(solid("Download", () => download(collection.id)));
    }
    row.append(copy, actions);
    root.append(row);
  }
  root.append(ghost("Create a new collection", () => openEditor({ kind: "collection" })));
  return root;
}

function collectionView() {
  const collection = collectionById(view.collectionId);
  const root = document.createElement("main");
  if (!collection) return root;
  root.append(back("Collections", "collections"), title(collection.name));
  root.append(searchBox("Search this collection", () => render()));
  const filters = document.createElement("div");
  filters.className = "actions";
  for (const status of ["all", "new", "playing", "ready", "mastered", "ignored"]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = view.filter === status ? "nav-on" : "ghost";
    button.textContent = status;
    button.addEventListener("click", () => {
      view.filter = status;
      view.visible = 40;
      render();
    });
    filters.append(button);
  }
  root.append(filters);
  const query = view.query.trim().toLowerCase();
  let items = sentences().filter((sentence) => sentence.collectionId === collection.id);
  if (view.filter !== "all") items = filterByStatus(items, state.progress, view.filter);
  items = items.filter((sentence) => {
    if (!query) return true;
    return `${sentence.meaning} ${sentence.text} ${clozeWords(sentence).join(" ")}`.toLowerCase().includes(query);
  });
  if (!items.length) {
    const empty = document.createElement("p");
    empty.textContent = "No sentences.";
    root.append(empty);
  }
  const shown = items.slice(0, view.visible || 40);
  for (const sentence of shown) {
    root.append(sentenceRow(sentence));
  }
  if (shown.length < items.length) {
    root.append(
      ghost(`Show more, ${items.length - shown.length} left`, () => {
        view.visible = (view.visible || 40) + 40;
        render();
      }),
    );
  }
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    solid("Play", () => startRound({ collectionId: collection.id, mode: "collection" })),
    ghost("Add all to review", () => {
      const now = Date.now();
      for (const sentence of sentences().filter((item) => item.collectionId === collection.id)) {
        state.progress[sentence.id] = setReady(entry(sentence.id), now);
      }
      save();
      render();
    }),
    ghost("Add a sentence", () => openEditor({ kind: "sentence", collectionId: collection.id })),
    ghost("Add selected to reviews", addSelectedToReviews),
  );
  const mine = state.customCollections.filter((item) => item.pairId === state.pairId);
  if (mine.length) {
    const menu = menuSelect(mine.map((target) => ({ value: target.id, label: target.name })), mine[0].id);
    actions.append(menu, ghost("Add selected to collection", () => addSelectedToCollection(menu.value)));
  }
  root.append(actions);
  return root;
}

function sentenceRow(sentence) {
  const stateForSentence = entry(sentence.id);
  const row = document.createElement("article");
  row.className = "row";
  if (view.screen === "collection") {
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = Boolean(view.selected[sentence.id]);
    box.setAttribute("aria-label", `Select ${sentence.meaning}`);
    box.addEventListener("change", () => {
      view.selected[sentence.id] = box.checked;
    });
    row.append(box);
  }
  const copy = document.createElement("div");
  const heading = document.createElement("h2");
  heading.textContent = sentence.meaning;
  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${sentenceStatus(stateForSentence)}, ${masteryPercent(stateForSentence.level)}% mastered. ${nextReviewLabel(stateForSentence, Date.now())}`;
  copy.append(heading, meta);
  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    ghost(stateForSentence.favorite ? "Saved" : "Save", () => {
      put(sentence.id, { favorite: !stateForSentence.favorite });
      render();
    }),
    ghost("Add to reviews", () => {
      put(sentence.id, setReady(stateForSentence, Date.now()));
      render();
    }),
    ghost("Edit", () => openEditor({ kind: "sentence", sentence })),
    ghost(stateForSentence.ignored ? "Use again" : "Ignore", () => {
      put(sentence.id, { ignored: !stateForSentence.ignored });
      render();
    }),
  );
  row.append(copy, actions);
  return row;
}

function searchView() {
  const root = document.createElement("main");
  root.append(title("Search sentences"), searchBox("Search words or meanings", () => render()));
  const query = view.query.trim().toLowerCase();
  if (!query) {
    const lede = document.createElement("p");
    lede.className = "lede";
    lede.textContent = "Find a sentence, then add it to one of your collections.";
    root.append(lede);
    return root;
  }
  const found = sentences().filter((sentence) =>
    `${sentence.meaning} ${sentence.text} ${sentence.cloze}`.toLowerCase().includes(query),
  );
  if (!found.length) {
    const empty = document.createElement("p");
    empty.textContent = "No sentences.";
    root.append(empty);
    return root;
  }
  for (const sentence of found.slice(0, 30)) {
    const row = sentenceRow(sentence);
    const mine = state.customCollections.filter((collection) => collection.pairId === state.pairId);
    if (mine.length) {
      const menu = menuSelect(mine.map((collection) => ({ value: collection.id, label: collection.name })), mine[0].id);
      const add = ghost("Add to collection", () => copyInto(sentence, menu.value));
      row.append(menu, add);
    }
    root.append(row);
  }
  return root;
}

function settingsView() {
  const root = document.createElement("main");
  root.append(title("Review settings"), pairSelect());
  const settings = currentSettings();
  const label = document.createElement("label");
  label.className = "setting";
  const text = document.createElement("span");
  text.textContent = `Max reviews per round when playing new sentences: ${settings.maxReviews}`;
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "50";
  slider.value = String(settings.maxReviews);
  slider.addEventListener("input", () => {
    const next = currentSettings();
    next.maxReviews = Number(slider.value);
    state.pairSettings[state.pairId] = next;
    text.textContent = `Max reviews per round when playing new sentences: ${next.maxReviews}`;
    save();
  });
  label.append(text, slider);

  const goal = field("Daily goal", "10", String(state.dailyGoal || 10));
  goal.input.addEventListener("change", () => {
    const value = Number(goal.input.value);
    if (value > 0) state.dailyGoal = value;
    save();
    render();
  });

  const hours = field(
    "Review intervals in hours, after a new sentence",
    "4, 24, 72, 168, 504, 1440",
    settings.intervalHours.slice(1).join(", "),
  );
  hours.input.addEventListener("change", () => {
    const parsed = hours.input.value
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((part) => Number.isFinite(part) && part >= 0);
    if (!parsed.length) return;
    const next = currentSettings();
    next.intervalHours = [0, ...parsed];
    state.pairSettings[state.pairId] = next;
    save();
    render();
  });

  const intervals = document.createElement("ol");
  intervals.className = "intervals";
  for (const interval of intervalLabels(settings.intervalHours)) {
    const item = document.createElement("li");
    item.textContent = interval;
    intervals.append(item);
  }

  const reminder = document.createElement("label");
  reminder.className = "check";
  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = state.reminder;
  box.addEventListener("change", async () => {
    state.reminder = box.checked;
    save();
    if (state.reminder && "Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  });
  reminder.append(box, document.createTextNode(" Daily reminder on this device"));

  const saved = document.createElement("p");
  saved.className = "meta";
  saved.textContent = state.lastSaved
    ? `Last save ${new Date(state.lastSaved).toLocaleString()}. This does not sign in to Clozemaster.`
    : "Nothing saved yet.";

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    ghost("Reset streak", () => {
      if (!window.confirm("This will reset your daily goal streak.")) return;
      state.streak = { count: 0, lastDay: "" };
      save();
      render();
    }),
  );
  actions.append(
    ghost("Export my collections", exportLibrary),
    ghost("Import collections", () => importInput.click()),
  );
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = "application/json";
  importInput.hidden = true;
  importInput.addEventListener("change", () => importLibrary(importInput.files?.[0]));
  root.append(label, goal.label, hours.label, title("Review intervals"), intervals, reminder, saved, actions, importInput);
  return root;
}

function editorView() {
  const root = document.createElement("main");
  const editor = view.editor;
  if (!editor) return root;
  if (editor.kind === "collection") {
    root.append(back("Collections", "collections"), title("Create a new collection"));
    const form = document.createElement("form");
    form.className = "form";
    const name = field("Name", "Kitchen stories");
    form.append(name.label);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = name.input.value.trim();
      if (!value) return;
      const pair = pairs.find((item) => item.id === state.pairId);
      const id = `custom-${Date.now()}`;
      state.customCollections.push({
        id,
        pairId: pair.id,
        language: pair.language,
        from: pair.from,
        name: value,
        voice: pair.voice,
        custom: true,
      });
      state.offline[id] = true;
      save();
      openCollection(id);
    });
    form.append(submitButton("Save collection"));
    root.append(form);
    return root;
  }

  const existing = editor.sentence;
  const practicingEnglish = state.pairId === "es-en";
  root.append(back("Collection", "collection"), title(existing ? "Edit sentence" : "Add a sentence"));
  const form = document.createElement("form");
  form.className = "form";
  const meaning = field("Meaning", practicingEnglish ? "El café está caliente." : "The coffee is hot.", existing?.meaning || "");
  const text = field("Sentence", practicingEnglish ? "The coffee is hot." : "El café está caliente.", existing?.text || "");
  const cloze = field("Missing word", practicingEnglish ? "hot" : "caliente", existing?.cloze || "");
  const grammar = field("Grammar note", "está agrees with the coffee", existing?.grammar || "");
  const pronunciation = field(
    "Pronunciation",
    "kah-lyen-teh",
    existing ? entry(existing.id).pronunciation : "",
  );
  const notes = field("Notes", "Remember the accent.", existing ? entry(existing.id).notes : "", true);
  const report = field("Report a problem", "The sentence is unclear.", existing ? entry(existing.id).report : "", true);
  form.append(meaning.label, text.label, cloze.label, grammar.label, pronunciation.label, notes.label, report.label);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = {
      meaning: meaning.input.value.trim(),
      text: text.input.value.trim(),
      cloze: cloze.input.value.trim(),
      grammar: grammar.input.value.trim(),
    };
    const words = next.cloze.split("|").map((word) => word.trim()).filter(Boolean);
    if (!next.meaning || !next.text || !words.length || words.some((word) => !next.text.includes(word))) {
      window.alert("Each missing word has to appear in the sentence. Separate more than one with |.");
      return;
    }
    next.cloze = words.join("|");
    next.clozes = words;
    const pair = pairs.find((item) => item.id === state.pairId);
    let id = existing?.id;
    if (!existing || !existing.custom) {
      id = `${editor.collectionId || existing?.collectionId}-${Date.now()}`;
      state.customSentences.push({
        id,
        collectionId: editor.collectionId || existing.collectionId,
        pairId: pair.id,
        language: pair.language,
        from: pair.from,
        voice: pair.voice,
        collectionName: collectionById(editor.collectionId || existing.collectionId)?.name || "",
        ...next,
        custom: true,
      });
    } else {
      const index = state.customSentences.findIndex((sentence) => sentence.id === existing.id);
      state.customSentences[index] = { ...state.customSentences[index], ...next };
    }
    put(id, {
      pronunciation: pronunciation.input.value.trim(),
      notes: notes.input.value.trim(),
      report: report.input.value.trim(),
      translation: next.meaning,
    });
    view.screen = "collection";
    render();
  });
  form.append(submitButton("Save sentence"));
  root.append(form);
  return root;
}

function playView() {
  const root = document.createElement("main");
  root.append(back("Back", view.mode === "collection" ? "collection" : "dashboard"));
  const sentence = view.round[view.index];
  if (!sentence) {
    const empty = document.createElement("p");
    empty.className = "lede";
    empty.textContent = offlineSentences().length
      ? view.mode === "reviews"
        ? "No more reviews."
        : "Nothing is waiting in this round."
      : "Download a collection first. Play starts after it is saved on this device.";
    root.append(empty);
    return root;
  }
  const progress = entry(sentence.id);
  const words = clozeWords(sentence);
  const settings = pairSettings(state.pairSettings, sentence.pairId || state.pairId);
  const status = document.createElement("p");
  status.className = "progress-label";
  status.textContent = `${sentence.collectionName}, ${view.index + 1} of ${view.round.length}, ${masteryPercent(progress.level, Math.max(1, settings.intervalHours.length - 1))}% mastered`;
  const hideText = view.listenRound && !view.result;
  const meaning = document.createElement("p");
  meaning.className = "meaning";
  meaning.textContent = hideText ? "Listen, then fill the missing word." : progress.translation || sentence.meaning;
  const line = document.createElement("p");
  line.className = "sentence";
  if (hideText) {
    line.textContent = "The sentence is hidden.";
    if (view.spokenFor !== sentence.id) {
      view.spokenFor = sentence.id;
      queueMicrotask(() => speakSentence(sentence));
    }
  } else {
    let slotIndex = 0;
    for (const part of sentenceParts(sentence.text, words)) {
      if (part.type === "text") {
        line.append(part.value);
        continue;
      }
      const index = slotIndex;
      slotIndex += 1;
      const slot = document.createElement("span");
      slot.className = index === view.slotIndex && !view.result ? "slot active" : "slot";
      const filled = view.result ? words[index] : view.picks[index];
      slot.textContent = filled || (view.hint ? words[index].slice(0, 1) : "\u00a0");
      slot.addEventListener("click", () => {
        view.slotIndex = index;
        render();
      });
      line.append(slot);
    }
  }
  root.append(status, meaning, line);
  if (!hideText && !view.result) {
    const tokens = document.createElement("div");
    tokens.className = "chips";
    for (const token of sentence.text.split(/(\s+)/)) {
      if (!token.trim() || !/^[\p{L}]/u.test(token)) continue;
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = token.replace(/[^\p{L}\p{M}-]/gu, "");
      chip.addEventListener("click", () => {
        view.picks[view.slotIndex] = chip.textContent;
        if (view.slotIndex < words.length - 1) view.slotIndex += 1;
        render();
      });
      tokens.append(chip);
    }
    root.append(tokens);
  }

  if (view.grammar && sentence.grammar) {
    const note = document.createElement("p");
    note.className = "meta";
    note.textContent = sentence.grammar;
    root.append(note);
  }
  if (progress.pronunciation) {
    const spoken = document.createElement("p");
    spoken.className = "meta";
    spoken.textContent = progress.pronunciation;
    root.append(spoken);
  }

  if (!view.result) {
    if (!view.listenRound) {
      const chips = document.createElement("div");
      chips.className = "chips";
      const target = words[view.slotIndex] || words[0];
      for (const choice of shuffle([target, ...distractors(sentence, sentences())])) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.textContent = choice;
        chip.setAttribute("aria-pressed", String(view.picks[view.slotIndex] === choice));
        chip.addEventListener("click", () => {
          view.picks[view.slotIndex] = view.picks[view.slotIndex] === choice ? "" : choice;
          render();
        });
        chips.append(chip);
      }
      root.append(chips);
    }
    const form = document.createElement("form");
    form.className = "type-row";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "or type the word";
    input.autocomplete = "off";
    const speak = ghost("Speak", () => hearAnswer(input));
    form.append(input, speak, submitButton("Fill the gap"));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const answers = words.map((word, index) => {
        if (index === view.slotIndex && input.value.trim()) return input.value.trim();
        return view.picks[index] || "";
      });
      grade(sentence, answers);
    });
    root.append(form);
    queueMicrotask(() => input.focus());
  } else {
    const feedback = document.createElement("div");
    feedback.className = `feedback ${view.result.correct ? "good" : "miss"}`;
    const message = document.createElement("p");
    message.textContent = view.result.correct
      ? `That is ${words.join(", ")}.`
      : `The word is ${words.join(", ")}.`;
    const links = document.createElement("p");
    links.className = "links";
    for (const [label, href] of dictionaryLinks(words[0], sentence.language, sentence.from)) {
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      anchor.textContent = label;
      links.append(anchor);
    }
    feedback.append(message, links);
    root.append(feedback);
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.append(
    ghost("Listen", () => speakSentence(sentence)),
    ghost(view.hint ? "Hide hint" : "Hint", () => {
      view.hint = !view.hint;
      render();
    }),
    ghost(view.grammar ? "Hide grammar" : "Grammar", () => {
      view.grammar = !view.grammar;
      render();
    }),
    ghost(progress.favorite ? "Saved" : "Save", () => {
      put(sentence.id, { favorite: !progress.favorite });
      render();
    }),
    ghost("Skip later", () => skipLater(sentence.id)),
    ghost(progress.ignored ? "Ignored" : "Ignore", () => ignore(sentence.id)),
    ghost("Ready for review", () => {
      put(sentence.id, setReady(progress, Date.now()));
      render();
    }),
    ghost("100% mastered", () => {
      put(sentence.id, setMastery(progress, true, Date.now()));
      render();
    }),
    ghost("Reset to 0%", () => {
      put(sentence.id, setMastery(progress, false, Date.now()));
      render();
    }),
    ghost("Report", () => openEditor({ kind: "sentence", sentence, collectionId: sentence.collectionId })),
    ghost("Share", () => shareSentence(sentence)),
    ghost(progress.recording ? "Play recording" : "Record", () => recordPronunciation(sentence.id, progress.recording)),
  );
  if (view.result) actions.append(solid("Next", nextSentence));
  if (progress.notes) {
    const notes = document.createElement("p");
    notes.className = "meta";
    notes.textContent = progress.notes;
    root.append(notes);
  }
  root.append(actions);
  return root;
}

function startRound(options) {
  const source = offlineSentences(options.collectionId || null);
  const round = buildRound(source, state.progress, {
    collectionId: options.collectionId || null,
    favoritesOnly: Boolean(options.favoritesOnly),
    playedOnly: Boolean(options.playedOnly),
    reviewsOnly: Boolean(options.reviewsOnly),
    newOnly: Boolean(options.newOnly),
    shuffle: Boolean(options.shuffle),
    maxReviews: currentSettings().maxReviews,
    roundSize: options.roundSize || 8,
  });
  view.round = round;
  view.index = 0;
  view.picked = "";
  view.picks = [];
  view.slotIndex = 0;
  view.result = null;
  view.hint = false;
  view.grammar = false;
  view.spokenFor = "";
  view.listenRound = Boolean(options.listenRound);
  view.startedAt = Date.now();
  view.mode = options.mode;
  view.collectionId = options.collectionId || view.collectionId;
  view.screen = "play";
  render();
}

function grade(sentence, given) {
  const answers = Array.isArray(given) ? given : [given];
  if (answers.some((answer) => !String(answer || "").trim())) return;
  const correct = gradeClozes(answers, sentence);
  const now = Date.now();
  const elapsed = view.startedAt ? now - view.startedAt : 0;
  const before = state.today;
  state.today = bumpDay(state.today, { correct, elapsedMs: elapsed }, now);
  state.collectionDays = bumpCollectionDay(state.collectionDays, sentence.collectionId, { correct, elapsedMs: elapsed }, now);
  state.lastStudied = touchStudied(state.lastStudied, sentence.collectionId, now);
  const settings = pairSettings(state.pairSettings, sentence.pairId || state.pairId);
  state.progress[sentence.id] = applyAnswer(entry(sentence.id), correct, now, settings.intervalHours);
  if (correct && goalJustMet(before, state.today, state.dailyGoal || 10)) {
    state.streak = markPlayed(state.streak, now);
  }
  save();
  maybeRemind();
  view.result = { correct, given: answers.join(", ") };
  render();
}

function skipLater(id) {
  view.round = view.round.filter((sentence) => sentence.id !== id);
  view.result = null;
  view.picked = "";
  view.picks = [];
  view.slotIndex = 0;
  if (view.index >= view.round.length) view.index = Math.max(0, view.round.length - 1);
  render();
}

function ignore(id) {
  put(id, { ignored: true });
  view.round = view.round.filter((sentence) => sentence.id !== id);
  view.result = null;
  view.picked = "";
  if (view.index >= view.round.length) view.index = Math.max(0, view.round.length - 1);
  render();
}

function nextSentence() {
  view.result = null;
  view.picked = "";
  view.picks = [];
  view.slotIndex = 0;
  view.hint = false;
  view.spokenFor = "";
  view.startedAt = Date.now();
  view.index += 1;
  if (view.index >= view.round.length) {
    state.roundsPlayed = (state.roundsPlayed || 0) + 1;
    save();
    view.screen = "dashboard";
    view.listenRound = false;
  }
  render();
}

function download(id) {
  state.offline[id] = true;
  save();
  render();
}

function removeDownload(collection) {
  const message = collection.custom
    ? "Delete this collection from this device?"
    : "Remove the offline copy of this collection?";
  if (!window.confirm(message)) return;
  delete state.offline[collection.id];
  if (collection.custom) {
    state.customCollections = state.customCollections.filter((item) => item.id !== collection.id);
    state.customSentences = state.customSentences.filter((item) => item.collectionId !== collection.id);
  }
  save();
  render();
}

function copyInto(sentence, collectionId, stay = false) {
  const collection = collectionById(collectionId);
  state.customSentences.push({
    ...sentence,
    id: `${collectionId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    collectionId,
    collectionName: collection.name,
    custom: true,
  });
  state.offline[collectionId] = true;
  save();
  if (!stay) openCollection(collectionId);
}

function openCollection(id) {
  view.collectionId = id;
  view.screen = "collection";
  view.query = "";
  view.visible = 40;
  render();
}

function openEditor(editor) {
  view.editor = editor;
  view.screen = "editor";
  render();
}

function pairSelect() {
  const label = document.createElement("label");
  label.className = "setting";
  const text = document.createElement("span");
  text.textContent = "Language";
  const menu = menuSelect(
    pairs.map((pair) => ({ value: pair.id, label: `${pair.from} to ${pair.language}` })),
    state.pairId,
    (value) => {
      state.pairId = value;
      save();
      render();
    },
  );
  label.append(text, menu);
  return label;
}

function menuSelect(options, value, onChange) {
  let current = options.find((item) => item.value === value) || options[0];
  const wrap = document.createElement("div");
  wrap.className = "menu";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "menu-button";
  button.textContent = current ? current.label : "";
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");
  const list = document.createElement("div");
  list.className = "menu-list";
  list.hidden = true;
  list.setAttribute("role", "listbox");
  for (const item of options) {
    const choice = document.createElement("button");
    choice.type = "button";
    choice.className = "menu-option";
    choice.textContent = item.label;
    choice.setAttribute("role", "option");
    choice.setAttribute("aria-selected", String(item.value === current?.value));
    choice.addEventListener("click", (event) => {
      event.stopPropagation();
      current = item;
      button.textContent = item.label;
      for (const option of list.children) option.setAttribute("aria-selected", String(option === choice));
      list.hidden = true;
      button.setAttribute("aria-expanded", "false");
      if (onChange) onChange(item.value);
    });
    list.append(choice);
  }
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = list.hidden;
    for (const open of document.querySelectorAll(".menu-list")) open.hidden = true;
    for (const opener of document.querySelectorAll(".menu-button")) opener.setAttribute("aria-expanded", "false");
    list.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
  });
  wrap.append(button, list);
  Object.defineProperty(wrap, "value", { get: () => current?.value || "" });
  return wrap;
}

function searchBox(placeholder, onInput) {
  const input = document.createElement("input");
  input.className = "search";
  input.type = "search";
  input.placeholder = placeholder;
  input.value = view.query;
  input.addEventListener("input", () => {
    view.query = input.value;
    onInput();
  });
  return input;
}

function title(text) {
  const heading = document.createElement("h1");
  heading.textContent = text;
  return heading;
}

function back(label, screenName) {
  const button = document.createElement("button");
  button.className = "back";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", () => {
    view.screen = screenName;
    view.query = "";
    render();
  });
  return button;
}

function solid(label, onClick) {
  return button(label, onClick, "solid");
}

function ghost(label, onClick) {
  return button(label, onClick, "ghost");
}

function button(label, onClick, kind) {
  const element = document.createElement("button");
  element.type = "button";
  element.className = kind;
  element.textContent = label;
  element.addEventListener("click", onClick);
  return element;
}

function submitButton(label) {
  const element = document.createElement("button");
  element.type = "submit";
  element.className = "solid";
  element.textContent = label;
  return element;
}

function field(labelText, placeholder, value = "", area = false) {
  const label = document.createElement("label");
  label.className = "field";
  const span = document.createElement("span");
  span.textContent = labelText;
  const input = area ? document.createElement("textarea") : document.createElement("input");
  if (!area) input.type = "text";
  input.placeholder = placeholder;
  input.value = value;
  label.append(span, input);
  return { label, input };
}

function dictionaryLinks(word, language, from = "English") {
  const query = encodeURIComponent(word);
  const target = { English: "en", Spanish: "es", French: "fr" }[from] || "en";
  const links = [
    ["Google Translate", `https://translate.google.com/?sl=auto&tl=${target}&text=${query}&op=translate`],
    ["Tatoeba", `https://tatoeba.org/en/sentences/search?query=${query}`],
    ["Forvo", `https://forvo.com/word/${query}/`],
  ];
  if (language === "Spanish") links.push(["SpanishDict", `https://www.spanishdict.com/translate/${query}`]);
  if (language === "French") links.push(["WordReference", `https://www.wordreference.com/fren/${query}`]);
  if (language === "English") links.push(["WordReference", `https://www.wordreference.com/enes/${query}`]);
  return links;
}

function speakSentence(sentence) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(sentence.text);
  utterance.lang = sentence.voice;
  window.speechSynthesis.speak(utterance);
}

function hearAnswer(input) {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    window.alert("This browser has no speech input.");
    return;
  }
  const pair = pairs.find((item) => item.id === state.pairId);
  const recognition = new Recognition();
  recognition.lang = pair.voice;
  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript.split(" ")[0];
  };
  recognition.start();
}

function shareSentence(sentence) {
  const text = `${sentence.meaning}\n${sentence.text}`;
  if (navigator.share) navigator.share({ text }).catch(() => {});
  else navigator.clipboard?.writeText(text);
}

function toggleListen() {
  if (view.listening) {
    stopListening();
    render();
    return;
  }
  listenQueue = buildRound(offlineSentences(), state.progress, {
    reviewsOnly: true,
    roundSize: 20,
  });
  if (!listenQueue.length) return;
  view.listening = true;
  view.listenPaused = false;
  playNextListen();
  render();
}

function playNextListen() {
  const generation = ++listenGeneration;
  const sentence = listenQueue.shift();
  if (!sentence || !view.listening || !window.speechSynthesis) {
    stopListening();
    render();
    return;
  }
  const utterance = new SpeechSynthesisUtterance(sentence.text);
  utterance.lang = sentence.voice;
  utterance.onend = () => {
    if (generation !== listenGeneration || !view.listening || view.listenPaused) return;
    playNextListen();
  };
  window.speechSynthesis.speak(utterance);
}

function stopListening() {
  view.listening = false;
  view.listenPaused = false;
  listenQueue = [];
  listenGeneration += 1;
  window.speechSynthesis?.cancel();
}

function todayKey() {
  return dayKey(Date.now());
}

function playRandomCollection() {
  const downloaded = catalog().filter(
    (collection) =>
      state.offline[collection.id] &&
      sentences().some((sentence) => sentence.collectionId === collection.id),
  );
  if (!downloaded.length) return;
  const pick = downloaded[Math.floor(Math.random() * downloaded.length)];
  startRound({ collectionId: pick.id, mode: "collection", shuffle: true });
}

function selectedIds() {
  return Object.entries(view.selected).filter(([, on]) => on).map(([id]) => id);
}

function addSelectedToReviews() {
  const now = Date.now();
  for (const id of selectedIds()) state.progress[id] = setReady(entry(id), now);
  view.selected = {};
  save();
  render();
}

function addSelectedToCollection(collectionId) {
  for (const id of selectedIds()) {
    const sentence = sentenceById(id);
    if (sentence) copyInto(sentence, collectionId, true);
  }
  view.selected = {};
  openCollection(collectionId);
}

function exportLibrary() {
  const payload = libraryPayload(state.customCollections, state.customSentences);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "the-gap-library.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importLibrary(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const merged = mergeLibrary(state.customCollections, state.customSentences, JSON.parse(String(reader.result)));
      state.customCollections = merged.customCollections;
      state.customSentences = merged.customSentences;
      for (const collection of merged.customCollections) state.offline[collection.id] = true;
      save();
      view.screen = "collections";
      render();
    } catch (error) {
      window.alert(error.message);
    }
  };
  reader.readAsText(file);
}

function recordPronunciation(id, existing) {
  if (existing) {
    const audio = new Audio(existing);
    audio.play();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    window.alert("This browser cannot record audio.");
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const reader = new FileReader();
      reader.onload = () => {
        put(id, { recording: reader.result });
        render();
      };
      reader.readAsDataURL(new Blob(chunks, { type: recorder.mimeType || "audio/webm" }));
    };
    recorder.start();
    setTimeout(() => recorder.stop(), 2500);
  }).catch(() => window.alert("Microphone permission is required to record."));
}

function nextListen() {
  window.speechSynthesis?.cancel();
  view.listenPaused = false;
  playNextListen();
}

function maybeRemind() {
  if (!state.reminder || !("Notification" in window) || Notification.permission !== "granted") return;
  if (state.streak.lastDay === todayKey()) return;
  new Notification("The Gap", { body: "Practice today to keep the streak." });
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

applyTheme();
document.addEventListener("click", () => {
  for (const open of document.querySelectorAll(".menu-list")) open.hidden = true;
  for (const opener of document.querySelectorAll(".menu-button")) opener.setAttribute("aria-expanded", "false");
});
render();
