const ageGate = document.getElementById('ageGate');
const enterButton = document.getElementById('enterButton');
const contactForm = document.getElementById('contactForm');
const creatorsGrid = document.getElementById('creatorsGrid');
const notice = document.getElementById('notice');

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Sample creator data (replace with API calls)
const creators = [
  {
    id: 1,
    name: 'Built From Fire',
    category: 'Metal / Sculpture',
    description: 'Rough-cut steel, copper, reclaimed pieces, and art made to outlast the room.',
    image: 'https://via.placeholder.com/400x300?text=Built+From+Fire'
  },
  {
    id: 2,
    name: 'One of One',
    category: 'Original Works',
    description: 'Pieces that are not copied, polished into sameness, or made for everybody.',
    image: 'https://via.placeholder.com/400x300?text=One+of+One'
  },
  {
    id: 3,
    name: 'Make It Yours',
    category: 'The People',
    description: 'Creators and supporters meet here to trade stories, share work, and build something real.',
    image: 'https://via.placeholder.com/400x300?text=Make+It+Yours'
  }
];

function showNotice(message, type = 'info') {
  notice.textContent = message;
  notice.className = `notice show ${type}`;
  window.setTimeout(() => notice.classList.remove('show'), 3200);
}

function enterSite() {
  ageGate.classList.add('hidden');
  localStorage.setItem('poppaAgeVerified', 'true');
}

// Check if user already verified age
if (localStorage.getItem('poppaAgeVerified') === 'true') {
  ageGate.classList.add('hidden');
}

enterButton.addEventListener('click', enterSite);

// Load creators dynamically
function loadCreators() {
  creatorsGrid.innerHTML = '';
  creators.forEach(creator => {
    const card = document.createElement('article');
    card.className = 'creator-card';
    card.innerHTML = `
      <img src="${creator.image}" alt="${creator.name}" loading="lazy" />
      <span class="creator-tag">${creator.category}</span>
      <h3>${creator.name}</h3>
      <p>${creator.description}</p>
    `;
    creatorsGrid.appendChild(card);
  });
}

// Fetch creators from API (optional)
async function fetchCreators() {
  try {
    // Uncomment when API is ready
    // const response = await fetch('/api/creators');
    // if (!response.ok) throw new Error('Failed to fetch creators');
    // const data = await response.json();
    // return data;
    return creators; // Use sample data for now
  } catch (error) {
    console.error('Error fetching creators:', error);
    return creators; // Fallback to sample data
  }
}

// Initialize creators on page load
fetchCreators().then(data => {
  if (data && data.length > 0) {
    Object.assign(creators, data);
  }
  loadCreators();
});

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  // Validation
  if (!name || !email || !subject || !message) {
    showNotice('Please fill in all fields.', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotice('Please enter a valid email address.', 'error');
    return;
  }

  try {
    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;

    // Send message to API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, subject, message })
    });

    if (!response.ok) throw new Error('Failed to send message');

    showNotice('Message sent! We\'ll get back to you soon.', 'success');
    contactForm.reset();
  } catch (error) {
    console.error('Error sending message:', error);
    showNotice('Failed to send message. Please try again or email us directly.', 'error');
  } finally {
    const button = contactForm.querySelector('button[type="submit"]');
    button.textContent = 'Send Message';
    button.disabled = false;
  }
}
);

// Search/filter creators (optional feature)
function filterCreators(category) {
  if (category === 'all') {
    loadCreators();
    return;
  }
  
  const filtered = creators.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
  creatorsGrid.innerHTML = '';
  
  if (filtered.length === 0) {
    creatorsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">No creators found.</p>';
    return;
  }
  
  filtered.forEach(creator => {
    const card = document.createElement('article');
    card.className = 'creator-card';
    card.innerHTML = `
      <img src="${creator.image}" alt="${creator.name}" loading="lazy" />
      <span class="creator-tag">${creator.category}</span>
      <h3>${creator.name}</h3>
      <p>${creator.description}</p>
    `;
    creatorsGrid.appendChild(card);
  });
}