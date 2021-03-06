var express = require('express');
var router = express.Router();
const url = require('url');

module.exports = function(pool) {

router.get('/', function(req, res, next) {
  const { id, string, integer, float, start_date, end_date, boolean, checked_id, checked_string, checked_integer, checked_float, checked_date, checked_boolean } = req.query;
  
  const per_page = 3;
  const page = req.params.page || 1;
  const queryObject = url.parse(req.url,true).search;

  var fullUrl = req.search;
  // console.log(fullUrl);

  let field = [];
  if (checked_id === "true" && id) {
    field.push(`id = ${id}`);
  }
  if (checked_string === "true" && string) {
    field.push(`string = '${string}'`);
  }
  if (checked_integer === "true" && integer) {
    field.push(`integer = ${integer}`);
  }
  if (checked_float === "true" && float) {
    field.push(`float = ${float}`);
  }
  if (checked_date === "true" && start_date && end_date) {
    field.push(`date between '${start_date}' and '${end_date}'`);
  }
  if (checked_boolean === "true" && boolean) {
    field.push(`boolean = '${boolean}'`);
  }

  var sql = `SELECT * FROM bread`;
  if (field.length > 0) {
    sql += ` WHERE `;
    for (let i = 0; i < field.length; i++) {
      sql += `${field[i]}`;
      if (field.length != i+1) {
        sql += ` OR `;
      }
    }
  }

  pool.query(sql, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    
    sql += ` ORDER BY id ASC LIMIT 3 OFFSET 0`;
    pool.query(sql, (err, rowsFilt) => {
      if (err) {res.status(400).json({ "error": err.message });return;}
      // res.json(rowsFilt.rows);
      res.json({
        data: rowsFilt.rows,
        current: page,
        filter: queryObject,
        next_page: parseInt(page) + 1,
        previous_page: parseInt(page) - 1,
        pages: Math.ceil(rows.rows.length / per_page)
      });
    });
  })
});

router.get('/:page', function(req, res, next) {
  const { id, string, integer, float, start_date, end_date, boolean, checked_id, checked_string, checked_integer, checked_float, checked_date, checked_boolean } = req.query;
  
  const per_page = 3;
  const page = req.params.page || 1;
  const queryObject = url.parse(req.url,true).search;

  var fullUrl = req.search;
  // console.log(fullUrl);

  let field = [];
  if (checked_id === "true" && id) {
    field.push(`id = ${id}`);
  }
  if (checked_string === "true" && string) {
    field.push(`string = '${string}'`);
  }
  if (checked_integer === "true" && integer) {
    field.push(`integer = ${integer}`);
  }
  if (checked_float === "true" && float) {
    field.push(`float = ${float}`);
  }
  if (checked_date === "true" && start_date && end_date) {
    field.push(`date between '${start_date}' and '${end_date}'`);
  }
  if (checked_boolean === "true" && boolean) {
    field.push(`boolean = '${boolean}'`);
  }

  var sql = `SELECT * FROM bread`;
  if (field.length > 0) {
    sql += ` WHERE `;
    for (let i = 0; i < field.length; i++) {
      sql += `${field[i]}`;
      if (field.length != i+1) {
        sql += ` OR `;
      }
    }
  }

  // const sql = 'SELECT * FROM bread ORDER BY id ASC';
  pool.query(sql, (err, rows) => {
    if (err) { res.status(400).json({ "error": err.message }); return; }
    
    sql += ` ORDER BY id ASC LIMIT 3 OFFSET ${(page - 1) * per_page}`;
    pool.query(sql, (err, rowsFilt) => {
      // console.log(rowsFilt.rows)
      if (err) {res.status(400).json({ "error": err.message });return;}
      // res.json(rowsFilt.rows);
      res.json({
        data: rowsFilt.rows,
        current: page,
        filter: queryObject,
        next_page: parseInt(page) + 1,
        previous_page: parseInt(page) - 1,
        pages: Math.ceil(rows.rows.length / per_page)
      });
    });
  })
});

router.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  var sql = `SELECT * FROM bread WHERE id = ${id}`;
  pool.query(sql, (err, result) => {
    if (err) {res.send({message: err.message});
    } else {
      res.json({ data: result.rows });
    }
  });
});

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  var sql = `DELETE FROM bread WHERE id = ${id}`;
  pool.query(sql, function (err) {
    if (err) {res.send({message: err.message});
    } else {
      res.send({message: "Berhasil"});
    }
  });
});

router.put('/edit/:id', (req, res) => {
  const { id } = req.body;
  var { string, date } = req.body;
  const integer = Number(req.body.integer);
  const float = Number(req.body.float);
  const boolean = req.body.boolean;

  var sql = `UPDATE bread SET string = '${string}', integer = ${integer}, float = ${float}, date = '${date}', boolean = '${boolean}' WHERE id = ${id}`;
  // console.log(sql);
  pool.query(sql, function (err) {
    if (err) {res.send({message: err.message});
    } else {
      res.send({message: "Berhasil"});
    }
  })
});

router.post('/add', (req, res) => {
  var { string, date } = req.body;
  const integer = Number(req.body.integer);
  const float = Number(req.body.float);
  const boolean = req.body.boolean;

  var sql = `INSERT INTO bread (string, integer, float, date, boolean) VALUES ('${string}', ${integer}, ${float}, '${date}', '${boolean}')`;
  pool.query(sql, function (err) {
    if (err) {res.send({message: err.message});
    } else {
      res.send({message: "Berhasil"});
    }
  })
});
return router
}