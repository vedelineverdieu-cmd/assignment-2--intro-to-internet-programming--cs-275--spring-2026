let script = document.createElement(`script`);
script.src = `json/data.json`;
document.body.appendChild(script);

window.info = (data) => {
    let albums = data.albums;
    let slidesContainer = document.querySelector(`.carousel-slides`);

    let i = 0;

    while (i < albums.length) {
        let div = document.createElement(`div`);
        div.className = `album`;
        slidesContainer.appendChild(div);
        i++;
    }
    i = 0;

    let slides = document.querySelectorAll(`.album`);

    while (i < albums.length) {
        let albumData = albums[i];
        let albumDiv = slides[i];

        albumDiv.id = albumData.album;

        let top = document.createElement(`div`);

        let title = document.createElement(`h2`);
        title.textContent = albumData.album;
        top.appendChild(title);

        let artist = document.createElement(`a`);
        artist.href = albumData.url;
        artist.className = `artist-name`;
        artist.textContent = albumData.artist;
        top.appendChild(artist);

        albumDiv.appendChild(top);

        let imgContainer = document.createElement(`div`);
        albumDiv.appendChild(imgContainer);

        let bottom = document.createElement(`div`);

        let img = document.createElement(`img`);
        let cover = albumData.cover_image;
        img.src = cover.path;
        img.width = 640;
        imgContainer.appendChild(img);

        let credit = document.createElement(`p`);
        credit.id = `img-credit`;

        let creditLabel = document.createElement(`span`);
        creditLabel.textContent = `Credit: `;
        credit.appendChild(creditLabel);

        let creditLink = document.createElement(`a`);
        creditLink.href = cover.url;
        creditLink.className = `img-link`;
        creditLink.textContent = cover.credit;
        credit.appendChild(creditLink);
        bottom.appendChild(credit);

        let review = document.createElement(`p`);
        review.textContent = albumData.review.content;
        bottom.appendChild(review);

        let source = document.createElement(`p`);
        let dash = document.createElement(`span`);
        dash.textContent = `—`;
        source.appendChild(dash);

        let sourceLink = document.createElement(`a`);
        let reviewData = albumData.review;
        sourceLink.href = reviewData.url;
        sourceLink.className = `review-link`;
        sourceLink.textContent = reviewData.source;
        source.appendChild(sourceLink);
        bottom.appendChild(source);
        albumDiv.appendChild(bottom);

        i++;
    }
};

let pos = 0;
let slides = document.querySelector(`.carousel-slides`);
let [leftButton, rightButton] = document.querySelectorAll(`.carousel-navigation a`);

let maxOffset = -2040; // -680 * 3 because carosuel has 4 slides, first slide is at index 0

let visibility = () => {
    if (pos === 0) {
        rightButton.style.visibility = `hidden`;
        leftButton.style.visibility = `visible`;
    } else if (pos === maxOffset) {
        leftButton.style.visibility = `hidden`;
        rightButton.style.visibility = `visible`;
    } else {
        rightButton.style.visibility = `visible`;
        leftButton.style.visibility = `visible`;
    }
};

visibility();

let moveLeft = () => {
    if (pos > maxOffset) {
        pos = pos - 680;
        slides.style.marginLeft = pos + `px`;
        visibility();
    }
};

let moveRight = () => {
    if (pos < 0) {
        pos = pos + 680;
        slides.style.marginLeft = pos + `px`;
        visibility();
    }
};

leftButton.addEventListener(`click`, moveLeft);
rightButton.addEventListener(`click`, moveRight);

document.addEventListener(`keydown`, (event) =>  {
    if (event.key === `ArrowLeft`) {
        moveLeft();
    }
    if (event.key === `ArrowRight`) {
        moveRight();
    }
});

















