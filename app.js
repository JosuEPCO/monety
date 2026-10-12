"use strict";

const STORAGE_KEY = "monety-finances-v1";
const CURRENCY = "MXN";
const CATEGORIES = {
  expense: ["Vivienda", "Alimentación", "Transporte", "Salud", "Entretenimiento", "Servicios", "Compras", "Otros gastos"],
  income: ["Salario", "Freelance", "Inversiones", "Otros ingresos"],
};
const CATEGORY_ICONS = {
  Vivienda: "home", Alimentación: "food", Transporte: "car", Salud: "heart",
  Entretenimiento: "ticket", Servicios: "bolt", Compras: "shopping",
  "Otros gastos": "more", Salario: "briefcase", Freelance: "laptop",
  Inversiones: "chart", "Otros ingresos": "plus",
};
const ICONS = {
  wallet: '<path d="M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V6"/><path d="M16 14h.01"/>',
  dashboard: '<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>',
  receipt: '<path d="M4 3v18l3-2 3 2 3-2 3 2 4-2V3l-4 2-3-2-3 2-3-2z"/><path d="M8 9h8M8 13h6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrowLeft: '<path d="m15 18-6-6 6-6"/>', arrowRight: '<path d="m9 18 6-6-6-6"/>',
  arrowUp: '<path d="M12 19V5m-7 7 7-7 7 7"/>', arrowDown: '<path d="M12 5v14m7-7-7 7-7-7"/>',
  saving: '<path d="M12 2v20m5-16H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/>',
  food: '<path d="M3 2v7a4 4 0 0 0 4 4v9M7 2v5M11 2v5a4 4 0 0 1-4 4M17 2v20M17 2c3 2 4 5 4 8h-4"/>',
  car: '<path d="m5 11 1.5-5h11l1.5 5M3 11h18v8H3zM5 19v2m14-2v2M6 15h.01M18 15h.01"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  ticket: '<path d="M2 9a3 3 0 0 0 0 6v4h20v-4a3 3 0 0 1 0-6V5H2z"/><path d="M13 5v2m0 4v2m0 4v2"/>',
  bolt: '<path d="m13 2-3 9h7L8 22l3-9H4z"/>',
  shopping: '<path d="M3 4h2l2 12h11l3-8H6M9 20h.01M17 20h.01"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11 0v2h4v-2"/>',
  laptop: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20l-2-4H4z"/>',
  chart: '<path d="M3 3v18h18M8 15l4-4 4 3 5-7"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
};

function icon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.more}</svg>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function seedData() {
  const dateAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return localDate(date);
  };
  return {
    transactions: [
      { id: "sample-1", type: "income", amount: 32500, category: "Salario", description: "Nómina mensual", date: dateAgo(2) },
      { id: "sample-2", type: "expense", amount: 8200, category: "Vivienda", description: "Renta del departamento", date: dateAgo(3) },
      { id: "sample-3", type: "expense", amount: 1560, category: "Alimentación", description: "Supermercado", date: dateAgo(4) },
      { id: "sample-4", type: "income", amount: 4800, category: "Freelance", description: "Proyecto de diseño", date: dateAgo(6) },
      { id: "sample-5", type: "expense", amount: 740, category: "Transporte", description: "Gasolina", date: dateAgo(7) },
      { id: "sample-6", type: "expense", amount: 590, category: "Entretenimiento", description: "Cine y cena", date: dateAgo(9) },
      { id: "sample-7", type: "expense", amount: 960, category: "Servicios", description: "Internet y teléfono", date: dateAgo(11) },
      { id: "sample-8", type: "expense", amount: 420, category: "Salud", description: "Farmacia", date: dateAgo(13) },
    ],
    budgets: [
      { id: "budget-1", category: "Alimentación", limit: 5000 },
      { id: "budget-2", category: "Vivienda", limit: 10000 },
      { id: "budget-3", category: "Transporte", limit: 2500 },
      { id: "budget-4", category: "Entretenimiento", limit: 1800 },
      { id: "budget-5", category: "Servicios", limit: 2000 },
    ],
  };
}

function validData(data) {
  return Boolean(data && Array.isArray(data.transactions) && Array.isArray(data.budgets) &&
    data.transactions.every((item) => item && typeof item.id === "string" &&
      ["income", "expense"].includes(item.type) && Number.isFinite(item.amount) && item.amount > 0 &&
      typeof item.category === "string" && typeof item.description === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.date)) &&
    data.budgets.every((item) => item && typeof item.id === "string" &&
      typeof item.category === "string" && Number.isFinite(item.limit) && item.limit > 0));
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedData();
    const parsed = JSON.parse(saved);
    return validData(parsed) ? parsed : seedData();
  } catch {
    return seedData();
  }
}

const state = {
  ...loadData(),
  page: "overview",
  month: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  search: "",
  typeFilter: "all",
  categoryFilter: "all",
};

const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency", currency: CURRENCY, maximumFractionDigits: 2,
});
const money = (amount) => formatter.format(amount);
const monthKey = (date) => date.slice(0, 7);
const currentMonthKey = () => `${state.month.getFullYear()}-${String(state.month.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = () => new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(state.month);

function transactionsThisMonth() {
  return state.transactions.filter((item) => monthKey(item.date) === currentMonthKey())
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function sumTransactions(items) {
  const income = items.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = items.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  return { income, expenses, balance: income - expenses };
}

function categorySpent(category) {
  return transactionsThisMonth()
    .filter((item) => item.type === "expense" && item.category === category)
    .reduce((sum, item) => sum + item.amount, 0);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" })
    .format(new Date(`${value}T12:00:00`));
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions: state.transactions, budgets: state.budgets }));
    return true;
  } catch {
    toast("No se pudieron guardar los cambios en este navegador.");
    return false;
  }
}

function toast(message) {
  const root = document.querySelector("#toast-root");
  root.innerHTML = `<div class="toast" role="status">${escapeHtml(message)}</div>`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { root.innerHTML = ""; }, 3200);
}

function categoryIcon(category) {
  return icon(CATEGORY_ICONS[category] || "more", 17);
}

function renderSidebar() {
  const pages = [["overview", "Resumen", "dashboard"], ["transactions", "Transacciones", "receipt"], ["budgets", "Presupuestos", "target"]];
  return `<aside class="sidebar">
    <div class="brand"><span class="brand-icon">${icon("wallet", 20)}</span><span>monety</span></div>
    <p class="nav-label">Tu espacio</p>
    <nav class="nav-list" aria-label="Navegación principal">
      ${pages.map(([page, label, glyph]) => `<button class="nav-item ${state.page === page ? "active" : ""}" type="button" data-page="${page}" ${state.page === page ? 'aria-current="page"' : ""}>${icon(glyph)}<span>${label}</span></button>`).join("")}
    </nav>
    <div class="sidebar-foot">${icon("shield", 16)}<span>Tus datos se guardan solo en este dispositivo.</span></div>
  </aside>`;
}

function renderTopbar() {
  const names = { overview: "Resumen financiero", transactions: "Transacciones", budgets: "Presupuestos" };
  return `<header class="topbar">
    <div><p class="eyebrow">Tu espacio financiero</p><h1 class="page-title">${names[state.page]}</h1></div>
    <div class="top-actions">
      <div class="month-picker" aria-label="Mes seleccionado">
        <button class="icon-button" type="button" data-action="previous-month" aria-label="Mes anterior">${icon("arrowLeft")}</button>
        <span>${escapeHtml(monthLabel())}</span>
        <button class="icon-button" type="button" data-action="next-month" aria-label="Mes siguiente">${icon("arrowRight")}</button>
      </div>
      <button class="primary-button" type="button" data-action="add-transaction">${icon("plus")}<span>Nueva transacción</span></button>
    </div>
  </header>`;
}

function metric(label, value, note, glyph, tone, noteTone = "") {
  return `<article class="card"><div class="metric-head"><span class="metric-label">${label}</span><span class="metric-icon ${tone}">${icon(glyph, 17)}</span></div><p class="metric-value">${value}</p><span class="metric-note ${noteTone}">${note}</span></article>`;
}

function renderMetrics(items) {
  const { income, expenses, balance } = sumTransactions(items);
  const savingsRate = income ? Math.max(Math.round(balance / income * 100), 0) : 0;
  return `<section class="metrics" aria-label="Resumen del mes">
    ${metric("Ingresos del mes", money(income), "Dinero que entró", "arrowDown", "tone-income", "positive")}
    ${metric("Gastos del mes", money(expenses), "Dinero que salió", "arrowUp", "tone-expense", expenses > income ? "negative" : "")}
    ${metric("Balance disponible", money(balance), "Ingresos menos gastos", "wallet", "tone-balance", balance < 0 ? "negative" : "positive")}
    ${metric("Tasa de ahorro", `${savingsRate}%`, "De tus ingresos de este mes", "saving", "tone-saving", "positive")}
  </section>`;
}

function emptyState(glyph, message) {
  return `<div class="empty">${icon(glyph, 25)}<p>${message}</p></div>`;
}

function actionButtons(kind, item) {
  return `<div class="actions">
    <button class="icon-button" type="button" data-action="edit-${kind}" data-id="${escapeHtml(item.id)}" aria-label="Editar">${icon("edit", 14)}</button>
    <button class="icon-button" type="button" data-action="delete-${kind}" data-id="${escapeHtml(item.id)}" aria-label="Eliminar">${icon("trash", 14)}</button>
  </div>`;
}

function renderMovement(item, compact = false) {
  return `<article class="movement">
    <span class="category-icon">${categoryIcon(item.category)}</span>
    <div><p class="movement-name">${escapeHtml(item.description)}</p><span class="movement-meta">${escapeHtml(item.category)} · ${formatDate(item.date)}</span></div>
    <span class="amount ${item.type === "income" ? "income" : ""}">${item.type === "income" ? "+" : "−"}${money(item.amount)}</span>
    ${compact ? "" : actionButtons("transaction", item)}
  </article>`;
}

function renderRecent(items) {
  const recent = items.slice(0, 5);
  return `<section class="panel">
    <div class="panel-head"><div><h2 class="panel-title">Movimientos recientes</h2><p class="panel-subtitle">Lo último que registraste este mes</p></div><button class="text-button" type="button" data-page="transactions">Ver todos ${icon("arrowRight", 14)}</button></div>
    <div>${recent.length ? recent.map((item) => renderMovement(item, true)).join("") : emptyState("receipt", "Todavía no hay movimientos este mes. Agrega tu primer ingreso o gasto.")}</div>
  </section>`;
}

function budgetStatus(budget) {
  const spent = categorySpent(budget.category);
  const percentage = spent / budget.limit * 100;
  return { spent, percentage, tone: percentage >= 100 ? "over" : percentage >= 80 ? "warning" : "" };
}

function renderBudgetProgress(budget) {
  const { spent, percentage, tone } = budgetStatus(budget);
  return `<div class="budget-item">
    <div class="budget-line"><span class="budget-name"><span class="budget-dot"></span>${escapeHtml(budget.category)}</span><span class="budget-percent">${Math.round(percentage)}%</span></div>
    <div class="progress" role="progressbar" aria-label="Presupuesto de ${escapeHtml(budget.category)}" aria-valuemin="0" aria-valuemax="${budget.limit}" aria-valuenow="${Math.min(spent, budget.limit)}"><span class="${tone}" style="width:${Math.min(percentage, 100)}%"></span></div>
    <div class="budget-amounts"><span><strong>${money(spent)}</strong> gastados</span><span>de ${money(budget.limit)}</span></div>
  </div>`;
}

function renderBudgetPreview() {
  const budgets = state.budgets.slice(0, 4);
  return `<section class="panel">
    <div class="panel-head"><div><h2 class="panel-title">Tus presupuestos</h2><p class="panel-subtitle">Así va tu gasto por categoría</p></div><button class="text-button" type="button" data-page="budgets">Ver todos ${icon("arrowRight", 14)}</button></div>
    <div class="budget-list">${budgets.length ? budgets.map(renderBudgetProgress).join("") : emptyState("target", "Crea un presupuesto mensual para empezar a planear.")}</div>
  </section>`;
}

function renderSpending(items) {
  const groups = new Map();
  items.filter((item) => item.type === "expense").forEach((item) => groups.set(item.category, (groups.get(item.category) || 0) + item.amount));
  const sorted = [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = sorted[0]?.[1] || 1;
  return `<section class="panel"><div class="panel-head"><div><h2 class="panel-title">En qué estás gastando</h2><p class="panel-subtitle">Tus categorías con más movimiento</p></div></div>
    <div class="spending-list">${sorted.length ? sorted.map(([category, value]) => `<div class="spending-row"><span class="spending-name">${escapeHtml(category)}</span><div class="spending-bar"><span style="width:${Math.round(value / max * 100)}%"></span></div><span class="spending-value">${money(value)}</span></div>`).join("") : emptyState("chart", "Tus gastos aparecerán aquí cuando registres movimientos.")}</div>
  </section>`;
}

function renderOverview() {
  const items = transactionsThisMonth();
  const { income, balance } = sumTransactions(items);
  const savingRate = income ? Math.max(Math.round(balance / income * 100), 0) : 0;
  const heading = balance < 0 ? "Este mes tus gastos superan tus ingresos" : "¡Vas muy bien con tus finanzas!";
  const description = income ? `Has ahorrado ${savingRate}% de tus ingresos. Sigue así y mantén tus metas a la vista.` : "Registra tus movimientos para ver cómo evoluciona tu dinero.";
  return `<section class="welcome"><h2>${heading}</h2><p>${description}</p></section>${renderMetrics(items)}
    <div class="columns"><div>${renderRecent(items)}${renderSpending(items)}</div><div>${renderBudgetPreview()}</div></div>`;
}

function filteredTransactions() {
  const query = state.search.trim().toLocaleLowerCase("es-MX");
  return transactionsThisMonth().filter((item) => {
    const typeMatches = state.typeFilter === "all" || item.type === state.typeFilter;
    const categoryMatches = state.categoryFilter === "all" || item.category === state.categoryFilter;
    const queryMatches = !query || item.description.toLocaleLowerCase("es-MX").includes(query) || item.category.toLocaleLowerCase("es-MX").includes(query);
    return typeMatches && categoryMatches && queryMatches;
  });
}

function renderTransactions() {
  const items = filteredTransactions();
  const categories = [...new Set(transactionsThisMonth().map((item) => item.category))].sort((a, b) => a.localeCompare(b, "es"));
  return `<div class="toolbar">
    <div><h2 class="panel-title">Todos tus movimientos</h2><p class="panel-subtitle">${items.length} ${items.length === 1 ? "movimiento" : "movimientos"} en ${escapeHtml(monthLabel())}</p></div>
    <div class="filters">
      <label class="sr-only" for="search">Buscar movimiento</label><input class="filter-input" id="search" type="search" placeholder="Buscar movimiento..." value="${escapeHtml(state.search)}" data-filter="search">
      <label class="sr-only" for="type-filter">Filtrar por tipo</label><select class="filter-select" id="type-filter" data-filter="type"><option value="all" ${state.typeFilter === "all" ? "selected" : ""}>Todos los tipos</option><option value="income" ${state.typeFilter === "income" ? "selected" : ""}>Ingresos</option><option value="expense" ${state.typeFilter === "expense" ? "selected" : ""}>Gastos</option></select>
      <label class="sr-only" for="category-filter">Filtrar por categoría</label><select class="filter-select" id="category-filter" data-filter="category"><option value="all" ${state.categoryFilter === "all" ? "selected" : ""}>Todas las categorías</option>${categories.map((category) => `<option value="${escapeHtml(category)}" ${state.categoryFilter === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}</select>
    </div>
  </div>
  <section class="panel"><div class="table-scroll"><table class="transactions">
    <thead><tr><th>Movimiento</th><th>Descripción</th><th>Fecha</th><th>Tipo</th><th>Monto</th><th><span class="sr-only">Acciones</span></th></tr></thead>
    <tbody>${items.length ? items.map((item) => `<tr>
      <td><span class="table-category"><span class="category-icon">${categoryIcon(item.category)}</span>${escapeHtml(item.category)}</span></td>
      <td>${escapeHtml(item.description)}</td><td>${formatDate(item.date)}</td><td>${item.type === "income" ? "Ingreso" : "Gasto"}</td>
      <td><span class="amount ${item.type === "income" ? "income" : ""}">${item.type === "income" ? "+" : "−"}${money(item.amount)}</span></td>
      <td>${actionButtons("transaction", item)}</td>
    </tr>`).join("") : '<tr><td class="table-empty" colspan="6">No hay movimientos que coincidan con tu búsqueda.</td></tr>'}</tbody>
  </table></div></section>`;
}

function renderBudgetCard(budget) {
  const { spent, percentage, tone } = budgetStatus(budget);
  const remaining = budget.limit - spent;
  return `<article class="budget-card">
    <div class="budget-card-head"><div class="budget-card-name"><span class="category-icon">${categoryIcon(budget.category)}</span>${escapeHtml(budget.category)}</div>${actionButtons("budget", budget)}</div>
    <p class="budget-card-spent"><strong>${money(spent)}</strong> gastados de ${money(budget.limit)}</p>
    <div class="progress" role="progressbar" aria-label="Presupuesto de ${escapeHtml(budget.category)}" aria-valuemin="0" aria-valuemax="${budget.limit}" aria-valuenow="${Math.min(spent, budget.limit)}"><span class="${tone}" style="width:${Math.min(percentage, 100)}%"></span></div>
    <div class="budget-card-foot"><span>${percentage >= 100 ? "Superaste el límite" : `Te quedan ${money(remaining)}`}</span><span>${Math.round(percentage)}% utilizado</span></div>
  </article>`;
}

function renderBudgets() {
  const limit = state.budgets.reduce((sum, item) => sum + item.limit, 0);
  const spent = state.budgets.reduce((sum, item) => sum + categorySpent(item.category), 0);
  return `<div class="toolbar"><div><h2 class="panel-title">Planea tus gastos</h2><p class="panel-subtitle">Define límites para cuidar tu dinero cada mes.</p></div><button class="primary-button" type="button" data-action="add-budget">${icon("plus")}<span>Nuevo presupuesto</span></button></div>
    <section class="budget-summary" aria-label="Resumen de presupuestos">
      <div class="summary-card"><span>Presupuestado</span><strong>${money(limit)}</strong></div><div class="summary-card"><span>Gastado hasta ahora</span><strong>${money(spent)}</strong></div><div class="summary-card"><span>Disponible en presupuestos</span><strong>${money(limit - spent)}</strong></div>
    </section>
    <section class="budget-grid" aria-label="Presupuestos por categoría">${state.budgets.length ? state.budgets.map(renderBudgetCard).join("") : `<div class="panel">${emptyState("target", "Todavía no tienes presupuestos. Crea uno para asignar un límite mensual a una categoría.")}</div>`}</section>`;
}

function renderApp() {
  const page = state.page === "transactions" ? renderTransactions() : state.page === "budgets" ? renderBudgets() : renderOverview();
  document.querySelector("#app").innerHTML = `<div class="shell">${renderSidebar()}<main class="main">${renderTopbar()}<div class="content">${page}</div></main></div>`;
}

function transactionForm(item = null) {
  const type = item?.type || "expense";
  return `<div class="modal-backdrop">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="transaction-title">
      <div class="modal-head"><div><h2 class="modal-title" id="transaction-title">${item ? "Editar transacción" : "Nueva transacción"}</h2><p class="modal-copy">Registra un movimiento para mantener tus cuentas al día.</p></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Cerrar">${icon("close")}</button></div>
      <form id="transaction-form" novalidate>
        <input type="hidden" name="id" value="${escapeHtml(item?.id || "")}">
        <div class="type-switch" role="group" aria-label="Tipo de transacción"><button class="type-choice ${type === "expense" ? "active" : ""}" type="button" data-type="expense">Gasto</button><button class="type-choice ${type === "income" ? "active" : ""}" type="button" data-type="income">Ingreso</button></div>
        <input type="hidden" name="type" value="${type}">
        <div class="form-grid" style="margin-top:14px">
          <div class="field"><label for="description">Descripción</label><input id="description" name="description" type="text" maxlength="80" placeholder="Ej. Compra del supermercado" value="${escapeHtml(item?.description || "")}" required></div>
          <div class="form-grid form-two"><div class="field"><label for="amount">Monto (${CURRENCY})</label><input id="amount" name="amount" type="number" min="0.01" max="999999999" step="0.01" inputmode="decimal" placeholder="0.00" value="${item ? item.amount : ""}" required></div><div class="field"><label for="date">Fecha</label><input id="date" name="date" type="date" value="${escapeHtml(item?.date || localDate(new Date()))}" required></div></div>
          <div class="field"><label for="category">Categoría</label><select id="category" name="category" required>${CATEGORIES[type].map((category) => `<option value="${escapeHtml(category)}" ${item?.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}</select></div>
          <p class="error" id="form-error" role="alert" hidden></p>
        </div>
        <div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">${item ? "Guardar cambios" : "Guardar transacción"}</button></div>
      </form>
    </section>
  </div>`;
}

function budgetForm(item = null) {
  const options = CATEGORIES.expense.filter((category) => !state.budgets.some((budget) => budget.category === category && budget.id !== item?.id));
  return `<div class="modal-backdrop">
    <section class="modal" role="dialog" aria-modal="true" aria-labelledby="budget-title">
      <div class="modal-head"><div><h2 class="modal-title" id="budget-title">${item ? "Editar presupuesto" : "Nuevo presupuesto"}</h2><p class="modal-copy">Elige una categoría y define su límite mensual.</p></div><button class="icon-button" type="button" data-action="close-modal" aria-label="Cerrar">${icon("close")}</button></div>
      <form id="budget-form" novalidate><input type="hidden" name="id" value="${escapeHtml(item?.id || "")}">
        <div class="form-grid"><div class="field"><label for="budget-category">Categoría</label><select id="budget-category" name="category" required>${options.map((category) => `<option value="${escapeHtml(category)}" ${item?.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}</select></div>
          <div class="field"><label for="limit">Límite mensual (${CURRENCY})</label><input id="limit" name="limit" type="number" min="0.01" max="999999999" step="0.01" inputmode="decimal" placeholder="0.00" value="${item ? item.limit : ""}" required></div>
          <p class="error" id="form-error" role="alert" hidden></p>
        </div><div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Cancelar</button><button class="primary-button" type="submit">${item ? "Guardar cambios" : "Crear presupuesto"}</button></div>
      </form>
    </section>
  </div>`;
}

function closeModal() {
  document.querySelector("#dialog-root").innerHTML = "";
}

function openTransaction(item = null) {
  document.querySelector("#dialog-root").innerHTML = transactionForm(item);
  document.querySelector("#transaction-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveTransaction(event.currentTarget);
  });
  document.querySelector("#description")?.focus();
}

function openBudget(item = null) {
  document.querySelector("#dialog-root").innerHTML = budgetForm(item);
  document.querySelector("#budget-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    saveBudget(event.currentTarget);
  });
  document.querySelector("#budget-category")?.focus();
}

function formError(message) {
  const element = document.querySelector("#form-error");
  if (!element) return;
  element.textContent = message;
  element.hidden = false;
}

function saveTransaction(form) {
  const values = new FormData(form);
  const id = String(values.get("id") || "");
  const type = String(values.get("type") || "");
  const description = String(values.get("description") || "").trim();
  const amount = Number(values.get("amount"));
  const category = String(values.get("category") || "");
  const date = String(values.get("date") || "");
  if (!["income", "expense"].includes(type)) return formError("Elige si es un ingreso o un gasto.");
  if (!description || description.length > 80) return formError("Escribe una descripción de hasta 80 caracteres.");
  if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999) return formError("Ingresa un monto mayor que cero.");
  if (!CATEGORIES[type].includes(category)) return formError("Elige una categoría válida.");
  const parsed = new Date(`${date}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || localDate(parsed) !== date) return formError("Elige una fecha válida.");
  const record = { id: id || makeId("transaction"), type, description, amount, category, date };
  const previous = state.transactions;
  state.transactions = id ? previous.map((item) => item.id === id ? record : item) : [...previous, record];
  if (!persist()) {
    state.transactions = previous;
    return;
  }
  closeModal();
  renderApp();
  toast(id ? "Transacción actualizada." : "Transacción guardada.");
}

function saveBudget(form) {
  const values = new FormData(form);
  const id = String(values.get("id") || "");
  const category = String(values.get("category") || "");
  const limit = Number(values.get("limit"));
  if (!CATEGORIES.expense.includes(category)) return formError("Elige una categoría válida.");
  if (!Number.isFinite(limit) || limit <= 0 || limit > 999999999) return formError("Ingresa un límite mayor que cero.");
  if (state.budgets.some((item) => item.category === category && item.id !== id)) return formError("Ya existe un presupuesto para esta categoría.");
  const record = { id: id || makeId("budget"), category, limit };
  const previous = state.budgets;
  state.budgets = id ? previous.map((item) => item.id === id ? record : item) : [...previous, record];
  if (!persist()) {
    state.budgets = previous;
    return;
  }
  closeModal();
  renderApp();
  toast(id ? "Presupuesto actualizado." : "Presupuesto creado.");
}

function handleClick(event) {
  const button = event.target.closest("[data-action], [data-page], [data-type]");
  if (!button) {
    if (event.target.classList.contains("modal-backdrop")) closeModal();
    return;
  }
  if (button.dataset.page) {
    state.page = button.dataset.page;
    renderApp();
    return;
  }
  if (button.dataset.type) {
    const form = document.querySelector("#transaction-form");
    if (!form) return;
    form.elements.type.value = button.dataset.type;
    document.querySelectorAll(".type-choice").forEach((choice) => choice.classList.toggle("active", choice.dataset.type === button.dataset.type));
    const select = form.elements.category;
    const previous = select.value;
    select.innerHTML = CATEGORIES[button.dataset.type].map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
    if (CATEGORIES[button.dataset.type].includes(previous)) select.value = previous;
    return;
  }
  switch (button.dataset.action) {
    case "previous-month":
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
      renderApp();
      break;
    case "next-month":
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
      renderApp();
      break;
    case "add-transaction": openTransaction(); break;
    case "add-budget":
      if (state.budgets.length >= CATEGORIES.expense.length) toast("Ya tienes presupuestos para todas las categorías disponibles.");
      else openBudget();
      break;
    case "edit-transaction": {
      const item = state.transactions.find((record) => record.id === button.dataset.id);
      if (item) openTransaction(item);
      break;
    }
    case "delete-transaction": {
      const item = state.transactions.find((record) => record.id === button.dataset.id);
      if (!item || !window.confirm(`¿Eliminar "${item.description}"?`)) break;
      const previous = state.transactions;
      state.transactions = previous.filter((record) => record.id !== item.id);
      if (!persist()) {
        state.transactions = previous;
        renderApp();
        break;
      }
      renderApp(); toast("Transacción eliminada.");
      break;
    }
    case "edit-budget": {
      const item = state.budgets.find((record) => record.id === button.dataset.id);
      if (item) openBudget(item);
      break;
    }
    case "delete-budget": {
      const item = state.budgets.find((record) => record.id === button.dataset.id);
      if (!item || !window.confirm(`¿Eliminar el presupuesto de ${item.category}?`)) break;
      const previous = state.budgets;
      state.budgets = previous.filter((record) => record.id !== item.id);
      if (!persist()) {
        state.budgets = previous;
        renderApp();
        break;
      }
      renderApp(); toast("Presupuesto eliminado.");
      break;
    }
    case "close-modal": closeModal(); break;
  }
}

document.addEventListener("click", handleClick);
document.addEventListener("input", (event) => {
  if (event.target.dataset.filter !== "search") return;
  state.search = event.target.value;
  const cursor = event.target.selectionStart;
  renderApp();
  const input = document.querySelector("#search");
  input?.focus();
  input?.setSelectionRange(cursor, cursor);
});
document.addEventListener("change", (event) => {
  if (event.target.dataset.filter === "type") state.typeFilter = event.target.value;
  else if (event.target.dataset.filter === "category") state.categoryFilter = event.target.value;
  else return;
  renderApp();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

renderApp();
