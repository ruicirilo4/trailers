import request from 'request';
import cheerio from 'cheerio';
import http from 'http';

// URL da página com os trailers
const url = 'https://filmspot.pt/trailers/';

// Realizar uma solicitação HTTP para obter o conteúdo da página
request(url, (error, response, html) => {
  if (!error && response.statusCode === 200) {
    // Carregar o HTML da página usando Cheerio
    const $ = cheerio.load(html);

    // Array para armazenar informações dos filmes
    const filmes = [];

    // Encontrar os cinco primeiros elementos de link que contêm informações sobre os trailers
    $('a[href^="/trailer/"]').slice(0, 5).each((index, element) => {
      const $element = $(element);
      const titulo_filme = $element.text().trim();
      const url_capa = $element.find('img').attr('src');

      // Adicionar informações do filme ao array
      filmes.push({
        titulo: titulo_filme,
        capa: url_capa,
      });
    });

    // Gerar o HTML com base nos dados dos filmes
    const htmlFilmes = filmes.map((filme, index) => `
      <div class="filme">
        <img src="${filme.capa}" alt="${filme.titulo}">
        <h2>${filme.titulo}</h2>
        <a href="https://www.youtube.com/results?search_query=${filme.titulo}+trailer" target="_blank">Assistir ao Trailer ${index + 1}</a>
      </div>
    `).join('');

    // Criar o conteúdo HTML completo
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          h1 {
            text-align: center;
          }
          
          .filme {
            background-color: #fff;
            border-radius: 10px;
            margin-bottom: 20px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          
          h2 {
            text-align: center;
          }
          
          img {
            display: block;
            margin: 0 auto;
            max-width: 100%;
            height: auto;
          }
          
          a {
            display: block;
            text-align: center;
            font-weight: bold;
            color: #0070c9;
            text-decoration: none;
            margin-top: 10px;
          }
          </style>
          <title>Trailers de Filmes</title>
      </head>
      <body>
          <div class="container">
            <h1>Trailers de Filmes</h1>
            ${htmlFilmes}
          </div>
      </body>
      </html>
    `;

    // Iniciar o servidor web para exibir a página HTML
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } else {
    console.error('Falha ao acessar a página.');
  }
});
