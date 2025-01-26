// Select DOM elements
const imageInput = document.getElementById("imageInput");
const imageCanvas = document.getElementById("imageCanvas");
const extractedText = document.getElementById("extractedText");
const copyButton = document.getElementById("copyButton");
const listenButton = document.getElementById("listenButton");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Set up canvas context
const ctx = imageCanvas.getContext("2d");

// Handle image upload and render on canvas
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        img.onload = () => {
            // Draw the image on the canvas
            imageCanvas.width = img.width / 2; // Scale down for better rendering
            imageCanvas.height = img.height / 2;
            ctx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
            
            // Perform OCR on the image
            performOCR(img);
        };

        reader.readAsDataURL(file);
    }
});

// Perform OCR using Tesseract.js
function performOCR(img) {
    extractedText.value = "Processing text, please wait...";
    Tesseract.recognize(img.src, "eng", {
        logger: (info) => console.log(info), // Logs the OCR progress
    })
        .then(({ data: { text } }) => {
            extractedText.value = text.trim() || "No text detected in the image.";
        })
        .catch((error) => {
            extractedText.value = "Error extracting text.";
            console.error("OCR Error:", error);
        });
}

// Copy text to clipboard
copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(extractedText.value).then(() => {
        alert("Text copied to clipboard!");
    });
});

// Listen to text
listenButton.addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(extractedText.value);
    speechSynthesis.speak(utterance);
});

// Search for a word in extracted text
searchButton.addEventListener("click", () => {
    const searchWord = searchInput.value;
    const text = extractedText.value;

    if (searchWord && text.includes(searchWord)) {
        alert(`"${searchWord}" found in the text!`);
    } else {
        alert(`"${searchWord}" not found.`);
    }
});
