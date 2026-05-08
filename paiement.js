let fraisLivraison = 0;
let methodePaiement = 'carte';

/* au chargement : lit le panier sauvegardé et affiche le récap */
window.addEventListener('load', function() {
  afficherRecapitulatif();
});

function afficherRecapitulatif() {
  const zone = document.getElementById('recap-articles');

  if (!panier || panier.length === 0) {
    zone.innerHTML = '<p style="color:#C4A882;font-style:italic;font-size:13px;padding:10px 0;">Panier vide</p>';
    mettreAJourTotaux();
    return;
  }

  zone.innerHTML = panier.map(article => `
    <div class="pmt-recap-article">
      <img src="${article.image}" alt="${article.nom}">
      <span class="pmt-recap-article-nom">
        ${article.nom}
        <br>
        <span style="color:#C4A882;font-size:11px;">Qté : ${article.quantite}</span>
      </span>
      <span class="pmt-recap-article-prix">
        ${(article.prix * article.quantite).toLocaleString('fr-FR')} MAD
      </span>
    </div>
  `).join('');

  mettreAJourTotaux();
}

function mettreAJourTotaux() {
  const sousTotal = panier.reduce((somme, a) => somme + (a.prix * a.quantite), 0);
  const total = sousTotal + fraisLivraison;

  document.getElementById('recap-sous-total').textContent =
    sousTotal.toLocaleString('fr-FR') + ' MAD';
  document.getElementById('recap-livraison').textContent =
    fraisLivraison === 0 ? 'Gratuit' : fraisLivraison + ' MAD';
  document.getElementById('recap-total-final').textContent =
    total.toLocaleString('fr-FR') + ' MAD';
}

function choisirLivraison(element, frais) {
  fraisLivraison = frais;
  document.querySelectorAll('.pmt-livraison-option').forEach(opt => {
    opt.classList.remove('selectionnee');
  });
  element.classList.add('selectionnee');
  mettreAJourTotaux();
}

function allerEtapePaiement() {
  /* vérification des champs obligatoires */
  const champs = ['prenom', 'nom', 'telephone', 'adresse', 'ville'];
  let valide = true;

  champs.forEach(id => {
    const champ = document.getElementById(id);
    if (!champ.value.trim()) {
      champ.style.borderColor = '#E24B4A';
      valide = false;
    } else {
      champ.style.borderColor = '#E8DDD0';
    }
  });

  if (!valide) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  document.getElementById('section-livraison').style.display = 'none';
  document.getElementById('section-paiement').style.display = 'block';

  /* mise à jour barre de progression */
  const etapes = document.querySelectorAll('.pmt-etape');
  etapes[1].classList.remove('active');
  etapes[1].classList.add('terminee');
  etapes[1].querySelector('.pmt-etape-cercle').textContent = '✓';
  etapes[2].classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function retourLivraison() {
  document.getElementById('section-paiement').style.display = 'none';
  document.getElementById('section-livraison').style.display = 'block';

  const etapes = document.querySelectorAll('.pmt-etape');
  etapes[1].classList.add('active');
  etapes[1].classList.remove('terminee');
  etapes[1].querySelector('.pmt-etape-cercle').textContent = '2';
  etapes[2].classList.remove('active');
}

function choisirMethode(btn, methode) {
  methodePaiement = methode;
  document.querySelectorAll('.pmt-methode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('form-carte').style.display = 'none';
  document.getElementById('form-virement').style.display = 'none';
  document.getElementById('form-livraison-paiement').style.display = 'none';

  if (methode === 'carte')     document.getElementById('form-carte').style.display = 'block';
  if (methode === 'virement')  document.getElementById('form-virement').style.display = 'block';
  if (methode === 'livraison') document.getElementById('form-livraison-paiement').style.display = 'block';
}

function formaterCarte(input) {
  let v = input.value.replace(/\D/g, '');
  v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = v;
}

function formaterExpiration(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  input.value = v;
}

function confirmerCommande() {
  if (methodePaiement === 'carte') {
    const numero = document.getElementById('carte-numero').value.replace(/\s/g, '');
    const expiration = document.getElementById('carte-expiration').value;
    const cvv = document.getElementById('carte-cvv').value;

    if (numero.length < 16 || expiration.length < 5 || cvv.length < 3) {
      alert('Veuillez remplir correctement les informations de carte.');
      return;
    }
  }

  const numeroCommande = 'ZN-' + Date.now().toString().slice(-6);
  document.getElementById('confirmation-numero').textContent =
    'Numéro de commande : ' + numeroCommande;

  // MISE À JOUR DE LA BARRE DE PROGRESSION
  const etapes = document.querySelectorAll('.pmt-etape');
  etapes[2].classList.remove('active');
  etapes[2].classList.add('terminee');
  etapes[2].querySelector('.pmt-etape-cercle').textContent = '✓';
  etapes[3].classList.add('active');

  // ACTION CRUCIALE : Cacher le contenu principal et la barre pour laisser place à la confirmation
  document.querySelector('.pmt-main').style.display = 'none';
  document.querySelector('.pmt-progression').style.display = 'none';

  // Afficher la page de confirmation
  const confirmationPage = document.getElementById('confirmation-page');
  confirmationPage.style.display = 'flex';

  // Vider le panier
  panier = [];
  sauvegarderPanier(); 
  if (typeof mettreAJourAffichagePanier === "function") {
      mettreAJourAffichagePanier();
  }

  // Remonter en haut de page pour voir le message
  window.scrollTo({ top: 0, behavior: 'smooth' });
}