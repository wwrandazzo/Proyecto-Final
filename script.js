const slideContainer = document.querySelector("#eventoActual");
const indicatorsContainer = document.querySelector("#indicadores");
const previousButton = document.querySelector("#eventoAnterior");
const nextButton = document.querySelector("#eventoSiguiente");
const previousLink = document.querySelector("#navEventoAnterior");
const nextLink = document.querySelector("#navEventoSiguiente");
const annualEventsContainer = document.querySelector("#listaEventos");

let events = [];
let activeEventIndex = 0;

function showEvent(index) {
	activeEventIndex = (index + events.length) % events.length;
	const event = events[activeEventIndex];

	slideContainer.replaceChildren();

	const image = document.createElement("img");
	image.className = "event-image";
	image.src = event.imagen;
	image.alt = "";
	image.addEventListener("error", () => image.remove());

	const content = document.createElement("div");
	content.className = "event-content";

	const title = document.createElement("h2");
	title.textContent = event.titulo;

	const date = document.createElement("p");
	date.textContent = event.fecha;

	const position = document.createElement("p");
	position.className = "event-position";
	position.textContent = `${activeEventIndex + 1} / ${events.length}`;

	content.append(title, date, position);
	slideContainer.append(image, content);
	slideContainer.setAttribute("aria-label", `${event.titulo}, ${event.fecha}`);

	indicatorsContainer.querySelectorAll("button").forEach((button, buttonIndex) => {
		const isCurrent = buttonIndex === activeEventIndex;
		button.classList.toggle("is-active", isCurrent);
		button.setAttribute("aria-current", isCurrent ? "true" : "false");
	});
}

function showLoadError() {
	const message = document.createElement("p");
	message.className = "carousel-message";
	message.textContent = "No se pudieron cargar los eventos.";
	slideContainer.replaceChildren(message);

	const annualMessage = document.createElement("li");
	annualMessage.className = "annual-event-message";
	annualMessage.textContent = "No se pudieron cargar los eventos.";
	annualEventsContainer.replaceChildren(annualMessage);
}

function renderAnnualCalendar() {
	const eventItems = events.map((event) => {
		const item = document.createElement("li");
		item.className = "annual-event";

		const date = document.createElement("p");
		date.className = "annual-event-date";
		date.textContent = event.fecha;

		const title = document.createElement("h3");
		title.textContent = event.titulo;

		item.append(date, title);
		return item;
	});

	annualEventsContainer.replaceChildren(...eventItems);
}

async function loadEvents() {
	try {
		const response = await fetch("eventos.json");
		if (!response.ok) {
			throw new Error("No se pudo leer eventos.json");
		}

		events = await response.json();
		if (!Array.isArray(events) || events.length === 0) {
			throw new Error("No hay eventos para mostrar");
		}

		renderAnnualCalendar();

		events.forEach((event, index) => {
			const indicator = document.createElement("button");
			indicator.className = "carousel-indicator";
			indicator.type = "button";
			indicator.setAttribute("aria-label", `Mostrar evento: ${event.titulo}`);
			indicator.addEventListener("click", () => showEvent(index));
			indicatorsContainer.append(indicator);
		});

		previousButton.disabled = false;
		nextButton.disabled = false;
		showEvent(0);
	} catch (error) {
		showLoadError();
		console.error("Error al cargar los eventos:", error);
	}
}

previousButton.addEventListener("click", () => showEvent(activeEventIndex - 1));
nextButton.addEventListener("click", () => showEvent(activeEventIndex + 1));
previousLink.addEventListener("click", () => showEvent(activeEventIndex - 1));
nextLink.addEventListener("click", () => showEvent(activeEventIndex + 1));

loadEvents();
