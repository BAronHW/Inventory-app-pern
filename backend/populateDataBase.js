const categories = [
    { name: "Electronics", description: "Electronic devices and accessories." },
    { name: "Clothing", description: "Men's and women's clothing." },
    { name: "Books", description: "Educational books and novels." }
  ];
  
  const items = [
    {
      name: "Laptop",
      price: 1200.00,
      description: "15-inch laptop with 16GB RAM",
      stock: 30,
      categoryName: "Electronics"  // Matching the category from the categories array
    },
    {
      name: "T-shirt",
      price: 20.00,
      description: "Cotton men's t-shirt",
      stock: 150,
      categoryName: "Clothing"  // Matching the category from the categories array
    },
    {
      name: "Fantasy Novel",
      price: 15.00,
      description: "Fantasy novel by a bestselling author",
      stock: 85,
      categoryName: "Books"  // Matching the category from the categories array
    }
  ];
  

const mongoose = require('mongoose');
const Category = require('./models/category'); // Adjust path as necessary
const Item = require('./models/item'); // Adjust path as necessary

mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

async function populateData() {
  try {
    // Clear the collections
    await Category.deleteMany({});
    await Item.deleteMany({});

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories inserted:', insertedCategories);

    // Map items to categories
    const updatedItems = items.map((item, index) => ({
      ...item,
      category: insertedCategories[index % insertedCategories.length]._id // Cycle through categories
    }));

    // Insert items
    const insertedItems = await Item.insertMany(updatedItems);
    console.log('Items inserted:', insertedItems);

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error populating database:', error);
    mongoose.connection.close();
  }
}

populateData();
