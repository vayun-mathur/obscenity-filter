// Get the root element of the document (usually <html>)
const rootElement = document.getElementsByTagName("body")[0];

function keepText(originalText) {
  //TODO replace with call to obscenity api
  if(originalText.includes("e")) {
    return "e";
  }
  else {
    return originalText;
  }
}

// Function to recursively replace text nodes
function replaceTextWithCat(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Replace the text content with "cat"
    node.textContent = keepText(node.textContent);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Recursively process child nodes
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceTextWithCat(node.childNodes[i]);
    }
  }
}

// Start the replacement process from the root element
replaceTextWithCat(rootElement);
