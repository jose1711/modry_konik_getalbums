/*
Stiahni albumy z modreho konika

pred spustenim uprav
 user, login, password a pagenum

spustenie:
 node mk_getalbum.js
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const user = 'FIXME';
const login = 'FIXME';
const password = 'FIXME';

const pagenum = 1;

try {
  (async () => {
    console.log('Spustam prehliadac..');
    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://www.modrykonik.sk/login', { waitUntil: 'networkidle2' });
    console.log('Prihlasujem sa..');
    await page.type('#username', login);
    await page.type('#password', password);
    await page.click('button');
    await page.waitForSelector(".topmenu-userIcon");
    console.log('Klik na albumy..');
    await page.goto('https://www.modrykonik.sk/blog/' + user + '/?page=' + pagenum + '&post_type=1', { waitUntil: 'networkidle2' });
    console.log('Cakam 2 sekundy..');
    await page.waitFor(2000);
    console.log('Zistujem URL albumov..');
    var albums = await page.$$(".post-album-name > a");
    const albumPage = await browser.newPage();
    const photoPage = await browser.newPage();
    const imagePage = await browser.newPage();
    imagePage.setRequestInterception(true);
    imagePage.on('request', request => {
        const url = request.url();
        if (url.split('/').pop() == "favicon.ico") {
            console.log('ignorujem favicon.ico');
            request.abort()
            } else {
                request.continue() }
         });

    for (album of albums) {
      var albumUrl = await album.evaluate(node => node.href);
      console.log(albumUrl);
      var albumComponents = albumUrl.split('/').length;
      var albumName = albumUrl.split('/')[albumComponents-2];
      if (!fs.existsSync(albumName)) {
        fs.mkdirSync(albumName);
        }
      console.log('albumName: ' + albumName);
      await albumPage.goto(albumUrl, { waitUntil: 'networkidle2' });
      var photoThumbs = await albumPage.$$(".hj_e > a");
      for (photoThumb of photoThumbs) {
        var photoThumbUrl = await photoThumb.evaluate(node => node.href);
        await photoPage.goto(photoThumbUrl);
        console.log('Url nahladu: ' + photoThumbUrl);
        await photoPage.waitFor('.xv_b.xv_nx');
        var photoUrl = await photoPage.$('.xv_b.xv_nx');
        var photoUrl = await photoUrl.evaluate(node => node.src);
        var comment = await photoPage.$('.tn_a.xv_g');
        var comment = await comment.evaluate(node => node.innerText);
        console.log('Url fotky: ' + photoUrl);
        console.log('Komentar: ' + comment);
        imagePage.once('response', await function (response) {
           const url = response.url();
	   var albumName = this.albumName;
           response.buffer().then(file => {
             console.log('Ukladam ' + url + ' do albumu ' + albumName + '...');
             const fileName = url.split('/').pop();
             const filePath = path.resolve(__dirname + '/' + albumName, fileName);
             const writeStream = fs.createWriteStream(filePath);
             writeStream.write(file);
             writeStream.close();
  
             if (comment != "Klikni sem a zadaj popis") {
               const fileNameTxt = fileName + '.txt';
               const filePathTxt = path.resolve(__dirname + '/' + albumName, fileNameTxt);
               const writeStreamTxt = fs.createWriteStream(filePathTxt);
               writeStreamTxt.write(comment);
               writeStreamTxt.close();
               }
             });
           }.bind({albumName: albumName}));
        await imagePage.goto(photoUrl);
        };
    };
    await browser.close()
    })()
  } catch (err) {
 console.error(err)
 }
