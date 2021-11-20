const { Pool, Client } = require('pg');

const client = new Client({
  user: "hkhpdsqnzogfvt",
  host: "ec2-52-208-185-143.eu-west-1.compute.amazonaws.com",
  database: "dd14r915oum6b7",
  password: "fa1b1e6ce7c619881d03c3fc20db6e4eedb2f392455eb1e279b9f793f5da0fb7",
  port: 5432
});

client.connect(()=>{
	console.log('Database conected');
});

var q = `set transaction read write; 
COPY keyword
FROM 'D:\keywords.csv'
DELIMITER ','
CSV HEADER;`

client.query(q,(err,results)=>{
	console.log(err,results);
});

