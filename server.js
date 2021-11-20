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
  port: process.env.DB_PORT
});

client.connect(()=>{
	console.log('Database conected');
});

app.post('/keyword',(req,res)=>{
	var search = req.body.search.trim().toLowerCase();
	var pageNum = parseInt(req.body.pageNum) || 1;
	var limit = `limit 30 offset ${30*(pageNum-1)}`;
	
	var q = search.split(" ").reduce((acc,val)=>{
		return acc+` or keyword like '%${val}%'`;
	},'').replace(' or','');;

	q=`select 1 as exact,keyword,country from keyword where keyword like '%${search}%' union select 0 as exact,keyword,country from keyword where keyword not like '%${search}%' and (${q}) order by exact desc ${limit}`;
	// console.log(q);
	client.query(q,(err,results)=>{
		res.json({ pageNum, data: results.rows });
	});
});

app.listen(process.env.PORT || 5000,()=>{
  console.log("Server hosted at port : 5000");
});