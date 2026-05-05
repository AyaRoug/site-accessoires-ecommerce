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
/* ============================================
   DONNÉES DU PANIER
   tableau qui stocke tous les articles ajoutés
   chaque article est un objet avec :
   - id : identifiant unique (nom du produit)
   - image, nom, prix (en nombre), prixAffiche
   - quantite : nombre d'exemplaires
============================================ */
let panier = [];

/* ============================================
   ajouterAuPanier()
   appelée par les boutons "Ajouter au panier"
   sur les cartes ET dans le modal
   
   Paramètres :
   - image : chemin de l'image (ex: "image/brooch2.jfif")
   - nom : nom du produit (ex: "Broche De Luxe")
   - prixAffiche : prix affiché (ex: "20 000 MAD")
   
   La fonction extrait le nombre du prix affiché
   pour pouvoir calculer le total
============================================ */
function ajouterAuPanier(image, nom, prixAffiche) {

  /* extrait uniquement les chiffres du prix
     "20 000 MAD" → retire les espaces → 20000 (nombre) */
  const prixNombre = parseInt(prixAffiche.replace(/\s/g, '').replace('MAD', ''));

  /* cherche si cet article est déjà dans le panier
     findIndex retourne -1 si non trouvé */
  const indexExistant = panier.findIndex(article => article.nom === nom);

  if (indexExistant !== -1) {
    /* l'article existe déjà : on augmente juste la quantité */
    panier[indexExistant].quantite += 1;
  } else {
    /* nouvel article : on l'ajoute au tableau */
    panier.push({
      id: nom,              /* on utilise le nom comme identifiant */
      image: image,
      nom: nom,
      prix: prixNombre,
      prixAffiche: prixAffiche,
      quantite: 1
    });
  }

  /* met à jour l'affichage du tiroir et du badge */
  mettreAJourAffichagePanier();

  /* affiche la notification de confirmation */
  afficherNotification();

  /* ouvre le tiroir automatiquement pour montrer l'ajout */
  ouvrirPanier();
  sauvegarderPanier();
}

/* ============================================
   supprimerDuPanier()
   supprime complètement un article du panier
   quelque soit sa quantité
   
   Paramètre :
   - nom : identifiant de l'article à supprimer
============================================ */
function supprimerDuPanier(nom) {
  /* filter crée un nouveau tableau sans l'article supprimé */
  panier = panier.filter(article => article.nom !== nom);
  mettreAJourAffichagePanier();
  sauvegarderPanier();
}

/* ============================================
   changerQuantite()
   augmente ou diminue la quantité d'un article
   si la quantité atteint 0, l'article est supprimé
   
   Paramètres :
   - nom : identifiant de l'article
   - delta : +1 pour augmenter, -1 pour diminuer
============================================ */
function changerQuantite(nom, delta) {
  const index = panier.findIndex(article => article.nom === nom);
  
  if (index !== -1) {
    panier[index].quantite += delta;

    /* si quantité = 0 ou moins, on retire l'article */
    if (panier[index].quantite <= 0) {
      supprimerDuPanier(nom);
    } else {
      mettreAJourAffichagePanier();
    }
  }
  sauvegarderPanier();
}

/* ============================================
   mettreAJourAffichagePanier()
   fonction principale qui redessine tout le tiroir
   appelée après chaque ajout / suppression / changement
============================================ */
function mettreAJourAffichagePanier() {

  /* --- 1. BADGE : nombre total d'articles --- */
  const badge = document.getElementById('panier-badge');
  const totalArticles = panier.reduce((total, article) => total + article.quantite, 0);

  if (totalArticles === 0) {
    badge.style.display = 'none';   /* cache le badge si panier vide */
  } else {
    badge.style.display = 'flex';   /* affiche le badge */
    badge.textContent = totalArticles;
  }

  /* --- 2. LISTE DES ARTICLES dans le tiroir --- */
  const liste = document.getElementById('panier-liste');

  if (panier.length === 0) {
    /* panier vide : affiche le message */
    liste.innerHTML = '<p class="panier-vide">Votre panier est vide.</p>';
  } else {
    /* construit le HTML de chaque article
       et les assemble en une seule chaîne */
    liste.innerHTML = panier.map(article => `
      <div class="panier-article">

        <!-- image miniature du produit -->
        <img src="${article.image}" alt="${article.nom}">

        <div class="panier-article-info">
          <!-- nom du produit -->
          <p class="panier-article-nom">${article.nom}</p>
          <!-- prix unitaire -->
          <p class="panier-article-prix">${article.prixAffiche}</p>

          <!-- contrôles de quantité - [chiffre] + -->
          <div class="panier-quantite">
            <button onclick="changerQuantite('${article.nom}', -1)">−</button>
            <span>${article.quantite}</span>
            <button onclick="changerQuantite('${article.nom}', +1)">+</button>
          </div>
        </div>

        <!-- bouton supprimer l'article -->
        <button class="panier-supprimer" onclick="supprimerDuPanier('${article.nom}')">✕</button>

      </div>
    `).join('');
    /* .join('') colle tous les articles ensemble sans séparateur */
  }

  /* --- 3. TOTAL GÉNÉRAL --- */
  const total = panier.reduce((somme, article) => {
    return somme + (article.prix * article.quantite);
  }, 0);

  /* formate le total avec des espaces : 350000 → "350 000 MAD" */
  document.getElementById('panier-total').textContent =
    total.toLocaleString('fr-FR') + ' MAD';
}

/* ============================================
   ouvrirPanier() / fermerPanier() / togglePanier()
   gèrent l'ouverture et fermeture du tiroir
   en ajoutant/retirant la classe "actif"
============================================ */
function ouvrirPanier() {
  document.getElementById('panier-tiroir').classList.add('actif');
  document.getElementById('panier-fond').classList.add('actif');
}

function fermerPanier() {
  document.getElementById('panier-tiroir').classList.remove('actif');
  document.getElementById('panier-fond').classList.remove('actif');
}

/* toggle : si ouvert → ferme, si fermé → ouvre */
function togglePanier() {
  const tiroir = document.getElementById('panier-tiroir');
  if (tiroir.classList.contains('actif')) {
    fermerPanier();
  } else {
    ouvrirPanier();
  }
}

/* ============================================
   commander()
   appelée par le bouton "Commander"
   pour l'instant affiche un message simple
   vous pouvez la remplacer par une redirection
   vers une page de paiement ou un formulaire
============================================ */
function commander() {
  if (panier.length === 0) {
    alert('Votre panier est vide !');
    return;
  }
  fermerPanier();
  window.location.href = 'paiement.html';
}
function sauvegarderPanier() {
  localStorage.setItem('zina-panier', JSON.stringify(panier));
}

function chargerPanier() {
  const donnees = localStorage.getItem('zina-panier');
  if (donnees) {
    panier = JSON.parse(donnees);
    mettreAJourAffichagePanier();
  }
}
chargerPanier();