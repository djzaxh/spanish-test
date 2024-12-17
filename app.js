document.getElementById("start").addEventListener("click", async () => {
  const englishWord = document.getElementById("word-input").value.trim();
  if (!englishWord) {
    alert("Please enter a word in English.");
    return;
  }

  const spanishWord = await getSpanishTranslation(englishWord);
  if (!spanishWord) {
    alert("Could not find a translation. Try another word.");
    return;
  }

  const options = generateMisspelledOptions(spanishWord);

  displayOptions(spanishWord, options);
});

async function getSpanishTranslation(englishWord) {
  const apiUrl = "https://api.mymemory.translated.net/get";
  try {
    const response = await fetch(`${apiUrl}?q=${englishWord}&langpair=en|es`);
    const data = await response.json();
    return data.responseData.translatedText.toLowerCase();
  } catch (error) {
    console.error("Error fetching translation:", error);
    return null;
  }
}

function generateMisspelledOptions(correctWord) {
  const options = new Set([correctWord]);

  while (options.size < 3) {
    let misspelled = correctWord
      .split("")
      .map((char) =>
        Math.random() > 0.8 ? String.fromCharCode(char.charCodeAt(0) + 1) : char
      )
      .join("");
    if (misspelled !== correctWord) {
      options.add(misspelled);
    }
  }

  return Array.from(options);
}

function displayOptions(correctWord, options) {
  const container = document.querySelector(".container");
  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  container.style.flexDirection = "row";
  container.innerHTML = `<h3>Choose the correct Spanish word for "${document
    .getElementById("word-input")
    .value.trim()}"</h3>`;
  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.className = "btn";
    button.addEventListener("click", () => {
      if (option === correctWord) {
        alert("Correct!");
      } else {
        alert(`Wrong! The correct word was "${correctWord}".`);
      }
      resetGame();
    });
    container.appendChild(button);
  });
}

function resetGame() {
  const container = document.querySelector(".container");
  container.style.flexDirection = "column";
  container.innerHTML = `
      <h3>
        To test your Spanish you have to enter the word in English. Then 3 words will appear. Only one is correct!
      </h3>
      <input type="text" placeholder="Word in English..." id="word-input" />
      <button id="start" class="btn" type="button">Start</button>
    `;

  document.getElementById("start").addEventListener("click", async () => {
    const englishWord = document.getElementById("word-input").value.trim();
    if (!englishWord) {
      alert("Please enter a word in English.");
      return;
    }

    const spanishWord = await getSpanishTranslation(englishWord);
    if (!spanishWord) {
      alert("Could not find a translation. Try another word.");
      return;
    }

    const options = generateMisspelledOptions(spanishWord);
    displayOptions(spanishWord, options);
  });
}
