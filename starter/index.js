const fs = require('fs'); //build in module which allowes u to fetch data from file System
const http = require('http');
const url = require('url');
const replaceTemp = require('./modules/replaceTemp');

//////////////////////////////////
//Server
//readFilesSync runs only one time when we start a program

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/templete-overview.html`,
  'utf-8'
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/templete-card.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/templete-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//All code inside runs each time we do request
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map(ele => replaceTemp(tempCard, ele)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    //Not Found
  } else {
    res.end('NOT FOUND');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('3000 running');
}); //starting listenning for incoming request

////////////////////////////////////
//ROUTING
