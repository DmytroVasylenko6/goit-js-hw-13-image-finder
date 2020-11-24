import './styles.css';
import LoadMoreBtn from './js/load-more-btn';
import PicturesApiServise from './js/apiService'
import pictureCardTpl from './templates/picture-card.hbs'
const { error, alert } = require('@pnotify/core')
import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css';
import 'basiclightbox/dist/basicLightbox.min.css'
import * as basicLightbox from 'basiclightbox'



const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    galleryItem: document.querySelector('.photo-card')
}

const loadMoreBtn = new LoadMoreBtn({selector: '[data-action="load-more"]', hidden: true})

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
refs.gallery.addEventListener('click', onImageClick)

function onImageClick(event) {
  if (event.target.nodeName !== "IMG") {
    return;
  }
    const originalPicture = event.target.dataset.source
    const instance = basicLightbox.create(`<img src="${originalPicture}" width="800" height="600">`)

  instance.show()
}

const picturesApiService = new PicturesApiServise();

function onSearch(e) {
    e.preventDefault();
    clearPictureGallery()
    picturesApiService.query = e.currentTarget.elements.query.value.trim()

    if (picturesApiService.query === '') {
        loadMoreBtn.hide() 
        return alert({
              text: "Введите что-нибуть!",
              type: 'info'
        })
       
    }

    picturesApiService.resetPage()
    fetchPictures()
    loadMoreBtn.show()
}

function onLoadMore() {
     
    const startTime = performance.now()
    fetchPictures()
    const endTime = performance.now()
    const time = Math.floor(endTime - startTime) * 1000
    scroll(time)
  
}  

 function appendPicturesMarkup(pictures) {
    refs.gallery.insertAdjacentHTML('beforeend', pictureCardTpl(pictures))
}

function clearPictureGallery() {
     refs.gallery.innerHTML = ''
}

  async function fetchPictures() {
     loadMoreBtn.disable();

      try {
         const pictures = await picturesApiService.fetchPictures();
         appendPicturesMarkup(pictures);
         loadMoreBtn.enable();
         
      } catch (er) {
          errors(er)
          loadMoreBtn.hide() 
     }
      
    //   
    //   picturesApiService.fetchPictures().then(pictures => {
    //      appendPicturesMarkup(pictures);
    // loadMoreBtn.enable()
    //  })
    
}

function scroll(time) {
    let i = refs.gallery.clientHeight;
    setTimeout(() => {
        window.scrollTo({ top: i, behavior: 'smooth' });
    }, time)
}

function errors(er) {
    if (er === 'Ничего не найдено') {
      return  alert({
            text: 'К сожалению по этому запросу ничего не найдено',
            type: 'info'
        })
    }

    return error({
             text: "Ошибка! Не удалось загрузить изображения.",
             type: 'info' 
          })
}