import path from 'path';
import { Sitemap } from 'react-router-sitemap';
import router from './App';

function generateSitemap() {
  return (
    new Sitemap(router)
      .build('https://codecraftsman.se')
      .save(path.resolve(__dirname, 'public', 'sitemap.xml'))
  );
}

generateSitemap();  