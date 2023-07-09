'use client';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {

  const [prodForm, setProdForm] = useState({});
  const [fetchProd, setFetchProds] = useState([]);
  const [alert, setAlert] = useState("");
  const [dropdown, setDropDown] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  useEffect(() => {
    const fetchProds = async () => {
      axios({
        method: 'GET',
        url: 'http://localhost:3000/api/product',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        // console.log( response);

        setFetchProds(response.data.products);
      }).catch((err) => {
        console.log(err);
      })
    }
    fetchProds();

  }, [prodForm])

  const addProduct = async (e) => {
    console.log("add me " + prodForm);
    e.preventDefault();

    axios({
      method: "POST",
      url: 'http://localhost:3000/api/product',
      data: prodForm,
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      console.log(response.data);
      setAlert('Your product has been added!')
      setProdForm({});
    }).catch((err) => {
      console.log(err);
    })
    setTimeout(()=>{
        setAlert("");
    }, 3000)
  }
  const handleChange = (e) => {
    setProdForm({ ...prodForm, [e.target.name]: e.target.value })
  }

  const editDropDown = async(e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 3) {
      setLoading(true);
      await axios({
        method: 'GET',
        url: `http://localhost:3000/api/search?query=${query}`,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => {
        setDropDown(response.data.products);
      }).then((err) => {
        console.log(err);
      })
      setLoading(false)
    }else{
      setDropDown([]);
    }
  }
  const buttonAction = async (action, slug, initialQty) => {
    // for immediately shows the change in products and drop down 
    // for products 
    let index = fetchProd.findIndex((item)=> item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(fetchProd));

    if(action == 'plus'){
      newProducts[index].quantity = parseInt(initialQty) + 1;
    }else if (action == 'minus' && parseInt(initialQty) > 0){
      newProducts[index].quantity = parseInt(initialQty) - 1;

    }
    setFetchProds(newProducts);

    // for dropdown

    let indexDrop = dropdown.findIndex((item) => item.slug === slug);
    let newDropDown = JSON.parse(JSON.stringify(dropdown));
    if(action == 'plus'){
      newDropDown[indexDrop].quantity = parseInt(initialQty) + 1;
    }else if (action == 'minus' && parseInt(initialQty) > 0){
      newDropDown[indexDrop].quantity = parseInt(initialQty) - 1;
    }
    setDropDown(newDropDown);


    setLoadingAction(true);
    await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/action',
      data:{action: action, slug: slug, initialQty: initialQty},
      headers:{
        'Content-Type' :'application/json'
      }
    }).then((response) => {
        console.log(response.data.products);
    }).then((err) => {
      console.log(err);
    })
    setLoadingAction(false);
  }
  return (
    <>
      <Header />
      <div className='container  mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Search a Product</h1>
        <div className='flex items-center mb-2'>
          <input
            // onBlur={()=> setDropDown([])}
            onChange={editDropDown}
            type='text'
            placeholder='Enter a Product Name'
            className='border px-2 py-1 flex-1'
          />
          <select className='border px-2 py-1 ml-2'>
            <option value=''>All</option>
            <option value='electronics'>Electronics</option>
            <option value='clothing'>Clothing</option>
            <option value='books'>Books</option>
          </select>
        </div>
        {loading && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100px" height="100px">
          <circle cx="50" cy="50" r="45" stroke="#000" strokeWidth="4" fill="none">
            <animate attributeName="stroke-dasharray" attributeType="XML" from="0,150" to="150,150" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" attributeType="XML" from="-35" to="-135" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </svg>
        }
        {
          dropdown.map(item => {
            return <div key={item._id} className='container flex justify-between bg-purple-100  h-30' >
              <span>{item.slug} (available for ${item.price})</span>
              <div className='mx-5 my-2'>
              <button onClick={()=>{buttonAction("minus", item.slug, item.quantity)}} disabled={loadingAction} className='subtract inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200'> - </button>
              <span className='quantity w-3 mx-3'>{item.quantity}</span>
              <button onClick={()=>{buttonAction("plus", item.slug, item.quantity)}} disabled={loadingAction} className='add inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md cursor-pointer disabled:bg-purple-200'> + </button>
              </div>
            </div>
          })
        }

      </div>


      <div className='container  mx-auto'>
        <div className='text-green-800 text-center'>{alert}</div>
        <h1 className='text-2xl font-bold mb-4'>Add a Product</h1>
        <form onSubmit={addProduct} className='mb-4'>
          <div className='flex items-center mb-2'>
            <label htmlFor='productName' className='w-40 mr-2'>
              Product Slug:
            </label>
            <input

              type='text'
              id='productName'
              name='slug'
              className='border px-2 py-1 flex-1'
              required
              onChange={handleChange}
              value={prodForm?.slug || ""}
            />
          </div>
          <div className='flex items-center mb-2'>
            <label htmlFor='price' className='w-40 mr-2'>
              Price:
            </label>
            <input
              type='number'
              id='price'
              name='price'
              value={prodForm?.price || ""}
              className='border px-2 py-1 flex-1'
              required
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center mb-2'>
            <label htmlFor='quantity' className='w-40 mr-2'>
              Quantity:
            </label>
            <input
              type='number'
              id='quantity'
              name='quantity'
              value={prodForm?.quantity || ""}
              className='border px-2 py-1 flex-1'
              required
              onChange={handleChange}
            />
          </div>

          <button onClick={addProduct} type='submit' className='h-30 w-40 bg-purple-500 text-white px-4 py-2'>
            Add Stock
          </button>
        </form>
      </div>



      <div className='container  mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Display Current Products</h1>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='py-2 px-4 border'>Product Name</th>
              <th className='py-2 px-4 border'>Price</th>
              <th className='py-2 px-4 border'>Quantity</th>
            </tr>
          </thead>
          <tbody>

            {
              fetchProd.length > 0 ? (
                fetchProd.map(product => {
                  return <tr key={product._id}>
                    <td className='py-2 px-4 border'>{product.slug}</td>
                    <td className='py-2 px-4 border'>Rs. {product.price}</td>
                    <td className='py-2 px-4 border'>{product.quantity <= 0 ? 'Out of Stock' : product.quantity} </td>
                  </tr>
                })
              ) : (
                <tr>
                  <td colSpan={3} className='py-2 px-4 border'>
                    No products found.
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  );
}
