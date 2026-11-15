const url = "https://xaus.com/api/v1/spot"
async function getPrices(){
    try {
document.querySelector("#gold-price").textContent = "Chargement...";
document.querySelector("#gold-currency").textContent="Chargement...";
document.querySelector("#silver-price").textContent = "Chargement...";
document.querySelector("#gold-updated").textContent = "Chargement...";
document.querySelector("#silver-updated").textContent= "Chargement...";
document.querySelector("#silver-currency").textContent="Chargement...";
        const response = await fetch(url)
        if(!response.ok){
            throw new Error("Erreur HTTP")
        }
        const data = await response.json()
document.querySelector("#gold-price").textContent = `prix Gold ${data.xau.price}`;
document.querySelector("#gold-currency").textContent=`${data.xau.currency} / once troy` 
document.querySelector("#silver-price").textContent = `prix Silver ${data.silver_usd_oz}`;
document.querySelector("#gold-updated").textContent = ` ${data.updated_at}`;
document.querySelector("#silver-updated").textContent= ` ${data.updated_at}`
document.querySelector("#silver-currency").textContent=`USD / once troy`
    } catch (error) {
document.querySelector("#gold-price").textContent = "Erreur de chargement";
document.querySelector("#silver-price").textContent = "Erreur de chargement";
document.querySelector("#gold-currency").textContent = "Erreur de chargemenet";
document.querySelector("#silver-currency").textContent ="Erreur de chargemenet";
document.querySelector("#gold-updated").textContent = "Erreur de chargemenet";
document.querySelector("#silver-updated").textContent="Erreur de chargemenet"
}


}
getPrices()
