const WORD_LIMIT = 25;

// ---------------- TRUNCATE TEXT ----------------
function truncateText(text, limit) {
  const words = text.split(" ");
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
}

// ---------------- FETCH JSON ----------------
fetch("alldata.json")
  .then(res => res.json())
  .then(data => {
    // Typing header
    const typingWords = data.typingWords || [];
    if (typingWords.length) startTypingAnimation(typingWords);

    // Load About
    loadAbout(data.about);
    loadEducation(data.education);
    loadSkills(data.skills);
    // Load Publications
    loadPublications(data.publications);
  })
  .catch(err => console.error(err));

// ---------------- ABOUT ----------------
function loadAbout(about) {
  const shortText = truncateText(about.description, WORD_LIMIT);

  document.getElementById("about-short").innerHTML = `
    ${shortText}
    <span class="read-more" onclick="toggleAbout()"> Read more</span>
  `;

  document.getElementById("about-full").innerHTML = `
    ${about.description}
    <span class="read-more" onclick="toggleAbout()"> Show less</span>
  `;
}

function toggleAbout() {
  document.getElementById("about-short").classList.toggle("hidden");
  document.getElementById("about-full").classList.toggle("show");
}

// ---------------- PUBLICATIONS ----------------
function loadPublications(publications) {
  const container = document.getElementById("project-list");

  publications.forEach((pub, index) => {
    const shortText = truncateText(pub.description, WORD_LIMIT);

    const card = document.createElement("div");
    card.className = "publication-card";

    card.innerHTML = `
      <h3>${pub.title}</h3>
      <p><i>${pub.authors}</i></p>
      <p><b>${pub.journal}</b></p>

      <p id="desc-${index}">
        ${shortText}
        ${pub.description.split(" ").length > WORD_LIMIT
          ? `<span class="read-more" onclick="toggleReadMore(${index})"> Read more</span>`
          : ""}
      </p>

      <p id="full-${index}" class="full-text">
        ${pub.description}
        <span class="read-more" onclick="toggleReadMore(${index})"> Show less</span>
      </p>

      <a href="${pub.link}" target="_blank">View Paper</a>
    `;

    container.appendChild(card);
  });
}



function toggleReadMore(index) {
  document.getElementById(`desc-${index}`).classList.toggle("hidden");
  document.getElementById(`full-${index}`).classList.toggle("show");
}


  const navImgs = document.querySelectorAll('.nav_img');

  navImgs.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent document click
      navImgs.forEach(i => i.classList.remove('active'));
      img.classList.add('active');
    });
  });

  // Click anywhere else → reset
  document.addEventListener('click', () => {
    navImgs.forEach(i => i.classList.remove('active'));
  });



// ---------------- TYPING HEADER ----------------
const typingText = document.getElementById("typing-text");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
const typingSpeed = 120;
const deletingSpeed = 80;
const holdTime = 1200;

function startTypingAnimation(words) {
  function type() {
    const currentWord = words[wordIndex];

    if (!deleting) {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        setTimeout(() => deleting = true, holdTime);
      }
    } else {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? deletingSpeed : typingSpeed);
  }

  type();
}

// ---------------- EDUCATION ----------------
function loadEducation(education) {
  const container = document.getElementById("education-list");

  education.forEach(ed => {
    const card = document.createElement("div");
    card.className = "education-card";
    card.innerHTML = `
      <h3>${ed.degree}</h3>
      <b>${ed.institution}</b>
      <p>${ed.details}</p>
    `;
    container.appendChild(card);
  });
}

//---------------SKILLSET------------------
function loadSkills(skills) {
  const container = document.getElementById("skills-list");
  if (!container) return;

  skills.forEach(skill => {
    const skillDiv = document.createElement("div");
    skillDiv.className = "skill";
    skillDiv.innerHTML = `
      <div class="circle" data-percent="${skill.percent}">
        <span>0%</span>
      </div>
      <p>${skill.name}</p>
    `;
    container.appendChild(skillDiv);
  });

  // Animate circular progress
  document.querySelectorAll('.circle').forEach(circle => {
    const percent = circle.getAttribute('data-percent');
    const span = circle.querySelector('span');
    let progress = 0;

    const animate = setInterval(() => {
      if (progress >= percent) {
        clearInterval(animate);
        span.textContent = percent + '%';
      } else {
        progress++;
        span.textContent = progress + '%';
        circle.style.background = `conic-gradient(#425361 0deg ${progress*3.6}deg, #383b3eff ${progress*3.6}deg 360deg)`;
      }
    }, 15);
  });
}

// Reference to the container where form will be inserted
const formContainer = document.getElementById('contactFormContainer');

// Fetch JSON config
fetch('formConfig.json')
  .then(response => response.json())
  .then(config => {
    // Create form element
    const form = document.createElement('form');
    form.action = config.action;
    form.method = "POST";
    form.className = "contact-form";
    form.style.position = "relative"; // to position stars relative if needed

    // Hidden access key
    const hiddenInput = document.createElement('input');
    hiddenInput.type = "hidden";
    hiddenInput.name = "access_key";
    hiddenInput.value = config.access_key;
    form.appendChild(hiddenInput);

    // Add other form fields (Name, Email, etc.)
    const fields = [
      {label: "Name", type: "text", name: "name", placeholder: "Your Name", required: true},
      {label: "Email", type: "email", name: "email", placeholder: "Your Email", required: true},
      {label: "Name of Institute", type: "text", name: "institute", placeholder: "Your Institute Name"},
      {label: "Subject", type: "text", name: "subject", placeholder: "Subject", required: true},
      {label: "Message", type: "textarea", name: "message", placeholder: "Write your message here...", required: true}
    ];

    fields.forEach(f => {
      const label = document.createElement('label');
      label.htmlFor = f.name;
      label.textContent = f.label;
      form.appendChild(label);

      let input;
      if(f.type === "textarea"){
        input = document.createElement('textarea');
        input.rows = 5;
      } else {
        input = document.createElement('input');
        input.type = f.type;
      }
      input.id = f.name;
      input.name = f.name;
      input.placeholder = f.placeholder;
      if(f.required) input.required = true;

      form.appendChild(input);
    });

    // Submit button
    const button = document.createElement('button');
    button.type = "submit";
    button.textContent = "Send Message";

    // ======= Button Styling =======
    button.style.backgroundColor = "#007BFF";
    button.style.color = "#FFFFFF";
    button.style.border = "none";
    button.style.padding = "10px 20px";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.transition = "0.4s";

    // Hover effect
    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = "#00a1ff";
      button.style.transform = "translateY(-3px)";
    });
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = "#007BFF";
      button.style.transform = "translateY(0)";
    });

    form.appendChild(button);

    // Add form to container
    formContainer.appendChild(form);

    // =======================
    // SPARKLES FUNCTION
    // =======================
    function createSparkles(button) {
      const rect = button.getBoundingClientRect();
      for (let i = 0; i < 15; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.width = '6px';
        sparkle.style.height = '6px';
        sparkle.style.background = 'gold';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.left = rect.left + rect.width/2 + 'px';
        sparkle.style.top = rect.top + rect.height/2 + 'px';
        sparkle.style.opacity = '1';
        sparkle.style.transform = 'scale(1)';

        // Random movement
        const dx = (Math.random() - 0.5) * 100;
        const dy = (Math.random() - 0.5) * 100;

        // Animate using JS
        let start = null;
        function animate(timestamp) {
          if (!start) start = timestamp;
          const progress = (timestamp - start)/1000; // seconds
          sparkle.style.transform = `translate(${dx*progress}px, ${dy*progress}px) scale(${1 + progress})`;
          sparkle.style.opacity = `${1 - progress}`;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            sparkle.remove();
          }
        }
        requestAnimationFrame(animate);

        document.body.appendChild(sparkle);
      }
    }

    // =======================
    // FORM SUBMISSION LOGIC
    // =======================
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      button.textContent = "Sending...";
      button.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          button.textContent = "Your message has been sent successfully!";
          form.reset();
          createSparkles(button); // sparkle effect
        } else {
          button.textContent = "Error! Try again";
        }
      } catch (error) {
        console.error(error);
        button.textContent = "Error! Try again";
      }

      // Reset button after 6 seconds
      setTimeout(() => {
        button.textContent = "Send Message";
        button.disabled = false;
      }, 6000);
    });

  })
  .catch(err => console.error("Error loading form config:", err));
