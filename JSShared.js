/* ============================================
   ouvrirModal() - appelée au clic sur une carte
   reçoit 5 paramètres :
   - image : nom du fichier image
   - nom : nom du bracelet
   - prix : prix en MAD
   - description : texte descriptif
   - matiere : matière du bracelet
============================================ */
function ouvrirModal(image, nom, prix, description, matiere) {

  /* remplace le src de l'image par le chemin complet */
  document.getElementById('modal-img').src = image;

  /* remplace le texte de chaque élément */
  document.getElementById('modal-nom').textContent = nom;
  document.getElementById('modal-prix').textContent = prix;
  document.getElementById('modal-desc').textContent = description;
  document.getElementById('modal-matiere').textContent = 'Matière : ' + matiere;

  /* ajoute la classe "actif" pour afficher le modal */
  document.getElementById('modal').classList.add('actif');
}

/* ============================================
   fermerModal() - ferme le modal
============================================ */
function fermerModal() {
  document.getElementById('modal').classList.remove('actif');
}

/* ============================================
   afficherNotification() - affiche la notification
   pendant 3 secondes puis la cache automatiquement
============================================ */
function afficherNotification() {
  const notif = document.getElementById('notification');
  notif.classList.add('visible');
  setTimeout(function() {
    notif.classList.remove('visible');
  }, 3000);
}

/* ============================================
   allerEnHaut() - remonte en haut de la page
============================================ */
function allerEnHaut() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/* ============================================
   DETECTER LE SCROLL
   affiche le bouton ↑ quand on descend de 300px
============================================ */
window.addEventListener('scroll', function() {
  const bouton = document.getElementById('scrollTop');
  if (window.scrollY > 300) {
    bouton.classList.add('visible');
  } else {
    bouton.classList.remove('visible');
  }
});