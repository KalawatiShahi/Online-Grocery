import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const InputField = ({ type, placeholder, name, value, onChange }) => (
  <input
    className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
    type={type}
    placeholder={placeholder}
    name={name}
    value={value}
    onChange={onChange}
    required
  />
);

const initialAddress = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phone: '',
};

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const [address, setAddress] = useState(initialAddress);

  useEffect(() => {
    if (!user) {
      // Redirect user if not logged in
      navigate('/cart');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error('User is not available.');
    }

    try {
      // Send only the address object, backend will get userId from token
      const { data } = await axios.post('/api/address/add', { address });

      if (data.success) {
        toast.success(data.message);
        navigate('/cart'); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-300'>
        Add Shipping <span className='font-semibold text-primary'>Address</span>
      </p>

      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex-1 max-w-md'>
          <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
            <div className='grid grid-cols-2 gap-4'>
              <InputField name='firstName' type='text' placeholder='First Name' value={address.firstName} onChange={handleChange} />
              <InputField name='lastName' type='text' placeholder='Last Name' value={address.lastName} onChange={handleChange} />
            </div>

            <InputField name='street' type='text' placeholder='Street' value={address.street} onChange={handleChange} />

            <div className='grid grid-cols-2 gap-4'>
              <InputField name='city' type='text' placeholder='City' value={address.city} onChange={handleChange} />
              <InputField name='state' type='text' placeholder='State' value={address.state} onChange={handleChange} />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputField name='zipcode' type='number' placeholder='Zip Code' value={address.zipcode} onChange={handleChange} />
              <InputField name='country' type='text' placeholder='Country' value={address.country} onChange={handleChange} />
            </div>

            <InputField name='phone' type='text' placeholder='Phone' value={address.phone} onChange={handleChange} />

            <button type='submit' className='w-full mt-6 bg-primary text-white py-3
             hover:bg-primary-dull transition cursor-pointer uppercase'>
              Save Address
            </button>
          </form>
        </div>

        <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt='Add Address' />
      </div>
    </div>
  );
};

export default AddAddress;
