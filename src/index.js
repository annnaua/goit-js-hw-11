import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './style.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchPhotoApi } from './js/fetchPhotoApi';
import { renderPhotoMarkup } from './js/renderPhotoMarkup';

// Referenses ------------------------------

const { searchForm, loadMoreBtn, gallery } = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.button-load'),

  gallery: document.querySelector('.gallery'),
};

const lightbox = new SimpleLightbox('.gallery a');

let currentPage = 1;
let searchQuery = '';

async function fetchPhoto() {
  try {
    const response = await fetchPhotoApi(searchQuery, currentPage);
    onResponseData(response);
  } catch (error) {
    console.log(error.message);
  }
}

async function onSearchFormSubmit(e) {
  e.preventDefault();

  searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (searchQuery === '') {
    return;
  }

  currentPage = 1;

  clearPhotoMarkup();
  fetchPhoto();
  clearSearchForm();
}

async function onLoadMore() {
  currentPage += 1;
  fetchPhoto();
}

function onResponseData({ hits, totalHits }) {
  if (totalHits === 0) {
    clearPhotoMarkup();
    notifyNotFound(searchQuery);
    loadMoreBtn.classList.add('is-hidden');

    return;
  }
  if (totalHits > 0 && currentPage === 1) {
    notifyPhotoFound(totalHits);
  }
  if (hits.length > totalHits) {
    notifyEndOfResults();
    return;
  }

  appendPhotoMarkup(hits);

  lightbox.refresh();
  loadMoreBtn.classList.remove('is-hidden');

  onSmoothScroll();
}

// Event Listeners ------------------------------

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

// AppendPhotoMarkup Function ------------------------------

function appendPhotoMarkup(photos) {
  const photoMarkup = photos.map(photo => renderPhotoMarkup(photo)).join('');

  gallery.insertAdjacentHTML('beforeend', photoMarkup);
}

// Clear Function ------------------------------

function clearPhotoMarkup() {
  gallery.innerHTML = '';
}

function clearSearchForm() {
  searchForm.reset();
}

// Notify Functions ------------------------------

function notifyPhotoFound(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function notifyNotFound(searchQuery) {
  Notify.failure(
    `Sorry, there are no images matching your search: ${searchQuery}. Please try again.`
  );
}

function notifyEndOfResults() {
  Notify.failure(`We're sorry, but you've reached the end of search results.`);
}

// Smooth Scroll Function ------------------------------

function onSmoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
