
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

const menuScreen = document.getElementById('menu-screen')!;
const authScreen = document.getElementById('auth-screen')!;
const loginForm = document.getElementById('login-form')!;
const registerForm = document.getElementById('register-form')!;
const mainMenu = document.getElementById('main-menu')!;
const welcomeText = document.getElementById('welcome-text')!;
const playGameBtn = document.getElementById('play-game-btn')!;
const easyDifficultyBtn = document.getElementById('easy-difficulty-btn')!;
const normalDifficultyBtn = document.getElementById('normal-difficulty-btn')!;
const hardDifficultyBtn = document.getElementById('hard-difficulty-btn')!;
const selectedDifficultyText = document.getElementById('selected-difficulty')!;
const mainLeaderboardBtn = document.getElementById('main-leaderboard-btn')!;
const logoutBtn = document.getElementById('logout-btn')!;
const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
const leaderboardScreen = document.getElementById('leaderboard-screen')!;
const mainLeaderboardList = document.getElementById('main-leaderboard-list')!;
const closeLeaderboardBtn = document.getElementById('close-leaderboard-btn')!;

const loginUsername = document.getElementById('login-username') as HTMLInputElement;
const loginPassword = document.getElementById('login-password') as HTMLInputElement;
const registerUsername = document.getElementById('register-username') as HTMLInputElement;
const registerPassword = document.getElementById('register-password') as HTMLInputElement;

const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
const registerBtn = document.getElementById('register-btn') as HTMLButtonElement;
const showRegisterBtn = document.getElementById('show-register-btn')!;
const showLoginBtn = document.getElementById('show-login-btn')!;
const errorText = document.getElementById('error-text')!;

const API_URL = 'http://localhost:3000/api';

function showLogin(): void {
  menuScreen.classList.remove('hidden');
  authScreen.classList.remove('hidden');
  mainMenu.classList.add('hidden');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  errorText.textContent = '';
  loginUsername.focus();
}

function showRegister(): void {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  errorText.textContent = '';
  registerUsername.focus();
}
function showMainMenu(username: string): void {
  menuScreen.classList.remove('hidden');
  authScreen.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  welcomeText.textContent = `Welcome, ${username}!`;
  errorText.textContent = '';
}

function hideMenu(): void {
  menuScreen.classList.add('hidden');
}

function createGame(
  username: string,
  token: string,
  difficulty: 'easy' | 'normal' | 'hard'
): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#0f0f23',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, PreloadScene, GameScene, GameOverScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  const game = new Phaser.Game(config);
  game.registry.set('username', username);
  game.registry.set('token', token);
  game.registry.set('difficulty', difficulty);

  return game;
}

let selectedDifficulty: 'easy' | 'normal' | 'hard' = 'normal';

let currentGame: Phaser.Game | null = null;
let selectedLeaderboardDifficulty = 'all';

async function loadLeaderboard(difficulty: string): Promise<void> {
  mainLeaderboardList.textContent = 'Loading...';

  try {
    const url =
      difficulty === 'all'
        ? `${API_URL}/leaderboard`
        : `${API_URL}/leaderboard?difficulty=${difficulty}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to load leaderboard.');
    }

    mainLeaderboardList.replaceChildren();

    if (data.scores.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'leaderboard-empty';
      emptyMessage.textContent = 'No scores yet!';
      mainLeaderboardList.appendChild(emptyMessage);
      return;
    }

    data.scores.forEach(
      (score: { username: string; points: number }, index: number) => {
        const row = document.createElement('div');
        row.className = 'leaderboard-row';

        const rank = document.createElement('span');
        rank.className = 'leaderboard-rank';
        rank.textContent = `#${index + 1}`;

        const username = document.createElement('span');
        username.className = 'leaderboard-username';
        username.textContent = score.username;

        const points = document.createElement('span');
        points.className = 'leaderboard-score';
        points.textContent = `${score.points} pts`;

        row.append(rank, username, points);
        mainLeaderboardList.appendChild(row);
      }
    );
  } catch (error) {
    console.error('Leaderboard error:', error);
    mainLeaderboardList.textContent = 'Could not load leaderboard.';
  }
}

let leaderboardOrigin: 'menu' | 'gameover' = 'menu';

function openLeaderboard(origin: 'menu' | 'gameover'): void {
  leaderboardOrigin = origin;

  menuScreen.classList.remove('hidden');
  mainMenu.classList.toggle('hidden', origin === 'gameover');
  leaderboardScreen.classList.remove('hidden');

  filterButtons.forEach((button) => {
    button.classList.toggle(
      'active',
      button.dataset.difficulty === 'all'
    );
  });

  void loadLeaderboard('all');
}

(window as any).openLeaderboard = openLeaderboard;

function startGame(username: string, token: string): void {
  hideMenu();
currentGame = createGame(username, token, selectedDifficulty);
}

function restartGame(): void {
  if (currentGame) {
    currentGame.destroy(true);
    currentGame = null;
  }

  loginUsername.value = '';
  loginPassword.value = '';
  registerUsername.value = '';
  registerPassword.value = '';

  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');

  showLogin();
}

(window as any).restartGame = restartGame;
function returnToMainMenu(): void {
  if (currentGame) {
    currentGame.destroy(true);
    currentGame = null;
  }

  const username = sessionStorage.getItem('username');

  if (username) {
    showMainMenu(username);
  } else {
    showLogin();
  }
}

(window as any).returnToMainMenu = returnToMainMenu;
function selectDifficulty(
  difficulty: 'easy' | 'normal' | 'hard'
): void {
  selectedDifficulty = difficulty;

  selectedDifficultyText.textContent =
    `Selected: ${difficulty.toUpperCase()}`;
}

easyDifficultyBtn.addEventListener('click', () => {
  selectDifficulty('easy');
});

normalDifficultyBtn.addEventListener('click', () => {
  selectDifficulty('normal');
});

hardDifficultyBtn.addEventListener('click', () => {
  selectDifficulty('hard');
});

showRegisterBtn.addEventListener('click', showRegister);
showLoginBtn.addEventListener('click', showLogin);
playGameBtn.addEventListener('click', () => {
  const username = sessionStorage.getItem('username');
  const token = sessionStorage.getItem('token');

  if (!username || !token) {
    showLogin();
    return;
  }

  startGame(username, token);
});
logoutBtn.addEventListener('click', () => {
  restartGame();
});

mainLeaderboardBtn.addEventListener('click', () => {
  openLeaderboard('menu');
});
// Filter Buttons
filterButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const difficulty = button.dataset.difficulty;

    if (!difficulty) return;

    selectedLeaderboardDifficulty = difficulty;

    filterButtons.forEach((item) => {
      item.classList.toggle('active', item === button);
    });

    await loadLeaderboard(difficulty);
  });
});

closeLeaderboardBtn.addEventListener('click', () => {
  leaderboardScreen.classList.add('hidden');

  if (leaderboardOrigin === 'gameover') {
    menuScreen.classList.add('hidden');
  } else {
    mainMenu.classList.remove('hidden');
  }
});

// Login
loginBtn.addEventListener('click', async () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  errorText.textContent = '';

  if (!username || !password) {
    errorText.textContent = 'Please enter username and password.';
    return;
  }

  loginBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed.');
    }

    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('username', data.user.username);

  showMainMenu(data.user.username);
  } catch (error) {
    errorText.textContent =
      error instanceof Error ? error.message : 'Could not connect to server.';
  } finally {
    loginBtn.disabled = false;
  }
});

// Register
registerBtn.addEventListener('click', async () => {
  const username = registerUsername.value.trim();
  const password = registerPassword.value;

  errorText.textContent = '';

  if (!username || !password) {
    errorText.textContent = 'Please enter username and password.';
    return;
  }

  registerBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    registerUsername.value = '';
    registerPassword.value = '';

    showLogin();
    errorText.textContent = 'Registration successful! Please login.';

  } catch (error) {
    errorText.textContent =
      error instanceof Error ? error.message : 'Could not connect to server.';
  } finally {
    registerBtn.disabled = false;
  }
});

loginPassword.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loginBtn.click();
  }
});

registerPassword.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    registerBtn.click();
  }
});

showLogin();
