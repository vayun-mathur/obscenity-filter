const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");
const t4 = document.getElementById("t4");
const t5 = document.getElementById("t5");
const t6 = document.getElementById("t6");

//chrome.storage.local.setIfNull({ "toxic": false, "severely toxic": false, "obscene": false });

t1.addEventListener("change", function () {
    chrome.storage.local.set({ "toxic": t1.checked })
});
t2.addEventListener("change", function () {
    chrome.storage.local.set({ "severely toxic": t2.checked })
});
t3.addEventListener("change", function () {
    chrome.storage.local.set({ "obscene": t3.checked })
});

t4.addEventListener("change", function () {
    chrome.storage.local.set({ "threat": t4.checked })
});
t5.addEventListener("change", function () {
    chrome.storage.local.set({ "insult": t5.checked })
});
t6.addEventListener("change", function () {
    chrome.storage.local.set({ "identity_hate": t6.checked })
});