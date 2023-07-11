//import { useEffect } from 'react'
import { Link } from "react-router-dom";

function Landing() {

    return (
      <>
      <h1>Esta es la landing Page</h1>    
      
        <div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
            <div className="text-900 font-bold text-6xl mb-4 text-center">Pricing Plans</div>
            <div className="text-700 text-xl mb-6 text-center line-height-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

            <div className="grid">
                <div className="col-12 lg:col-4">
                    <div className="p-3 h-full">
                        <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                            <div className="text-900 font-medium text-xl mb-2">Basic</div>
                            <div className="text-600">Plan description</div>
                            <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                            <div className="flex align-items-center">
                                <span className="font-bold text-2xl text-900">$9</span>
                                <span className="ml-2 font-medium text-600">per month</span>
                            </div>
                            <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                            <ul className="list-none p-0 m-0 flex-grow-1">
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Arcu vitae elementum</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Dui faucibus in ornare</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Morbi tincidunt augue</span>
                                </li>
                            </ul>
                            <hr className="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" />
                            <button className="p-3 w-full mt-auto">Buy Now!</button>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-4">
                    <div className="p-3 h-full">
                        <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                            <div className="text-900 font-medium text-xl mb-2">Premium</div>
                            <div className="text-600">Plan description</div>
                            <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                            <div className="flex align-items-center">
                                <span className="font-bold text-2xl text-900">$29</span>
                                <span className="ml-2 font-medium text-600">per month</span>
                            </div>
                            <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                            <ul className="list-none p-0 m-0 flex-grow-1">
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Arcu vitae elementum</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Dui faucibus in ornare</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Morbi tincidunt augue</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Duis ultricies lacus sed</span>
                                </li>
                            </ul>
                            <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                            <button className="p-3 w-full mt-auto">Buy Now!</button>
                        </div>
                    </div>
                </div>

                <div className="col-12 lg:col-4">
                    <div className="p-3 h-full">
                        <div className="shadow-2 p-3 flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                            <div className="text-900 font-medium text-xl mb-2">Enterprise</div>
                            <div className="text-600">Plan description</div>
                            <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                            <div className="flex align-items-center">
                                <span className="font-bold text-2xl text-900">$49</span>
                                <span className="ml-2 font-medium text-600">per month</span>
                            </div>
                            <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                            <ul className="list-none p-0 m-0 flex-grow-1">
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Arcu vitae elementum</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Dui faucibus in ornare</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Morbi tincidunt augue</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Duis ultricies lacus sed</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Imperdiet proin</span>
                                </li>
                                <li className="flex align-items-center mb-3">
                                    <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                    <span>Nisi scelerisque</span>
                                </li>
                            </ul>
                            <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                            <button className="p-3 w-full mt-auto">Buy Now!</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Link to='/login'><button className="box-border rounded  py-1 px-3 border-2 col-span-1
        hover:bg-white hover:text-blue-500"
        >Log In</button></Link>
      </>
    );
  }
  
  export default Landing;