document.addEventListener('DOMContentLoaded', function () {
    const newsButton = document.getElementById("newsButton");
    const inputNews = document.getElementById("title-search");
    const amount = document.getElementById("amount");
    const newsContainer = document.getElementById("news-container");
    const moreButton = document.getElementById("show-more");
    const form = document.getElementById("news-form");
    const server = `http://localhost:3000/news?`;


    let title;
    let page;
    let sortBy = "publishedAt";
    let language = "en";
    let daysLater = 14;
    let currentDate = new Date();
    let urlDate = new Date;
    urlDate = urlDate.setDate(currentDate.getDate() - daysLater);
    let from = formatData(urlDate);


    newsButton.addEventListener('click', e=>{
        e.preventDefault();
        while (newsContainer.firstChild) {
            newsContainer.removeChild(newsContainer.firstChild);
        }
        title = inputNews.value;
        page = 1;
        fetch(server + new URLSearchParams({
            title: title,
            page: page,
            sortBy: sortBy,
            language: language,
            from: from
            }),
            {method:"GET"})
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                if (data.doesnt_exist) {
                    createNotExists()
                }
                else {
                    createNews(data);
                }
            })
            .catch(err => console.error(err.message));
    })

    moreButton.addEventListener("click", e=>{
        e.preventDefault();
        while (newsContainer.firstChild) {
            newsContainer.removeChild(newsContainer.firstChild);
        }
        page++;
        fetch(server + new URLSearchParams({
            title: title,
            page: page,
            sortBy: sortBy,
            language: language,
            from: from
        }),
            {method:"GET"})
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                createNews(data);
            })
            .catch(err => console.error(err.message));
    })

    function createNews(data) {
        amount.innerHTML = `at all ${data.totalResults} news`;
        let articlesArray = data.articles
        articlesArray.forEach(newsItem => {
            const div = document.createElement("div");
            div.classList.add("news-item");
            div.innerHTML = `<h3>${newsItem.title}</h3>
                             <h4>${newsItem.author}</h4>
                             <p>${newsItem.description}</p>
                             <p> <a href="${newsItem.url}">Read more</a> </p>
                                `;
            newsContainer.appendChild(div);
        })
        if (data.totalResults > 4) {
            moreButton.style.setProperty('display', 'inline');
        } else {
            moreButton.style.setProperty('display', 'none');
        }
    }

    function createNotExists() {

    }


    function formatData(dateString) {
        let d = new Date(dateString);
        let year = d.getFullYear();
        let month = String(d.getMonth() + 1).padStart(2, '0');
        let day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    form.addEventListener('change', function(event) {
        if (event.target.type === 'radio' && event.target.name === 'period') {
            daysLater = event.target.value;
            urlDate = new Date();
            urlDate = urlDate.setDate(currentDate.getDate() - daysLater);
            from = formatData(urlDate);
        }
        if (event.target.type === 'radio' && event.target.name === 'sort') {
            sortBy = event.target.value;
        }
        if (event.target.type === 'radio' && event.target.name === 'lang') {
            language = event.target.value;
        }
        // myFunction();
    })
})