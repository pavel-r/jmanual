var MongoClient = require('mongodb').MongoClient; var ObjectID = require('mongodb').ObjectID; var url = 'mongodb://heroku_app23023408:g45snehu57kfpam45uc3icn0a8@ds045907.mongolab.com:45907/heroku_app23023408'; var mydb = null; 
MongoClient.connect(url, function(err, db){
	var p_db = db;
	p_db.collection('tips').find({lesson_id : ObjectID("535a5ad8ac22ef0b00612f97")}).toArray(function(err, tips){
			console.log('Tips found: ' + JSON.stringify(tips));
			for(i = 0; i < tips.length; i++){
				var tip = tips[i];
				p_db.collection('tips').update({_id : tip._id}, {$set : {idx : i}}, function(err, result){
					console.log("Tip updated " + result);
				});
			}
	});
}); 

//mydb.collection('users').findOne({_id : ObjectID('5331b155e4b03d6e48712e7f')}, function(err, item){console.log(item)});
//mydb.collection('users').update({_id : ObjectID('5331b155e4b03d6e48712e7f')}, {$set: {jsondata:"[]"}}, function(err, result){console.log(result)});

//mydb.collection('lessons').insert({name: 'Lesson 1', user_id : ObjectID('5331b155e4b03d6e48712e7f')}, function(err, result){});
//mydb.collection('lessons').find().toArray(function(err, lessons){console.log(lessons);});

//mydb.collectionNames(function(err, collections){console.log(collections);});
