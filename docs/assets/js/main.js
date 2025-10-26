
document.addEventListener('DOMContentLoaded', () => {
    loadContent('lv');
});

function addRouterImages() {
    console.log("Attempting to add router images...");
    const table = document.querySelector('#content table');
    if (!table) {
        console.log("Router table not found.");
        return;
    }
    console.log("Table found.");

    const headers = table.querySelectorAll('th');
    let modelIndex = -1;
    let photoIndex = -1;

    headers.forEach((header, index) => {
        const headerText = header.textContent.trim().toLowerCase();
        if (headerText.startsWith('model')) {
            modelIndex = index;
        } else if (headerText === 'photo' || headerText === 'foto') {
            photoIndex = index;
        }
    });

    if (modelIndex === -1 || photoIndex === -1) {
        console.log(`Column indexes not found. Model: ${modelIndex}, Photo: ${photoIndex}`);
        return;
    }
    console.log(`Column indexes found. Model: ${modelIndex}, Photo: ${photoIndex}`);

    const rows = table.querySelectorAll('tr');
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const modelCell = row.cells[modelIndex];
        const photoCell = row.cells[photoIndex];

        if (!modelCell || !photoCell) {
            console.log(`Skipping row ${i}, cells not found.`);
            continue;
        }

        const modelName = modelCell.textContent.trim();
        let imageUrl = '';

        if (modelName.includes('hAP ax³')) {
            imageUrl = 'assets/img/routers/hap_ax3.jpg';
        } else if (modelName.includes('hEX S')) {
            imageUrl = 'assets/img/routers/hex_s.jpg';
        } else if (modelName.includes('CCR2004')) {
            imageUrl = 'assets/img/routers/ccr2004.jpg';
        }

        if (imageUrl) {
            console.log(`Adding image ${imageUrl} for model ${modelName}`);
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = modelName;
            img.style.width = '200px';
            photoCell.innerHTML = '';
            photoCell.appendChild(img);
        } else {
            console.log(`No image found for model: ${modelName}`);
        }
    }
    console.log("Finished adding router images.");
}

function loadContent(lang) {
    fetch(`content/${lang}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            document.getElementById('content').innerHTML = marked.parse(markdown);
            try {
                addRouterImages();
            } catch (e) {
                console.error("Error adding router images:", e);
            }
            updateActiveButton(lang);
            loadAgentScript(lang);
        })
        .catch(error => {
            document.getElementById('content').innerHTML = `<h2>Saturs nav atrasts</h2><p>Atvainojiet, saturs šajā valodā nav pieejams.</p>`;
            console.error('Error loading content:', error);
            updateActiveButton(lang);
            loadAgentScript(lang);
        });
}

function updateActiveButton(lang) {
    const buttons = document.querySelectorAll('.lang-switcher button');
    buttons.forEach(button => {
        if (button.textContent.toLowerCase() === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function loadAgentScript(lang) {
    // Remove existing agent script
    const existingScript = document.getElementById('agent-script');
    if (existingScript) {
        existingScript.remove();
    }

    // Don't load a script for a language that doesn't have one (e.g., 'ru')
    if (lang !== 'lv' && lang !== 'en') {
        return;
    }

    // Create and append new script
    const script = document.createElement('script');
    script.id = 'agent-script';
    script.src = `assets/js/agent-formspree-${lang}.js`;
    document.body.appendChild(script);
}
