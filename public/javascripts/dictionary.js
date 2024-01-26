document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById("searchButton");
    const inputWord = document.getElementById("word");
    const wordDiv = document.getElementById("dictionary-word-div");

    searchButton.addEventListener('click', e=>{
        e.preventDefault();
        let word = inputWord.value;
        const url = `http://localhost:3000/dictionary?word=${word}`;
        fetch(url, {method:"GET"})
            .then(response => response.json())
            .then(data => {
                console.log(data[0]);
                if (data.doesnt_exist) {
                    createNotExists()
                }
                else {
                    createDescription(data[0]);
                }
            })
            .catch(err => console.error(err.message));
    })

function createDescription(data) {
    while (wordDiv.firstChild) {
        wordDiv.removeChild(wordDiv.firstChild);
    }
    const title = document.createElement("h2");
    title.innerHTML = data.word;
    wordDiv.appendChild(title);
    if (data.phonetic) {
        const phonetic = document.createElement("h3");
        phonetic.innerHTML = data.phonetic;
        wordDiv.appendChild(phonetic);
    }

    const meanings = data.meanings;
    if (meanings) {
        const m = document.createElement("p");
        m.innerHTML = "Meanings:";
        wordDiv.appendChild(m);
        let i = 1;
        meanings.forEach(item => {
            const div = document.createElement("div");
            const partOfSpeech = document.createElement("h4");
            partOfSpeech.innerHTML = `${i}. Part of speech: ${item.partOfSpeech}`
            const definitionsDiv = document.createElement("div");
            definitionsDiv.classList.add("def-div");
            const definitions = item.definitions;
            let k = 1;
                definitions.forEach(d => {
                    const def = document.createElement("p");
                    def.innerHTML = `${k}) ${d.definition}`;
                    definitionsDiv.appendChild(def);
                    k++;
                })
            div.appendChild(partOfSpeech);
            div.appendChild(definitionsDiv);
            wordDiv.appendChild(div);
            k++;
            i++;
            })
    }


}

function createNotExists() {
        const message = document.createElement("p");
        message.innerHTML = "There is no such word";
        wordDiv.appendChild(message);
}

})