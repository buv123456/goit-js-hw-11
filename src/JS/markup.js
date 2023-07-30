export function createMarkup(photos) {
  return photos
    .map(
      i => `<a href="${i.largeImageURL}" class="photo-card">
          <div class="photo-img">
             <img src="${i.previewURL}" alt="${i.tags}" loading="lazy" />
          </div>
           <div class="info">
            <p class="info-item">
              <b>Likes: ${i.likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${i.views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${i.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${i.downloads}</b>
            </p>
          </div>
            </a>`
    )
    .join('');
}
