git pull
npm install
npx tsc
pm2 stop studio61000
pm2 start node/index.js --name studio61000