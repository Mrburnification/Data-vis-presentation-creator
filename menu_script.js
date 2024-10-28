// Define an array of card data
const cardsData = [
    {
        title: "Card 1",
        imageSrc: "first_frame.jpg",
        videoSrc: "video1.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 1.",
        link: "page1.html"
    },
    {
        title: "Card 2",
        imageSrc: "first_frame.jpg",
        videoSrc: "video2.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 2.",
        link: "page2.html"
    },
    {
        title: "Card 2",
        imageSrc: "first_frame.jpg",
        videoSrc: "video2.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 2.",
        link: "page2.html"
    },
    {
        title: "Card 2",
        imageSrc: "first_frame.jpg",
        videoSrc: "video2.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 2.",
        link: "page2.html"
    },
    {
        title: "Card 2",
        imageSrc: "first_frame.jpg",
        videoSrc: "video2.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 2.",
        link: "page2.html"
    },
    {
        title: "Card 2",
        imageSrc: "first_frame.jpg",
        videoSrc: "video2.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 2.",
        link: "page2.html"
    },
    {
        title: "Card 2",
        imageSrc: "first_frame.jpg",
        videoSrc: "video2.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 2.",
        link: "page2.html"
    },
    {
        title: "Card 2",
        imageSrc: "first_frame.jpg",
        videoSrc: "video2.mp4",
        symbols: "🌟💧🔥",
        description: "This is the description for card 2.",
        link: "page2.html"
    },
    // Add more card data objects as needed
];

// Function to generate cards dynamically
// Function to generate cards dynamically
function generateCards() {
    const container = document.getElementById("cardContainer");

    // Clear existing cards
    container.innerHTML = "";

    // Loop through each card data and generate corresponding HTML
    cardsData.forEach(data => {
        const cardHTML = `
            <a href="${data.link}" class="card-link">
                <div class="card">
                    <div class="card-media">
                        <img src="${data.imageSrc}" alt="${data.title}" class="card-image">
                        <video src="${data.videoSrc}" class="card-video" muted loop></video>
                    </div>
                    <h2 class="card-title">${data.title}</h2>
                    <div class="card-symbols">${data.symbols}</div>
                    <p class="card-description">${data.description}</p>
                </div>
            </a>
        `;
        container.insertAdjacentHTML("beforeend", cardHTML);
    });

    // Add event listeners for video playback
    document.querySelectorAll('.card').forEach(card => {
        const video = card.querySelector('.card-video');
        const image = card.querySelector('.card-image');

        card.addEventListener('mouseenter', () => {
            video.currentTime = 0;
            video.play();
            video.style.opacity = '1';
            image.style.opacity = '0';
        });

        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
            video.style.opacity = '0';
            image.style.opacity = '1';
        });
    });
}

// Call the function to generate cards when the page loads
window.addEventListener("load", generateCards);

