const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT
app.use(express.json());
const Joi = require('joi'); 

const courses = [
    {id:1, name:'course1'},
    {id:2, name:'course2'},
    {id:3, name:'course3'}
  ];

app.get('/',(req, res) => { //'/'是指專案的根目錄路徑
    res.send('Hello World!');
});
//get()方法要傳入兩個參數，分別是路徑字串以及一個callback function
//callback function也是兩個參數，request跟response 

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//取得課程 By id
app.get('/api/courses/:id',(req, res) => {
    let course = courses.find(courses => courses.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found');
        return ;//加上return，使接下來的code不會被執行
    }
    res.send(course.name);
});


//新增課程
app.post('/api/courses', (req, res) => {
    // a schema defines the shape of our objects, 例如有沒有email, 有沒有字數限制？這裡用schema來定義新course這個object的規範
    let schema = {
        name: Joi.string().min(3).required()
    };

    let result = Joi.validate(req.body, schema);
   /* return an object that has two properties: error and value.
   Only one of them can exist.*/

   console.log(result);
   //這裡輸出result，就會知道當error時該輸出哪些錯誤訊息給用戶端↓

    if (result.error) {
        res.status(400).send(result.error.details[0].message); 
        //把error物件中適當的property輸出，提供了反映用戶API錯誤的訊息
        // status code 400 Means bad request
        return ;
    }

    let course = {
      id: courses.length + 1,  //沒有資料庫，先手動新增ID
      name: req.body.name     // 取得傳送來的name
    }

    courses.push(course); //加入課程陣列
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(courses => courses.id === parseInt(req.params.id));
        if (!course) {
        res.status(404).send('The course with the given ID was not found');
        return ;
    }

    let result = validateCourse(req.body); //參數傳入req.body，一行解決
    
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return ;
    }

    course.name = result.value.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(courses => courses.id === parseInt(req.params.id));
    if (!course) {
      res.status(404).send('The course with the given ID was not found');
    return ;
  }
  let index = courses.indexOf(course);
    /* The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.*/
    // what return is number 
   
   courses.splice(index, 1);
   // This method changes the contents of an array by removing existing elements and/or adding new elements.
   res.send(course); //傳給client端
  });

function validateCourse(course) {
  let schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(course, schema);
}

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
//偵測連線，並傳入一個callback function