// Get the root element of the document (usually <html>)
const rootElement = document.getElementsByTagName("body")[0];

async function apiCall(text) {
  // call obscenity api at 127.0.0.1:5000/api

  const response = await fetch('http://127.0.0.1:5000/api', { 
    method: 'POST', 
    body: JSON.stringify({"texts": text}),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
}

async function keepText(originalText) {
  //TODO replace with call to obscenity api
  result = await apiCall(originalText);
  result = result["results"][0]
  console.log(result)
  if(result != "normal") {
    return result;
  }
  else {
    return originalText;
  }
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
    texts.push(nodes_to_replace[i].textContent)
  }
  result = await apiCall(texts);
  result = result["results"]
  console.log(result)
  for(i = 0; i < nodes_to_replace.length; i++) {
    if(result[i] != "normal") {
      nodes_to_replace[i].textContent = result[i]
    }
  }
}

// Start the replacement process from the root element
getAllTexts(rootElement);
replaceText()