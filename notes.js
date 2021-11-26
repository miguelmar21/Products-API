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

