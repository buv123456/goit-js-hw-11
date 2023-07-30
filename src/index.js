import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getPhoto } from './JS/api';
import { createMarkup } from './JS/markup';

const baseURL = 'https://pixabay.com/api/';
let lightbox = new SimpleLightbox('.gallery a');

const loadMoreBtnEl = document.querySelector('.load-more');
loadMoreBtnEl.hidden = true;
const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');

const params = {
  key: '38526354-71390ec20934c98ef5a24eda8',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

formEl.addEventListener('submit', onFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadClick);

async function onFormSubmit(evt) {
  try {
    evt.preventDefault();
    params.page = 1;
    params.q = evt.target.elements.searchQuery.value.trim();
    const { hits, totalHits } = await getPhoto(
      baseURL,
      new URLSearchParams(params)
    );
    if (!totalHits) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(
      `On your request "${params.q}" has been found ${totalHits} photos`
    );
    galleryEl.innerHTML = createMarkup(hits);
    lightbox.refresh();
    loadMoreBtnEl.hidden = totalHits < params.per_page;
  } catch (err) {
    Notiflix.Notify.failure(err);
  }
}

async function onLoadClick() {
  try {
    params.page += 1;
    const { hits, totalHits } = await getPhoto(
      baseURL,
      new URLSearchParams(params)
    );
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(hits));
    lightbox.refresh();
    loadMoreBtnEl.hidden = totalHits < params.page * params.per_page;
    if (!loadMoreBtnEl.hidden) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    Notiflix.Notify.failure(err);
  }
}
