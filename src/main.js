
const url = "https://xaus.com/api/v1/spot";
const container = document.querySelector("#metals-container");


async function getPrices() {

    try {
        container.textContent = "Chargement...";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erreur HTTP");
        }

        const data = await response.json();

        const [variationOr, variationArgent] = await Promise.all([
            getVariation("xau", data.xau.price),
            getVariation("silver", data.silver_usd_oz)
        ]);

        const metaux = [
            {
                nom: "Or",
                prix: data.xau.price,
                devise: data.xau.currency,
                unite: "once troy",
                image: "photos/gold-bars.png",
                variation: variationOr
            },
            {
                nom: "Argent",
                prix: data.silver_usd_oz,
                devise: "USD",
                unite: "once troy",
                image: "photos/bars.png",
                variation: variationArgent
            }
        ];

        afficherCartes(metaux, data.updated_at);

    } catch (error) {
        console.error(error);
        container.textContent = "Erreur de chargement";
    }
}


function afficherCartes(metaux, dateMaj) {

    container.replaceChildren();

    metaux.forEach(function(metal) {

        // Carte principale
        const carte = document.createElement("div");
        carte.classList.add("gold");

        // Content
        const content = document.createElement("div");
        content.classList.add("content");

        // Photo
        const photo = document.createElement("div");
        photo.classList.add("photo");

        const image = document.createElement("img");
        image.src = metal.image;
        image.alt = metal.nom;
        image.width = 200;

        photo.appendChild(image);

        // Informations
        const info = document.createElement("div");
        info.classList.add("linfo");

        const titre = document.createElement("h2");
        titre.textContent = metal.nom;

        const prix = document.createElement("p");
        prix.textContent = metal.prix;

        const devise = document.createElement("p");
        devise.textContent = `${metal.devise} / ${metal.unite}`;

        // Variation
        const variation = document.createElement("p");

        if (metal.variation !== null) {

            const valeur = metal.variation.valeur;
            const pourcentage = metal.variation.pourcentage;

            let fleche = "→";
            let couleur = "stable";

            if (valeur > 0) {
                fleche = "↑";
                couleur = "hausse";
            } else if (valeur < 0) {
                fleche = "↓";
                couleur = "baisse";
            }

            const signeValeur = valeur > 0 ? "+" : "";
            const signePourcentage = pourcentage > 0 ? "+" : "";

            variation.textContent =
                `${fleche} ${signeValeur}${valeur.toFixed(2)} ${metal.devise} (${signePourcentage}${pourcentage.toFixed(2)}%)`;

            variation.classList.add(couleur);

        } else {
            variation.textContent = "Variation indisponible";
        }

        info.appendChild(titre);
        info.appendChild(prix);
        info.appendChild(devise);
        info.appendChild(variation);

        content.appendChild(photo);
        content.appendChild(info);

        // Date de mise à jour
        const mise = document.createElement("div");
        mise.classList.add("mise");

        const dateTexte = document.createElement("p");
        dateTexte.textContent = "🕐 Dernière mise à jour : ";

        const date = document.createElement("span");
        date.textContent = dateMaj;

        dateTexte.appendChild(date);
        mise.appendChild(dateTexte);

        // Assemblage
        carte.appendChild(content);
        carte.appendChild(mise);

        container.appendChild(carte);
    });
}


async function getVariation(symbol, prixActuel) {

    try {
        const urlHistorique =
            `https://xaus.com/api/v1/chart?symbol=${symbol}&range=5d&interval=1d`;

        const response = await fetch(urlHistorique);

        if (!response.ok) {
            throw new Error("Erreur historique");
        }

        const historique = await response.json();

        if (!Array.isArray(historique.points) ||
            historique.points.length < 2) {
            return null;
        }

        const prixPrecedent =
            historique.points[historique.points.length - 2].c;

        const variation = prixActuel - prixPrecedent;

        const pourcentage =
            (variation / prixPrecedent) * 100;

        return {
            valeur: variation,
            pourcentage: pourcentage
        };

    } catch (error) {
        console.error(error);
        return null;
    }
}


getPrices();
