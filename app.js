// Sample artwork data
const artworks = [
  {
    id: 1,
    title: 'Untitled #1',
    medium: 'Oil on Canvas',
    price: '$2,400',
    description: 'A striking exploration of color and form. This piece challenges the viewer to see beyond the surface, inviting interpretation and emotional response.',
    image: 'https://via.placeholder.com/400x400?text=Artwork+1'
  },
  {
    id: 2,
    title: 'Series II',
    medium: 'Mixed Media',
    price: '$1,800',
    description: 'Part of an ongoing series exploring the intersection of traditional and contemporary techniques. Each work in this series stands alone while contributing to a larger narrative.',
    image: 'https://via.placeholder.com/400x400?text=Artwork+2'
  },
  {
    id: 3,
    title: 'Abstract Study',
    medium: 'Acrylic on Canvas',
    price: '$1,600',
    description: 'A study in abstraction and composition. This work examines how color relationships and spatial arrangement can convey emotion without representational form.',
    image: 'https://via.placeholder.com/400x400?text=Artwork+3'
  },
  {
    id: 4,
    title: 'Reflection',
    medium: 'Digital Print on Canvas',
    price: '$1,200',
    description: 'An exploration of light and shadow. This piece investigates how we perceive depth and dimension through layered visual elements.',
    image: 'https://via.placeholder.com/400x400?text=Artwork+4'
  },
  {
    id: 5,
    title: 'Untitled #5',
    medium: 'Oil on Canvas',
    price: '$2,800',
    description: 'A large-scale work that demands presence. This painting explores texture and layering, inviting close examination and repeated viewings.',
    image: 'https://via.placeholder.com/400x400?text=Artwork+5'
  },
  {
    id: 6,
    title: 'Convergence',
    medium: 'Mixed Media Installation',
    price: 'Price on Request',
    description: 'A larger installation piece exploring the convergence of ideas, materials, and perspectives. This work is available for exhibition and curatorial consideration.',
    image: 'https://via.placeholder.com/400x400?text=Artwork+6'
  }
];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const contactForm = document.getElementById('contactForm');
const artworkModal = document.getElementById('artworkModal');
const notice = document.getElementById('notice');

// Initialize
function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  loadGallery();
  contactForm.addEventListener('submit', handleSubmit);
}

// Load Gallery
function loadGallery() {
  galleryGrid.innerHTML = artworks.map(artwork => `
    <div class="artwork-card" onclick="openArtwork(${artwork.id})">
      <div class="artwork-image">
        <img src="${artwork.image}" alt="${artwork.title}" loading="lazy" />
      </div>
      <div class="artwork-info">
        <div class="artwork-title">${artwork.title}</div>
        <div class="artwork-medium">${artwork.medium}</div>
        <div class="artwork-price">${artwork.price}</div>
      </div>
    </div>
  `).join('');
}

// Open Artwork Modal
function openArtwork(id) {
  const artwork = artworks.find(a => a.id === id);
  if (!artwork) return;

  document.getElementById('modalImage').src = artwork.image;
  document.getElementById('modalImage').alt = artwork.title;
  document.getElementById('modalTitle').textContent = artwork.title;
  document.getElementById('modalMedium').textContent = artwork.medium;
  document.getElementById('modalPrice').textContent = artwork.price;
  document.getElementById('modalDescription').textContent = artwork.description;
  
  document.getElementById('buyBtn').onclick = () => {
    contactForm.scrollIntoView({ behavior: 'smooth' });
    closeModal();
    document.getElementById('subject').value = `Inquiry: ${artwork.title}`;
  };
  
  artworkModal.classList.add('active');
}

// Close Modal
function closeModal() {
  artworkModal.classList.remove('active');
}

// Contact Form Handler
async function handleSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    showNotification('Please fill in all fields.', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }

  try {
    // For now, just show success message
    // In production, this would send to a backend
    console.log({ name, email, subject, message });
    showNotification('Message sent! I\'ll get back to you soon.', 'success');
    contactForm.reset();
  } catch (error) {
    console.error('Error:', error);
    showNotification('Failed to send message. Please try again.', 'error');
  }
}

// Show Notification
function showNotification(message, type = 'info') {
  notice.textContent = message;
  notice.className = `notice show ${type}`;
  
  setTimeout(() => {
    notice.classList.remove('show');
  }, 4000);
}

// Close modal when clicking outside
artworkModal.addEventListener('click', (e) => {
  if (e.target === artworkModal) {
    closeModal();
  }
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}