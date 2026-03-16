import './style.css'

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  return `
    <div class="app">
      <h1>PageWatch</h1>
      <form id="pagewatch-form">
        <div>
          <label for="url">Website URL</label>
          <input id="url" name="url" type="url" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
        <button type="submit">Monitor Page</button>
      </form>
      <p id="message" class="message"></p>
    </div>
  `;
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = App();

const form = document.querySelector<HTMLFormElement>('#pagewatch-form')!;
const messageEl = document.querySelector<HTMLParagraphElement>('#message')!;

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const url = (document.querySelector<HTMLInputElement>('#url')!).value.trim();
  const email = (document.querySelector<HTMLInputElement>('#email')!).value.trim();

  try {
    const response = await fetch(`${API_URL}/monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, email }),
    });

    if (response.ok) {
      messageEl.textContent = 'Monitor added';
      (document.querySelector<HTMLInputElement>('#url')!).value = '';
      (document.querySelector<HTMLInputElement>('#email')!).value = '';
    } else {
      messageEl.textContent = 'Error adding monitor';
    }
  } catch (error) {
    console.error(error);
    messageEl.textContent = 'Error adding monitor';
  }
});
