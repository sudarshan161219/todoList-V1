const express = require('express')
const bodyParser = require('body-parser')
var _ = require('lodash');

// const  date = require(__dirname+ "/date.js")
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sudarshan:sudarshan161219@cluster0.aojav1a.mongodb.net/todolistDB', {useNewUrlParser: true});


const itemSchema = new mongoose.Schema({
name: String
})


const Item = mongoose.model('items', itemSchema)

const item1 = new Item ({
  name: "Apple"
});

const item2 = new Item ({
  name: "kiwi"
});

const item3 = new Item ({
  name: "banana"
});

const defaultItems = [item1, item2, item3]


const listSchema = {
  name: String,
  items: [itemSchema]
}

const List = mongoose.model('List', listSchema)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))



app.get('/', (req, res) => {
  Item.find({}, (err, foundItems) =>{

if(foundItems.length === 0){
  Item.insertMany(defaultItems, (err) =>{
    if(err){
      console.log('error')
    }else{
      console.log('saved')
    }
  });
}else{
  res.render('list',{listTitle:"todoList", newListItems: foundItems })
  return
}
  })
});


app.get( '/:paraName', (req, res) => {
  const requestedTitle = _.lowerCase(req.params.paraName); 

  List.findOne({name: requestedTitle}, (err, foundList) =>{
if(!err){
  if(!foundList){
    const list = new List({
      name: requestedTitle,
      items:defaultItems
    })
    
    list.save()
    res.redirect(`/${requestedTitle}`)

  }else{
  res.render('list',{listTitle:requestedTitle, newListItems: foundList.items })
    
  }
}
  })





  
   });


app.post("/", (req, res) => {
const itemName = req.body.newItem
const listName = req.body.list
const item = new Item({
  name: itemName
})


if(listName === 'todoList'){
 item.save()
res.redirect("/")
} else{
  List.findOne({name: listName}, (err, foundList) =>{
    foundList.items.push(item)
    foundList.save()
    res.redirect(`/${listName}`)

  });
}

 });


 app.post("/delete", (req, res) =>{
 const checkedItemId =  req.body.checkbox;
 const listName = req.body.listName;

 if(listName === "todoList"){
   Item.findByIdAndRemove(checkedItemId, (err) =>{
  if(err){ console.log(err)}else{console.log('item removed')}
 });
 res.redirect("/")
 }else{
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) =>{
    if(!err){
      res.redirect(`/${listName}`)
    }
  })
 }


 });





//  app.get("/work", (req, res) =>{

// let time = date()

//    res.render('list', 
//    {
//    listTitle:"Work List", 
//    timee: time,
//    newListItems: Workitems,
//    }
//    ) 
//  })

// app.post("/work", (req, res) => {
//   let item = req.body.newItem
//   Workitems.push(item)
//   res.redirect("/work")
// })

app.listen(3000, () => {
console.log('server started on port 3000')
});
