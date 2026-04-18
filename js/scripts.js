// ============================================================
// scripts.js - Portfolio Project
// ============================================================

// ---- Global Variables ----
let aboutMeData  = null;
let projectsData = null;

// ---- Regex for validation ----
const illegalCharsRegex  = /[^a-zA-Z0-9@._\-]/;
const validEmailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE_LENGTH = 300;

// ---- Placeholder images ----
const CARD_PLACEHOLDER      = './images/card_placeholder_bg.webp';
const SPOTLIGHT_PLACEHOLDER = './images/spotlight_placeholder_bg.webp';

// ==============================================================
// HELPER — يصلح مسارات الصور من ../images/ إلى ./images/
// ==============================================================
function fixImagePath(path) {
  if (!path) return null;
  return path.replace('../images/', './images/');
}

// ==============================================================
// 1. FETCH DATA
// ==============================================================

async function fetchAboutMe() {
  try {
    const response = await fetch('./data/aboutMeData.json');
    if (!response.ok) throw new Error('Failed to fetch About Me data');
    aboutMeData = await response.json();
    populateAboutMe(aboutMeData);
  } catch (error) {
    console.error('Error in fetchAboutMe:', error);
  }
}

async function fetchProjects() {
  try {
    const response = await fetch('./data/projectsData.json');
    if (!response.ok) throw new Error('Failed to fetch Projects data');
    projectsData = await response.json();
    populateProjects(projectsData);
    populateSpotlight(projectsData[0]); // Default: first project
  } catch (error) {
    console.error('Error in fetchProjects:', error);
  }
}

// ==============================================================
// 2. ABOUT ME SECTION
// ==============================================================

function populateAboutMe(data) {
  const aboutMeDiv = document.getElementById('aboutMe');

  const bio = document.createElement('p');
  bio.textContent = data.aboutMe || 'No bio available.';

  const headshotContainer = document.createElement('div');
  headshotContainer.classList.add('headshotContainer');

  const headshot = document.createElement('img');
  headshot.src = fixImagePath(data.headshot) || './images/headshot.webp';
  headshot.alt = 'Profile headshot';

  headshotContainer.appendChild(headshot);

  const fragment = document.createDocumentFragment();
  fragment.appendChild(bio);
  fragment.appendChild(headshotContainer);
  aboutMeDiv.appendChild(fragment);
}

// ==============================================================
// 3. PROJECTS SECTION — Cards
// ==============================================================

function populateProjects(projects) {
  const projectList = document.getElementById('projectList');
  const fragment    = document.createDocumentFragment();

  projects.forEach((project) => {
    const card = createProjectCard(project);
    fragment.appendChild(card);
  });

  projectList.appendChild(fragment);
  setupScrollArrows();
}

function createProjectCard(project) {
  const card = document.createElement('div');
  card.classList.add('projectCard');
  card.id = project.project_id;

  // fixImagePath يصلح المسار، وإن كان فاضي نرجع للـ fallback map
  const cardImage = fixImagePath(project.card_image) || getCardImageById(project.project_id);
  card.style.backgroundImage = `url('${cardImage}')`;

  const title = document.createElement('h4');
  title.textContent = project.project_name || 'Untitled Project';

  const description = document.createElement('p');
  description.textContent = project.short_description || 'No description available.';

  card.appendChild(title);
  card.appendChild(description);

  card.addEventListener('click', () => populateSpotlight(project));

  return card;
}

// ==============================================================
// 4. FALLBACK IMAGE MAPS — للمشاريع الناقصة
// ==============================================================

function getCardImageById(id) {
  const map = {
    'project_personal':   './images/personal_site_card.webp',
    'project_todo':       './images/todo_card.webp',
    'project_calculator': './images/calculator_card.webp',
    'project_store':      './images/commerce_card.webp',
    'project_weather':    './images/weather_app_card.webp',
    'project_blog':       './images/blog_card.webp',
    'project_game':       './images/game_dev_card.webp',
    'project_social':     './images/social_media_card.webp',
    'project_music':      './images/music_app_card.webp',
    'project_fitness':    './images/fitness_card.webp',
  };
  return map[id] || CARD_PLACEHOLDER;
}

function getSpotlightImageById(id) {
  const map = {
    'project_personal':   './images/personal_site_spotlight.webp',
    'project_todo':       './images/todo_spotlight.webp',
    'project_calculator': './images/calculator_spotlight.webp',
    'project_store':      './images/commerce_spotlight.webp',
    'project_weather':    './images/weather_app_spotlight.webp',
    'project_blog':       './images/blog_spotlight.webp',
    'project_game':       './images/game_dev_spotlight.webp',
    'project_social':     './images/social_media_spotlight.webp',
    'project_music':      './images/music_app_spotlight.webp',
    'project_fitness':    './images/fitness_spotlight.webp',
  };
  return map[id] || SPOTLIGHT_PLACEHOLDER;
}

// ==============================================================
// 5. PROJECTS SECTION — Spotlight
// ==============================================================

function populateSpotlight(project) {
  const spotlight      = document.getElementById('projectSpotlight');
  const spotlightInner = document.getElementById('spotlightTitles');

  // fixImagePath يصلح المسار، وإن كان فاضي نرجع للـ fallback map
  const spotlightImage = fixImagePath(project.spotlight_image) || getSpotlightImageById(project.project_id);
  const projectName    = project.project_name     || 'Untitled Project';
  const longDesc       = project.long_description || 'No description available.';
  const url            = project.url              || '#';

  spotlight.style.backgroundImage = `url('${spotlightImage}')`;

  // Clear old content without innerHTML
  while (spotlightInner.firstChild) {
    spotlightInner.removeChild(spotlightInner.firstChild);
  }

  const fragment = document.createDocumentFragment();

  const title = document.createElement('h3');
  title.textContent = projectName;

  const description = document.createElement('p');
  description.textContent = longDesc;

  const link = document.createElement('a');
  link.href        = url;
  link.textContent = 'Click here to see more...';
  link.target      = '_blank';

  fragment.appendChild(title);
  fragment.appendChild(description);
  fragment.appendChild(link);
  spotlightInner.appendChild(fragment);
}

// ==============================================================
// 6. SCROLL ARROWS
// ==============================================================

function setupScrollArrows() {
  const leftArrow   = document.querySelector('.arrow-left');
  const rightArrow  = document.querySelector('.arrow-right');
  const projectList = document.getElementById('projectList');

  if (!leftArrow || !rightArrow) {
    console.warn('Scroll arrow elements not found');
    return;
  }

  const SCROLL_AMOUNT = 320;
  const mobileQuery   = window.matchMedia('(max-width: 768px)');

  leftArrow.addEventListener('click', () => {
    if (mobileQuery.matches) {
      projectList.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    } else {
      projectList.scrollBy({ top: -SCROLL_AMOUNT, behavior: 'smooth' });
    }
  });

  rightArrow.addEventListener('click', () => {
    if (mobileQuery.matches) {
      projectList.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    } else {
      projectList.scrollBy({ top: SCROLL_AMOUNT, behavior: 'smooth' });
    }
  });
}

// ==============================================================
// 7. FORM VALIDATION
// ==============================================================

function setupForm() {
  const form         = document.getElementById('formSection');
  const emailInput   = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const charCount    = document.getElementById('charactersLeft');

  if (!form || !emailInput || !messageInput) {
    console.warn('Form elements not found');
    return;
  }

  // Live character counter
  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCount.textContent = `Characters: ${len}/300`;
    if (len > MAX_MESSAGE_LENGTH) {
      charCount.classList.add('error');
    } else {
      charCount.classList.remove('error');
    }
  });

  // Form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailValue   = emailInput.value.trim();
    const messageValue = messageInput.value.trim();
    let isValid = true;

    emailError.textContent   = '';
    messageError.textContent = '';

    // Email checks
    if (!emailValue) {
      emailError.textContent = 'Email cannot be empty.';
      isValid = false;
    } else if (illegalCharsRegex.test(emailValue)) {
      emailError.textContent = 'Email contains illegal characters.';
      isValid = false;
    } else if (!validEmailRegex.test(emailValue)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Message checks
    if (!messageValue) {
      messageError.textContent = 'Message cannot be empty.';
      isValid = false;
    } else if (illegalCharsRegex.test(messageValue)) {
      messageError.textContent = 'Message contains illegal characters.';
      isValid = false;
    } else if (messageValue.length > MAX_MESSAGE_LENGTH) {
      messageError.textContent = `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`;
      isValid = false;
    }

    if (isValid) {
      alert('Form validation passed! Message submitted successfully.');
      form.reset();
      charCount.textContent = 'Characters: 0/300';
      charCount.classList.remove('error');
    }
  });
}

// ==============================================================
// 8. INIT
// ==============================================================

function init() {
  fetchAboutMe();
  fetchProjects();
  setupForm();
}

document.addEventListener('DOMContentLoaded', init);