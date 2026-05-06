function afficherPanier() {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  let container = document.getElementById('panier-container');
  let total = 0;

  container.innerHTML = '';

  panier.forEach((produit, index) => {
    total += produit.prix * produit.quantite;

    container.innerHTML += `
      <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <img src="${produit.image}" width="80">
        <h3>${produit.nom}</h3>
        <p>Prix: ${produit.prix} MAD</p>
        <p>Quantité: ${produit.quantite}</p>
        <button onclick="supprimerProduit(${index})">Supprimer</button>
      </div>
    `;
  });

  document.getElementById('total').textContent = "Total: " + total + " MAD";
}

function supprimerProduit(index) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  panier.splice(index, 1);
  localStorage.setItem('panier', JSON.stringify(panier));
  afficherPanier();
}

function passerCommande() {
  window.location.href = "paiement.html";
}

afficherPanier();