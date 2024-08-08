import React, { useState,useEffect } from "react";
import axios from "axios";
import "./index.css"
const ProductForm = () => {
  const [Submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    image: null,
    // imageUrl: "",
  });
  // console.log(formData);
  useEffect(() => {
    const lastId = localStorage.getItem("lastId");
    if (lastId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id: parseInt(lastId) + 1,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id: 1,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", formData.image);
    data.append("upload_preset", "akshatsharma");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/akshatsharma/image/upload",
        data
      );
      console.log("Cloudinary response:", response.data);

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const imageUrl = await handleImageUpload();

    if (!imageUrl) {
      console.error("Image upload failed. Aborting form submission.");
      return;
    }

    
    const productData = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image: imageUrl,
    };

    try {
      const response = await fetch("https://api-backend-t7ew.onrender.com/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();
      console.log("Form submitted:", result);
      setSubmitted(true); 
      localStorage.setItem("lastId", formData.id);
      setFormData({
        id: formData.id + 1, // Increment the ID for the next product
        name: "",
        description: "",
        price: "",
        image: null,
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };
  if (Submitted) {
     <p>Form submitted successfully!</p>;
  }
  

  return (
    <div className="image">
      <img src="https://cdna.artstation.com/p/assets/images/images/052/882/258/large/druthik-druthik-boat-1.jpg?1660894729" alt="" />
    <div className="Akshat">
      <h1>Add product to my cart</h1>
    <form onSubmit={handleSubmit} className="Cart">
      <div className="name">
        <label htmlFor="name"  >Product name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="">
        <label htmlFor="description">Description about the product:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="price">Price of product:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="image">Image of the product:</label>
        <input type="file" id="image" name="image" onChange={handleChange} />
      </div>
      <div className="submit">
      <button type="submit">Add Product</button>
      </div>
    </form>
    </div>
    </div>
  );
};

export default ProductForm;
