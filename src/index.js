import './styles.css';
import LoadMoreBtn from './js/load-more-btn';
import PicturesApiServise from './js/apiService'
import pictureCardTpl from './templates/picture-card.hbs'

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
}

const loadMoreBtn = new LoadMoreBtn({selector: '[data-action="load-more"]', hidden: true})

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

const picturesApiService = new PicturesApiServise();

function onSearch(e) {
    e.preventDefault();
    clearPictureGallery()
    picturesApiService.query = e.currentTarget.elements.query.value.trim()

    if (picturesApiService.query === '') {
        return
    }

    picturesApiService.resetPage()
    loadMoreBtn.show()
    fetchPictures()
}

function onLoadMore() {

    fetchPictures()
    scroll()
    console.log(refs.gallery.clientHeight) 

}

function appendPicturesMarkup(pictures) {
    refs.gallery.insertAdjacentHTML('beforeend', pictureCardTpl(pictures))
}

function clearPictureGallery() {
     refs.gallery.innerHTML = ''
}

function fetchPictures() {
    loadMoreBtn.disable()
    picturesApiService.fetchPictures().then(pictures => {
        appendPicturesMarkup(pictures);
        loadMoreBtn.enable()
    });
}

function scroll() {
    let i = refs.gallery.clientHeight;
    setTimeout(() => {
window.scrollTo({ top: i, behavior: 'smooth' });
    }, 500)
    
}