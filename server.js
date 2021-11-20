const express = require('express');
const { Pool, Client } = require('pg');
app=express();
app.use(express.json());
require('dotenv').config()

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader('Access-Control-Allow-Headers', 'content-type,Authorization');
	next();
});

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
	ssl: {
    rejectUnauthorized: false
  }
});

// const client = new Client({
//   user: "hkhpdsqnzogfvt",
//   host: "ec2-52-208-185-143.eu-west-1.compute.amazonaws.com",
//   database: "dd14r915oum6b7",
//   password: "fa1b1e6ce7c619881d03c3fc20db6e4eedb2f392455eb1e279b9f793f5da0fb7",
//   port: 5432,
// 	ssl: {
//     rejectUnauthorized: false
//   }
// });

client.connect((...a)=>{
	console.log(a)
	console.log('Database conected');
});

app.get('/keyword',(req,res)=>{
	var search = req.query.search.trim().toLowerCase();
	var pageNum = parseInt(req?.query?.page) || 1;
	var limit = req.query.page?`limit 30 offset ${30*(pageNum-1)}`:"";
	
	var q = search.split(" ").reduce((acc,val)=>{
		return acc+` or keyword like '%${val}%'`;
	},'').replace(' or','');;

	q=`select TRUE as exact,keyword,country from keyword where keyword like '%${search}%' union select FALSE as exact,keyword,country from keyword where keyword not like '%${search}%' and (${q}) order by exact desc ${limit}`;
	 console.log(q);
	client.query(q,(err,results)=>{
		res.json({ pageNum, data: results.rows });
	});
});

app.listen(process.env.PORT || 5000,()=>{
  console.log("Server hosted at port : 5000");
});
