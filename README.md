run this app

npm install
create file .env (can copy from .env.example) and set database configuration and port
set .env DB_MIGRATE to true for run migration
run on terminal 'npx sequelize-cli db:seed:all' for run sedder data
run development mode on terminal 'npm run dev'
you can import postman collection for check API