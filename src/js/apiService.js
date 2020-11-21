const API_KEY = '19197868-48df692c0a14d7fda4172233f'
const BASE_URL = 'https://pixabay.com'

export default class PicturesApiServise {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchPictures() {
        const url = `${BASE_URL}/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`

        return fetch(url)
        .then(response => response.json())
            .then(data => {
                this.page += 1;
                return data.hits;
        })
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }
    set query(newSearchQuery) {
        this.searchQuery = newSearchQuery
    }
}