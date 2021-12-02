import React, { useContext, useState, useEffect, useReducer } from "react";
import axios from "axios";

const ProductContext = React.createContext();

export function useProduct() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [product, setProduct] = useState("");
  const [styles, setStyles] = useState([]);
  const [meta, setMeta] = useState({});
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { styleId: null, currentStyle: null }
  );

  function getProduct(productId) {
    productId = productId ? productId : 1
    axios
      .get(`http://localhost:4000/products/${productId}`)
      .then((response) => {
        setProduct(response.data[0])
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getStyles() {
    var productId = product.product_id ? product.product_id : 1
    axios
      .get(`http://localhost:4000/products/${productId}/styles`)
      .then((response) => {
        setStyles(response.data);
        setState({ styleId: response.data[0].style_id });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getProduct();
    getStyles();
  }, []);

  useEffect(() => {
    var currentStyle;
    for (const style of styles) {
      if (style.style_id === (state.styleId)) {
        currentStyle = style;
      }
    }
    setState({
      currentStyle: currentStyle,
    });
  }, [state.styleId]);

  return (
    <ProductContext.Provider
      value={{
        product: product,
        setProduct: setProduct,
        setStyles: setStyles,
        styles: styles,
        styleReducer: [state, setState],
        meta: meta,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
