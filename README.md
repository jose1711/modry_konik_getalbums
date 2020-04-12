# modry_konik_getalbums
Scraper of user albums at ModryKonik.sk

Get photos and captions in user albums at https://www.modrykonik.sk/ site. Valid user credentials are required. Downloaded files have the following structure:

```
|- album1
|-    album1/photo1.jpg
|-    album1/photo1.jpg.txt
|-    album1/photo2.jpg
|-    album1/photo3.jpg
|- album2
..
```

### Stiahnutie
```
git clone https://github.com/jose1711/modry_konik_getalbums.git
```

### Instalacia zavislosti (Ubuntu 16.04)
```
cd modry_konik_getalbums
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libatk1.0 libatk-bridge2.0.0 libpangocairo-1.0-0 libgtk-3-common
npm install puppeteer
```

### Konfiguracia
```
vim mk_getalbums.js
# uprav premenne user, login a password (pripadne pagenum)
```

### Spustenie
```
node mk_getalbum.js
# podla potreby zopakovat s inym `pagenum' pre dalsie strany albumov
```
