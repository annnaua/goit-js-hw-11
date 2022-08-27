import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29524508-8de40043aa8773c648ea40631';

const PER_PAGE = 40;

const queryParameters =
  'image_type=photo&orientation=horizontal&safesearch=true';

export async function fetchPhotoApi(searchQuery, currentPage) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&page=${currentPage}&per_page=${PER_PAGE}&${queryParameters}`
    );

    return response.data;
  } catch (error) {
    console.log(error.message);
  }
}
