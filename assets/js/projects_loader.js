document.addEventListener("DOMContentLoaded", () => {
  const projectsContainer = document.querySelector(".projects-container");

  // Helper function to parse CSV rows with support for quoted strings
  function parseCSV(csvText) {
    const rows = [];
    const lines = csvText.split(/\r?\n/);
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const result = [];
      let currentField = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(currentField.trim());
          currentField = "";
        } else {
          currentField += char;
        }
      }
      result.push(currentField.trim());
      rows.push(result);
    }
    return rows;
  }

  function createProjectCard(project) {
    const [title, image, description, link] = project;
    
    const card = document.createElement("div");
    card.className = "project-card card animate__animated animate__fadeInUp";
    
    // Using innerHTML with caution, but since it's the user's data it should be fine.
    // For production, consider DOMPurify or textContent.
    card.innerHTML = `
      <img
        src="${image}"
        alt="${title}"
        loading="lazy"
        class="project-pic"
      />
      <h3 class="project-title">${title}</h3>
      <p class="project-details">${description}</p>
      <a href="${link}" target="_blank" class="project-link"><b>Github</b></a>
    `;
    
    return card;
  }

  async function loadProjects() {
    try {
      // Add loading state
      projectsContainer.innerHTML = '<div class="loading-spinner">Loading Projects...</div>';

      const response = await fetch("projects.csv");
      const csvData = await response.text();
      const projects = parseCSV(csvData);

      // Clear loading state
      projectsContainer.innerHTML = "";

      projects.forEach((project, index) => {
        const card = createProjectCard(project);
        // Staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        projectsContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading projects:", error);
      projectsContainer.innerHTML = '<p class="error">Failed to load projects. Please try again later.</p>';
    }
  }

  loadProjects();
});
