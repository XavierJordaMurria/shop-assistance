URI="mongodb://localhost:27018/shop-assistance"
mongoimport --legacy --uri ${URI} --drop -c cart /mongo-seed/cart.json
mongoimport --legacy --uri ${URI} --drop -c usert /mongo-seed/usert.json
mongoimport --legacy --uri ${URI} --drop -c products /mongo-seed/products.json