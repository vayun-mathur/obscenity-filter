categories = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]
inputs = ["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate", "server"]

const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, function (result) {
        resolve(result);
      });
    });
  };

async function main() {
items = await readLocalStorage(inputs)
console.log(items)

for(let index in categories) {
    let category = categories[index]
    // create a new checkbox and add to body
    let checkbox = document.createElement('input')
    checkbox.type = "checkbox"
    checkbox.name = category
    if(items[category] === true) {
        checkbox.checked = true
    }
    //add text first
    let text = document.createTextNode(category)
    document.body.appendChild(text)
    // add to body
    document.body.appendChild(checkbox)
    //add event listener
    checkbox.addEventListener('change', function() {
        // save to local storage
        let save = {}
        save[category] = checkbox.checked
        chrome.storage.local.set(save, function() {
            console.log(save)
        })
    })
    // add newline
    let newline = document.createElement('br')
    document.body.appendChild(newline)
}

// add server input
let text = document.createTextNode("server: ")
document.body.appendChild(text)
let serverInput = document.createElement('input')
serverInput.type = "text"
serverInput.name = "server"
serverInput.value = items["server"]
document.body.appendChild(serverInput)
// add event listener
serverInput.addEventListener('change', function() {
    // save to local storage
    let save = {}
    save["server"] = serverInput.value
    chrome.storage.local.set(save, function() {
        console.log(save)
    })
})
// add newline
let newline = document.createElement('br')
document.body.appendChild(newline)

}

main()