const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let Currcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = Currcode;
        newOption.value = Currcode;
        if (select.name === "from" && Currcode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && Currcode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangerate = async () => {
    let amount = document.querySelector(".Amount input");
    let amtval = amount.value;

    if (amtval === "" || amtval < 1) {
        amtval = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Exchange rate not available");
        }
        let data = await response.json();

        let rate = data.rates[toCurr.value];
        if (!rate) {
            throw new Error("Exchange rate not found");
        }

        let finalamount = amtval * rate;
        msg.innerText = `${amtval} ${fromCurr.value} = ${finalamount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Exchange rate not available";
        console.error("Error fetching exchange rate:", error);
    }
};

const updateFlag = (element) => {
    let Currcode = element.value;
    let countrycode = countryList[Currcode];
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangerate();
});

window.addEventListener("load", () => {
    updateExchangerate();
});
