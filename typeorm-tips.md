# TYPEORM Tips

- atualizar o db conforme desenvolvimento
  - ormconfig.js "synchronize": true,
  
- criar do zero a migration
  - npm run typeorm migration:create -- -n createUsers
  - npx typeorm migration:create -n createUsers -d src/database/migrations
  
- criar a migration a partir da entity/model
  - npm run typeorm migration:generate -- -n createTableUsers
  - npx typeorm migration:generate -n createTableUsers -d src/database/migrations

- executar os migration
  - npm run typeorm migration:run

- select direto no CLI
  - npm run typeorm query "select * from users"
