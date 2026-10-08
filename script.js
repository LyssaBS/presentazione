document.querySelectorAll('.vg-select').forEach(function (select) {
  var options = select.dataset.options.split(',');
  var index = 0;
  var value = select.querySelector('.value');
  var dots = select.nextElementSibling;

  options.forEach(function () {
    dots.appendChild(document.createElement('span'));
  });

  function update() {
    value.textContent = options[index];
    dots.querySelectorAll('span').forEach(function (dot, i) {
      dot.classList.toggle('on', i === index);
    });
  }

  select.querySelector('.left').onclick = function () {
    index = (index - 1 + options.length) % options.length;
    update();
  };
  select.querySelector('.right').onclick = function () {
    index = (index + 1) % options.length;
    update();
  };

  update();
});


var creditsTab = document.getElementById('tabCredits');
var tabs = Array.from(document.querySelectorAll('.stepper [data-bs-toggle="tab"]'))
  .filter(function (t) { return t !== creditsTab; });
var btnAccept = document.getElementById('btnAccept');
var btnBack = document.getElementById('btnBack');
var btnCredits = document.getElementById('btnCredits');
var lastStep = 0; // step da cui si è aperto Credits, per tornarci con Indietro

function currentIndex() {
  return tabs.findIndex(function (t) { return t.classList.contains('active'); });
}

function show(tab) {
  if (tab) bootstrap.Tab.getOrCreateInstance(tab).show();
}

function next() {
  var current = currentIndex();
  if (current >= 0) show(tabs[current + 1]);
}

function prev() {
  var current = currentIndex();
  show(current >= 0 ? tabs[current - 1] : tabs[lastStep]);
}

tabs.concat(creditsTab).forEach(function (tab) {
  tab.addEventListener('shown.bs.tab', function () {
    var current = currentIndex();
    if (current >= 0) {
      lastStep = current;
      tabs.forEach(function (t, i) {
        t.parentElement.classList.toggle('active', i === current);
        t.parentElement.classList.toggle('done', i < current);
      });
    }
    btnBack.disabled = current === 0;
    btnAccept.disabled = current === -1 || current === tabs.length - 1;
    btnCredits.disabled = current === -1;
    document.body.dataset.step = tab.getAttribute('href').slice(1);
  });
});

btnAccept.onclick = next;
btnBack.onclick = prev;
btnCredits.onclick = function () { show(creditsTab); };
btnBack.disabled = true;

document.addEventListener('keydown', function (e) {
  if (e.target.closest('input, textarea, select, [contenteditable]')) return;
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (!document.getElementById('lightbox').hidden) return;
  var key = e.key.toLowerCase();
  if (key === 'b') next();
  if (key === 'v') prev();
});


document.querySelectorAll('.select-group').forEach(function (group) {
  var buttons = Array.from(group.querySelectorAll('.selectable'));
  var panel = group.closest('.tab-pane').querySelector('.detail-panel');
  var details = panel ? Array.from(panel.querySelectorAll('.detail')) : [];

  function showDetail(index) {
    details.forEach(function (d, i) { d.hidden = i !== index; });
  }

  buttons.forEach(function (btn, i) {
    btn.onclick = function () {
      group.querySelector('.selected').classList.remove('selected');
      btn.classList.add('selected');
      showDetail(i);
    };
  });

  showDetail(buttons.findIndex(function (b) { return b.classList.contains('selected'); }));
});


var lightbox = document.getElementById('lightbox');
var lightboxImg = lightbox.querySelector('img');
var lightboxCount = lightbox.querySelector('.lightbox-count');
var galleryImgs = [];
var galleryIndex = 0;

function showPhoto(i) {
  galleryIndex = (i + galleryImgs.length) % galleryImgs.length;
  var img = galleryImgs[galleryIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCount.textContent = (galleryIndex + 1) + ' / ' + galleryImgs.length;
  // con una sola foto frecce e contatore non servono
  lightbox.classList.toggle('single', galleryImgs.length < 2);
}

document.querySelectorAll('.detail-gallery').forEach(function (gallery) {
  var imgs = Array.from(gallery.querySelectorAll('img'));
  imgs.forEach(function (img, i) {
    img.onclick = function () {
      galleryImgs = imgs;
      showPhoto(i);
      lightbox.hidden = false;
    };
  });
});

lightbox.onclick = function (e) {
  if (e.target === lightbox) lightbox.hidden = true;
};
lightbox.querySelector('.prev').onclick = function () { showPhoto(galleryIndex - 1); };
lightbox.querySelector('.next').onclick = function () { showPhoto(galleryIndex + 1); };

document.addEventListener('keydown', function (e) {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') lightbox.hidden = true;
  if (e.key === 'ArrowLeft') showPhoto(galleryIndex - 1);
  if (e.key === 'ArrowRight') showPhoto(galleryIndex + 1);
});
