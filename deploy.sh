git pull
npm install
npx tsc
pm2 rm studio61000
pm2 start dist/index.js --name studio61000