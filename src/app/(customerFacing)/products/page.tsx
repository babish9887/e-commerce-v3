"use client";
import React, {  useEffect, useRef, useState } from "react";
import axios from "axios";
import Category from '../../../../Categories.json'
import SortBy from '../../../../SortBy.json'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import toast from "react-hot-toast";

async function page() {
  const [products, setProducts] = useState([]);
  const [position, setPosition] = React.useState("A-Z");
  const [categoryPosition, setCategoryPostion] = React.useState("All");

  useEffect(()=>{
      async function GetProducts(){

                  const res=await axios.get(`/api/getproducts/?order=${position}&category=${categoryPosition}`) 
                  setProducts(res.data.products)
           
      }
      GetProducts()
  },[])

const  handleValueChange=async (e:any)=>{
      console.log(e)
      const isCategory:boolean=Category.includes(e);
      if(isCategory){
            setCategoryPostion(e)
      }else 
            setPosition(e)
      try{
            if(isCategory){
                  const res=await axios.get(`/api/getproducts/?order=${position}&category=${e}`) 
                  setProducts(res.data.products)
            } else {
                  const res=await axios.get(`/api/getproducts/?order=${e}&category=${categoryPosition}`) 
                  setProducts(res.data.products)
            }

      } catch(e:any){
            toast.error("Error connecting to Database")
      }
  }
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 mt-4">
        <div className="flex justify-center items-center">
        <h1 className="text-2xl sm:text-4xl sm:5xl font-bold  ">Products</h1>
        <p className="ml-4 mr-4">Category: </p>
        <CategoryDropDown categoryPosition={categoryPosition} handleValueChange={handleValueChange}/>
        </div>
      {/* <SearchBox products={products} setProducts={setProducts}/> */}
        <div className="flex justify-center items-center gap-4">
          <p>Sort By: </p>
            <SortByDropDown position={position} handleValueChange={handleValueChange}/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Product products={products} position={position} />
      </div>
    </>
  );
}


async function Product({ products, position }: any) {
  return products.map((product: any) => (
    <ProductCard key={product.id} {...product} position={position}/>
  ));
}


function SortByDropDown({position, handleValueChange}:any){
      return(
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                  <Button variant="outline">{position}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                  {/* <DropdownMenuLabel>Panel Position</DropdownMenuLabel> */}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuRadioGroup
                  value={position}
                  onValueChange={handleValueChange}>
                  {SortBy.map((item:string)=>(
                        <DropdownMenuRadioItem key={item} value={item}>{item}</DropdownMenuRadioItem>
                  ))}

                  </DropdownMenuRadioGroup>
            </DropdownMenuContent>
    </DropdownMenu>
)}

function CategoryDropDown({categoryPosition, handleValueChange}:any){
      return(
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                  <Button variant="outline">{categoryPosition}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                  value={categoryPosition}
                  onValueChange={handleValueChange}>
                  {Category.map((category:string)=>(
                        <DropdownMenuRadioItem key={category} value={category}>{category}</DropdownMenuRadioItem>
                  ))}

                  </DropdownMenuRadioGroup>
            </DropdownMenuContent>
    </DropdownMenu>
)}



export default page;
