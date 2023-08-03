import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getPhoto } from './JS/api';
import { createMarkup } from './JS/markup';

let lightbox = new SimpleLightbox('.gallery a');

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const guard = document.querySelector('.js-guard');

const options = {
  rootMargin: '300px',
};
const observer = new IntersectionObserver(onLoadClick, options);

const baseURL = 'https://pixabay.com/api/';
const params = {
  key: '38526354-71390ec20934c98ef5a24eda8',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

formEl.addEventListener('submit', onFormSubmit);
formEl.addEventListener('click', onClick);

function onClick(e) {
  if (e.target.className === 'form-input') e.target.value = '';
}

async function onFormSubmit(evt) {
  try {
    evt.preventDefault();
    params.page = 1;
    params.q = evt.target.elements.searchQuery.value.trim();
    const { hits, totalHits } = await getPhoto(baseURL, params);
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

    if (totalHits > params.per_page) observer.observe(guard);
    return;
  } catch (err) {
    Notiflix.Notify.failure(err);
  }
}

async function onLoadClick(entries) {
  if (entries[0].intersectionRatio <= 0) return;
  try {
    params.page += 1;
    const { hits, totalHits } = await getPhoto(baseURL, params);
    galleryEl.insertAdjacentHTML('beforeend', createMarkup(hits));
    lightbox.refresh();
    if (totalHits <= params.page * params.per_page) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (err) {
    Notiflix.Notify.failure(err);
  }
}
