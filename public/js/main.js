window.addEventListener('load', () => {
    let modal = document.getElementById('modal');
    let imageGrid = document.getElementById('image-grid');
    let modalClose = document.getElementById('modal-close');
    let fetchButton = document.getElementById('fetch-button');
    //@TODO UGLYNESS!!!
    let fetchLoader;
    setTimeout(() => {
        fetchLoader = document.getElementById('fetch-loader');
    }, 100);

    /**
     * Click handler for every image in the grid to popup modal view
     */
    if (imageGrid !== null) {
        imageGrid.addEventListener('click', (e) => {
            let target = e.target;
            if (target.classList.contains('instagram-image') === false) {
                return;
            }

            let id = target.dataset.id;
            fetch('/instagram/api/photo/' + id).then(function (response) {
                return response.json();
            }).then(function (photo) {
                document.querySelector('.card-image img').src = photo.images.standard_resolution.url;
                document.querySelector('.card-image img').alt = photo.caption.text;
                document.querySelector('.media-left img').src = photo.user.profile_picture;
                document.querySelector('.media-left img').alt = photo.user.username;
                document.querySelector('.media-content .title').innerHTML = "Photo from @" + photo.user.username;
                document.querySelector('.media-content .subtitle').innerHTML = "Taken at " + photo.location.name;
                document.querySelector('.content').innerHTML = photo.caption.text;
                modal.classList.add('is-active');
            });
        });
    }

    /**
     * Click handler to hide modal view
     */
    if (modalClose !== null) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('is-active');
        });
    }

    /**
     * Click handler to fetch new instagram data
     */
    if (fetchButton !== null) {
        fetchButton.addEventListener('click', () => {
            fetchLoader.classList.remove('is-hidden');
            fetch('/instagram/api/fetchdata').then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log(data);
                fetchLoader.classList.add('is-hidden');
            });
        });
    }
});
