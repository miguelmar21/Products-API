//Import from a csv file with header:
mongoimport -d mydb -c things --type csv --file location.csv --headerline

//Import from a csv file without headers. You can add fields with --fields
mongoimport -d testdb -c person -type csv --file person.csv --fields "id,type,firstname,middlename,lastname,modifieddate,e-mail"

// Merge features into products with Object_id
db.products.aggregate([{ $lookup: { from: "features", localField: "product_id", foreignField: "product_id", as: "features" } }])

//Merge features into products without Object_id
db.products.aggregate([{ $lookup: { from: "features", localField: "product_id", foreignField: "product_id", pipeline: [{ $project: { "_id": 0 } }],  as: "features" } }])

//Remove _id field from features
db.features.aggregate([ { $unset: "_id" } ])

//Steps for Getting DB up and running with data:
1: mongoimport -d overview -c products --type csv --file products.csv --headerline
2: mongoimport -d overview -c features --type csv --file features.csv --fields "features_id, product_id, fabric, canvas"
3: db.products.aggregate([{ $lookup: { from: "features", localField: "product_id", foreignField: "product_id", pipeline: [{ $project: { "_id": 0 } }],  as: "features" } }])
4: mongoimport -d overview -c related --type csv --file related.csv --fields "related_product_id,product_id,related_product_ids"
5: db.products.aggregate([{ $lookup: { from: "related", localField: "product_id", foreignField: "product_id", pipeline: [{ $project: { "_id": 0 } }],  as: "related_products" } }])
