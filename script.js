// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', function () {
    // Inside your DOMContentLoaded listener in script.js or <script> tag in index.html

    const terminalButtons = document.querySelectorAll('.terminal-header .term-btn');
    const terminalMessageArea = document.querySelector('.terminal-header .terminal-message-area');

    const funnyMessages = {
        close: [
            "Nope, can't close me!",
            "Did you seriously expect this to work?",
            "This isn't a real window, silly!",
            "Error 404: Close function not found.",
            "I'm unclosable. Mwahaha!"
        ],
        minimize: [
            "Trying to hide me, eh?",
            "This is a fake UI, yk?",
            "Minimize? I prefer to be seen!",
            "I'm already as small as I wanna be.",
            "My therapist said I shouldn't minimize my feelings."
        ],
        maximize: [
            "Whoa there, I'm big enough!",
            "This button is just for show.",
            "MAXIMUM EFFORT! (jk)",
            "To infinity... and this window size!",
            "Cannot comply. System overload of awesome."
        ]
    };

    let messageTimeout; // To store the timeout ID

    // --- Typewriter Effect for Terminal and Hero ---
    const terminalLine1 = document.getElementById('terminal-line-1');
    const terminalLine2 = document.getElementById('terminal-line-2');
    const terminalCommand = document.getElementById('terminal-command');
    const fullPromptElement = document.getElementById('terminal-line-prompt');
    const promptStructure = `
        <span class="prompt-user">root@elin:</span><span class="prompt-path">~</span><span class="prompt-dollar">$</span>
        <span class="prompt-command" id="terminal-command"></span>`; // Command part will be typed

    // HERO TYPEWRITER
    const heroTitle = document.querySelector('.hero-text-content h1');
    const heroSubtitle = document.querySelector('.hero-text-content p');
    
    // Dynamic greeting based on time
    function getGreeting() {
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 5 && hour < 12) return 'morning'; // sunrise to noon
        if (hour >= 12 && hour < 18) return 'afternoon'; // noon to sunset
        return 'evening'; // sunset to sunrise
    }
    // Replace greeting in hero title
    if (heroTitle) {
        heroTitle.innerHTML = heroTitle.innerHTML.replace(/good (morning|afternoon|evening)/i, 'good ' + getGreeting());
    }
    const heroTitleText = heroTitle ? heroTitle.textContent : '';
    const heroSubtitleText = heroSubtitle ? heroSubtitle.textContent : '';

    // --- Format date for terminal line 1 ---
    function getTerminalDateString() {
        const now = new Date();
        let m = now.getMonth() + 1;
        let d = now.getDate();
        let y = now.getFullYear() % 100;
        return `${m}.${d}.${y}`;
    }
    const textLine1 = `CV ${getTerminalDateString()}`;
    const randomMs = Math.floor(Math.random() * 100) + 1;
    const textLine2 = `Loading personal and system profiles took ${randomMs}ms.`;
    const commandText = "elin.exe --education";

    let typingSpeed = 50; // Milliseconds per character

    function typeWriter(element, text, callback) {
        let i = 0;
        element.innerHTML = ''; // Clear existing text
        element.classList.add('typing-effect'); // Add cursor

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, typingSpeed);
            } else {
                element.classList.remove('typing-effect'); // Remove cursor when done
                if (callback) {
                    setTimeout(callback, 300); // Short pause before next action
                }
            }
        }
        type();
    }

    function startTerminalAnimation() {
        if (terminalLine1) {
            typeWriter(terminalLine1, textLine1, () => {
                if (terminalLine2) {
                    typeWriter(terminalLine2, textLine2, () => {
                        if (fullPromptElement && terminalCommand) {
                            // Set up the prompt structure first
                            fullPromptElement.innerHTML = promptStructure;
                            // Now find the new terminal-command span inside the prompt
                            const newTerminalCommandElement = fullPromptElement.querySelector('#terminal-command');
                            if (newTerminalCommandElement) {
                                typeWriter(newTerminalCommandElement, commandText);
                            }
                        }
                    });
                }
            });
        }
    }

    function startHeroTypewriter() {
        if (heroTitle && heroSubtitle) {
            heroTitle.classList.remove('invisible-until-typing');
            heroSubtitle.classList.remove('invisible-until-typing');
            // Animate in the profile overview button as soon as typing starts
            const profileBtn = document.querySelector('.hero-text-content .btn-outline-light');
            if (profileBtn) {
                profileBtn.classList.add('profile-animate-in');
            }
            heroSubtitle.style.visibility = 'hidden';
            heroSubtitle.style.position = 'absolute';
            heroSubtitle.style.height = 'auto';
            heroSubtitle.style.width = '100%';
            heroSubtitle.style.left = '0';
            heroSubtitle.style.top = 'auto';
            heroSubtitle.style.marginTop = '0';
            typeWriter(heroTitle, heroTitleText, () => {
                heroSubtitle.style.position = '';
                heroSubtitle.style.visibility = 'visible';
                typeWriter(heroSubtitle, heroSubtitleText);
            });
        }
    }

    // Only start the terminal animation if the #profile-overview section is present
    // (e.g., only on the homepage if this JS is global)
    if (document.getElementById('profile-overview')) {
        // Clear initial static text if it exists, so typewriter can take over
        if(terminalLine1) terminalLine1.textContent = '';
        if(terminalLine2) terminalLine2.textContent = '';
        if(terminalCommand) terminalCommand.textContent = ''; // Clear the command part
        
        // Small delay before starting to ensure page is settled
        setTimeout(startTerminalAnimation, 500);
        setTimeout(startHeroTypewriter, 500);
    }

    // --- End Typewriter Effect ---

    terminalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonType = this.dataset.btnType; // 'close', 'minimize', or 'maximize'
            if (funnyMessages[buttonType] && funnyMessages[buttonType].length > 0) {
                // Get a random message
                const messages = funnyMessages[buttonType];
                const randomIndex = Math.floor(Math.random() * messages.length);
                const message = messages[randomIndex];

                // Display the message
                terminalMessageArea.textContent = message;
                terminalMessageArea.classList.add('visible');

                // Clear any existing timeout to hide the message
                clearTimeout(messageTimeout);

                // Set a new timeout to hide the message after a few seconds
                messageTimeout = setTimeout(() => {
                    terminalMessageArea.classList.remove('visible');
                }, 3000); // Hide after 3 seconds
            }
        });

        // Optional: Show message on hover and keep it if clicked
        // This is a bit more complex as hover can trigger rapidly.
        // For now, let's stick to click for simplicity.
    });

    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.profile-tab-btn');
    // Get all content panes
    const contentPanes = document.querySelectorAll('.profile-content .content-pane');

    // Add a click event listener to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetContentId = this.dataset.content;

            // 1. Update Tab Buttons: Make them all inactive first
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // 2. Update Content Panes: Hide all panes first
            contentPanes.forEach(pane => {
                pane.classList.remove('active-pane');
            });
            const targetPane = document.getElementById(targetContentId + '-content');
            if (targetPane) {
                targetPane.classList.add('active-pane');
            }

            // 3. Type out the correct command in the terminal prompt
            if (targetContentId === 'experience' || targetContentId === 'education') {
                if (fullPromptElement) {
                    fullPromptElement.innerHTML = promptStructure;
                    const newTerminalCommandElement = fullPromptElement.querySelector('#terminal-command');
                    if (newTerminalCommandElement) {
                        const command = targetContentId === 'experience' ? 'elin.exe --experience' : 'elin.exe --education';
                        typeWriter(newTerminalCommandElement, command);
                    }
                }
            }
        });
    });
        // --- Advanced Theme Toggler (NEW CODE STARTS HERE) ---
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const docElement = document.documentElement; // This is the <html> element

    // Define your themes in an order you want them to cycle through
    const themes = [
        'theme-dark-teal',       // Default (matches your :root setup)
        'theme-dark-lavender',
        'theme-dark-maroon',
        'theme-dark-blue',
        'theme-light-teal',
        'theme-light-lavender',
        'theme-light-maroon',
        'theme-light-blue'
    ];
    let currentThemeIndex = 0; // Will be updated by loadTheme

    // Function to apply a theme
    function applyTheme(themeClassName) {
        // Remove any existing theme classes from <html>
        // This regex matches any class starting with "theme-"
        const themeRegex = /\btheme-[a-z-]+\b/g;
        docElement.className = docElement.className.replace(themeRegex, '').trim();

        // Add the new theme class
        docElement.classList.add(themeClassName);
        localStorage.setItem('portfolioTheme', themeClassName); // Save theme
        currentThemeIndex = themes.indexOf(themeClassName); // Update current index
    }

    // Function to load saved theme or apply default
    function loadTheme() {
        const savedTheme = localStorage.getItem('portfolioTheme');
        if (savedTheme && themes.includes(savedTheme)) {
            applyTheme(savedTheme);
        } else {
            // Apply default theme (first in the array)
            applyTheme(themes[0]);
        }
    }

    // Event listener for the toggle button
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let nextThemeIndex = currentThemeIndex + 1;
            if (nextThemeIndex >= themes.length) {
                nextThemeIndex = 0; // Cycle back to the first theme
            }
            applyTheme(themes[nextThemeIndex]);
        });
    }

    // Load the theme when the page loads
    loadTheme();
    // --- Advanced Theme Toggler (NEW CODE ENDS HERE) ---

    // --- PROJECT SEARCH FUNCTIONALITY ---
    const searchInput = document.querySelector('.search-projects input');
    const projectCards = document.querySelectorAll('.project-list-item.card');

    if (searchInput && projectCards.length > 0) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            projectCards.forEach(card => {
                // Search in title and description
                const title = card.querySelector('.card-title')?.textContent?.toLowerCase() || '';
                const desc = card.querySelector('.card-text')?.textContent?.toLowerCase() || '';
                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    // --- PROJECT RANDOMIZE FUNCTIONALITY ---
    const randomizeBtn = document.querySelector('.btn-secondary');
    if (randomizeBtn && projectCards.length > 0) {
        randomizeBtn.addEventListener('click', function () {
            // Remove any previous highlight
            projectCards.forEach(card => card.classList.remove('random-highlight'));
            // Pick a random card
            const visibleCards = Array.from(projectCards).filter(card => card.style.display !== 'none');
            if (visibleCards.length === 0) return;
            const randomIdx = Math.floor(Math.random() * visibleCards.length);
            const randomCard = visibleCards[randomIdx];
            randomCard.classList.add('random-highlight');
            // Scroll to the card smoothly
            randomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
});