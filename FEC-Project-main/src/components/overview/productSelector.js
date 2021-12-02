import React, { useState, useEffect } from 'react';
import { useProduct } from "../../contexts/ProductContext.js";
import axios from 'axios';

export default function productSelector() {
  const [currentProduct, setCurrentProduct] = useState(1);
  const { setProduct, setStyles, styleReducer} = useProduct();
  const [state, setState] = styleReducer;
  function changeProduct(e) {
    if (currentProduct === 1) {
      setCurrentProduct(4)
    } else if (currentProduct === 8) {
      setCurrentProduct(12)
    } else if (currentProduct === 22) {
      setCurrentProduct(1);
    } else {
      setCurrentProduct(currentProduct + 1)
    }
  }

  useEffect(() => {
    axios
      .get(`http://localhost:4000/products/${currentProduct}`)
      .then((response) => {
        setProduct(response.data[0])
        axios
          .get(`http://localhost:4000/products/${currentProduct}/styles`)
          .then((response) => {
            setStyles(response.data);
            setState({ styleId: response.data[0].style_id });
          })
          .catch((err) => {
            console.error(err);
          })
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentProduct]);

  return (
    <div>
      <h3>Change Product!</h3>
      <div>
        <button value='right' onClick={changeProduct}>➡️</button>
      </div>
    </div>
  )
}