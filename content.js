// Get the root element of the document (usually <html>)
const rootElement = document.getElementsByTagName("body")[0];

const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (result) {
      resolve(result);
    });
  });
};

async function apiCall(text) {

  items = await readLocalStorage(["toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"]);

  console.log(items)

  server = (await readLocalStorage(["server"]))["server"]

  const response = await fetch('http://'+server+'/api', { 
    method: 'POST', 
    body: JSON.stringify({"texts": text, "categories": items}),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
}

nodes_to_replace = []

// Function to recursively replace text nodes
function getAllTexts(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Replace the text content with "cat"
    nodes_to_replace.push(node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Recursively process child nodes
    for (let i = 0; i < node.childNodes.length; i++) {
      getAllTexts(node.childNodes[i]);
    }
  }
}

async function replaceText() {
  texts = []
  for(i = 0; i < nodes_to_replace.length; i++) {
    if(nodes_to_replace[i].textContent.trim() != "") {
      texts.push(nodes_to_replace[i].textContent)
    }
  }
  result = await apiCall(texts);
  result = result["results"]
  if(result == undefined) return;
  console.log(result)
  j = 0;
  for(i = 0; i < nodes_to_replace.length; i++) {
    if(nodes_to_replace[i].textContent.trim() == "")
      continue;
    if(result[j] != "normal") {
      nodes_to_replace[i].textContent = result[j]
    }
    j++;
  }
}

// Start the replacement process from the root element
getAllTexts(rootElement);
replaceText()