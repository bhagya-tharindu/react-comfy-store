import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    let maxprice = action.payload.map((product) => product.price);
    maxprice = Math.max(...maxprice);

    return {
      ...state,
      all_products: [...action.payload],
      filter_products: [...action.payload],
      filters: {
        ...state.filters,
        max_price: maxprice,
        price: maxprice,
      },
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  if (action.type === SORT_PRODUCTS) {
    const { sort, filter_products } = state;
    let tempproducts = [...filter_products];
    if (sort === "price-lowest") {
      tempproducts = tempproducts.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-highest") {
      tempproducts = tempproducts.sort((a, b) => b.price - a.price);
    }
    if (sort === "name-a") {
      tempproducts = tempproducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sort === "name-z") {
      tempproducts = tempproducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
    return { ...state, filter_products: tempproducts };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;

    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    let tempproducts = [...all_products];
    const { text, category, company, color, price, shipping, max_price } =
      state.filters;
    if (text) {
      tempproducts = tempproducts.filter((product) => {
        return product.name.toLowerCase().startsWith(text);
      });
    }
    if (category !== "all") {
      tempproducts = tempproducts.filter((product) => {
        return product.category === category;
      });
    }
    if (company !== "all") {
      tempproducts = tempproducts.filter((product) => {
        return product.company === company;
      });
    }
    if (color !== "all") {
      tempproducts = tempproducts.filter((product) => {
        return product.colors.find((c) => c === color);
      });
    }

    tempproducts = tempproducts.filter((product) => product.price <= price);

    if (shipping) {
      tempproducts = tempproducts.filter(
        (product) => product.shipping === true
      );
    }
    return { ...state, filter_products: tempproducts };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        company: "all",
        category: "all",
        color: "all",
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
