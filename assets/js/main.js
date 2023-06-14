(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function(e) {
    let section = select(this.hash)
    if (section) {
      e.preventDefault()

      let navbar = select('#navbar')
      let header = select('#header')
      let sections = select('section', true)
      let navlinks = select('#navbar .nav-link', true)

      navlinks.forEach((item) => {
        item.classList.remove('active')
      })

      this.classList.add('active')

      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }

      if (this.hash == '#header') {
        header.classList.remove('header-top')
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        return;
      }

      if (!header.classList.contains('header-top')) {
        header.classList.add('header-top')
        setTimeout(function() {
          sections.forEach((item) => {
            item.classList.remove('section-show')
          })
          section.classList.add('section-show')

        }, 350);
      } else {
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        section.classList.add('section-show')
      }

      scrollto(this.hash)
    }
  }, true)

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function() {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Initiate portfolio details lightbox 
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: '.portfolio-details-lightbox',
    width: '90%',
    height: '90vh'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
})()

function scrollToSection(sectionId) {
  var section = document.querySelector(sectionId);
  section.scrollIntoView({
    behavior: 'smooth'
  });
}

function loadCert() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/data/cert.csv", true);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var csvData = request.responseText;
      var rows = csvData.split("\n");
      var container = document.querySelector("#services .container");
      var rowDiv;

      for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split(",");
        var certificateName = columns[0];
        var imageUrl = 'https://drive.google.com/uc?export=view&id=' + columns[1];
        var description = columns[2];

        if (i % 3 === 0) {
          rowDiv = document.createElement("div");
          rowDiv.className = "row";
          container.appendChild(rowDiv);
        }

        var div = document.createElement("div");
        div.className = "col-lg-4 col-md-6 d-flex align-items-stretch mt-4";

        var iconBox = document.createElement("div");
        iconBox.className = "icon-box";

        var image = document.createElement("div");
        image.className = "image";
        var img = document.createElement("img");
        img.src = imageUrl;
        img.height = "170";
        img.width = "300";
        image.appendChild(img);

        var heading = document.createElement("h4");
        var link = document.createElement("a");
        link.href = imageUrl;
        link.target = "_blank";
        link.textContent = certificateName;
        heading.appendChild(link);

        var p = document.createElement("p");
        p.textContent = description;

        iconBox.appendChild(image);
        iconBox.appendChild(heading);
        iconBox.appendChild(p);

        div.appendChild(iconBox);
        rowDiv.appendChild(div);
      }
    }
  };
  request.send(null);
}

function loadLang() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", './assets/data/lang.csv', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = xhr.responseText;
      var lines = data.split("\n");
      var container = document.querySelector("#interests");
      var rowDiv = null;

      for (var i = 0; i < lines.length; i++) {
        var columns = lines[i].split(",");
        var language = columns[0].trim();
        var imageSrc = columns[1].trim();

        if (i % 3 === 0) {
          rowDiv = document.createElement("div");
          rowDiv.classList.add("row");
          container.appendChild(rowDiv);
        }

        var colDiv = document.createElement("div");
        colDiv.classList.add("col-lg-4", "col-md-4", "mt-4");

        var iconBoxDiv = document.createElement("div");
        iconBoxDiv.classList.add("icon-box");

        var image = document.createElement("img");
        image.src = imageSrc;
        image.height = 30;
        image.width = 30;

        var heading = document.createElement("h3");
        heading.textContent = language;

        iconBoxDiv.appendChild(image);
        iconBoxDiv.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;";
        iconBoxDiv.appendChild(heading);

        colDiv.appendChild(iconBoxDiv);
        rowDiv.appendChild(colDiv);
      }
    }
  };
  xhr.send();
}

function loadSkills() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", './assets/data/skills.csv', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = xhr.responseText;
      var lines = data.split("\n");
      var container = document.querySelector("#skills");
      var rowDiv = null;

      for (var i = 0; i < lines.length; i++) {
        var columns = lines[i].split(",");
        var language = columns[0].trim();
        var imageSrc = columns[1].trim();

        if (i % 3 === 0) {
          rowDiv = document.createElement("div");
          rowDiv.classList.add("row");
          container.appendChild(rowDiv);
        }

        var colDiv = document.createElement("div");
        colDiv.classList.add("col-lg-4", "col-md-4", "mt-4");

        var iconBoxDiv = document.createElement("div");
        iconBoxDiv.classList.add("icon-box");

        var image = document.createElement("img");
        image.src = imageSrc;
        image.height = 30;
        image.width = 30;

        var heading = document.createElement("h3");
        heading.textContent = language;

        iconBoxDiv.appendChild(image);
        iconBoxDiv.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;";
        iconBoxDiv.appendChild(heading);

        colDiv.appendChild(iconBoxDiv);
        rowDiv.appendChild(colDiv);
      }
    }
  };
  xhr.send();
}

function loadProjects() {
  var req = new XMLHttpRequest();
  req.open("GET", "./assets/data/projects.json", true);
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200) {
      var data = JSON.parse(req.responseText);
      var container = document.querySelector("#portfolio > div");
      var rowDiv = null;
      var keys = Object.keys(data);

      for (var i = 0; i < keys.length; i++) {
        var project = data[keys[i]];
        var title = project.title;
        var category = project.category;
        var images = project.image;

        if (i % 3 === 0) {
          rowDiv = document.createElement("div");
          rowDiv.classList.add("row", "portfolio-container");
          container.appendChild(rowDiv);
        }

        var colDiv = document.createElement("div");
        colDiv.classList.add("col-lg-4", "col-md-6", "portfolio-item", "filter-app");

        var div = document.createElement("div");
        div.classList.add("portfolio-wrap");

        var image = document.createElement("img");
        image.src = images[0];
        image.classList.add("img-fluid");
        image.height = 800;
        image.width = 600;

        var portfolioInfo = document.createElement("div");
        portfolioInfo.classList.add("portfolio-info");

        var heading = document.createElement("h4");
        heading.textContent = title;

        var p = document.createElement("p");
        p.textContent = category;

        var portfolioLinks = document.createElement("div");
        portfolioLinks.classList.add("portfolio-links", "d-flex", "justify-content-center", "align-items-center");

        var link = document.createElement("a");
        link.href = "portfolio-details?pid=" + keys[i];
        link.setAttribute("data-gallery", "portfolioDetailsGallery");
        link.setAttribute("data-glightbox", "type: external");
        link.classList.add("portfolio-details-lightbox");
        link.setAttribute("title", title);
        link.innerHTML = "<i class='bx bx-link'></i>";


        portfolioInfo.appendChild(heading);
        portfolioInfo.appendChild(p);
        portfolioLinks.appendChild(link);
        portfolioInfo.appendChild(portfolioLinks);

        div.appendChild(image);
        div.appendChild(portfolioInfo);

        colDiv.appendChild(div);
        rowDiv.appendChild(colDiv);
      }
    }
  };
  req.send(null);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadProjectDetails() {
  var req = new XMLHttpRequest();
  req.open("GET", "./assets/data/projects.json", true);
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200) {
      const id = getParameterByName('pid');
      var data = JSON.parse(req.responseText);
      var project = data[id];
      if (id === null || project === undefined) {
        window.history.back();
        return;
      }
      document.getElementById("portfolio-title").innerHTML = project.title;

      document.getElementById("img-1").src = project.image[0];
      document.getElementById("img-2").src = project.image[1];
      document.getElementById("img-3").src = project.image[2];

      document.getElementById("category").innerHTML = "<strong>Category</strong>: "+project.category;
      document.getElementById("date").innerHTML = "<strong>Date</strong>: "+project.date;
      document.getElementById("URL").innerHTML = `<strong>URL</strong>: <a href=${project.url} target="_blank">${project.url}</a>`;

      var tags_ele = document.getElementsByClassName("tag-container")[0];
      console.log(typeof(tags_ele));
      console.log(tags_ele);
      var tags_list = project.tags.split("|");
      for (var i = 0; i < tags_list.length; i++) {
        var div = document.createElement("div");
        div.classList.add("tag");
        div.innerHTML = tags_list[i];
        tags_ele.appendChild(div);
        console.log(typeof(div));
        console.log(div);
      }      

      var desc_ele = document.getElementById("desc-list");
      var desc_list = project.desc;
      for (var i = 0; i < desc_list.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = desc_list[i];
        desc_ele.appendChild(li);
      }
    }
  }
  req.send(null);
}
