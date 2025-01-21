import { useEffect, useState, useMemo } from "react";
import { ImageSlider } from "./ImageSlider";
import axios from "axios";
import { BlogCard } from "./BlogsCard";
import { ProductsGrid } from "./ProductsGrid";

export function Home() {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const homeCategories = useMemo(() => [
    {category: 'mobile-accessories',  title:'Mobile Accessories'},
    {category: 'home-decoration', title: 'Home Decoration'},
    {category: 'kitchen-accessories',  title: 'Kitchen'},
    {category: 'sports-accessories',  title: 'Sports'}
  ], []);

  useEffect(() => {
    const fetchProducts = async () => {
      const updatedCategories = await Promise.all(
        homeCategories.map(async (category, index) => {
          try {
            const response = await axios.get(
              `https://dummyjson.com/products/category/${category.category}?limit=4&select=title,price,thumbnail`
            ); 
            return { ...category, products: response.data.products, id: category.category };
          } catch (error) {
            console.error(`Error fetching products for ${category.category}`, error);
            return category; 
          }
        })
      );
    setCategories(updatedCategories);
     setCategoriesLoading(false);
    };

    fetchProducts();
  }, [homeCategories]);
  return (
    <div className="container-fluid p-0">
      <ImageSlider />
      <div className="container">
        <div className="home-cat-sec text-center mt-5 mb-5">
        { categoriesLoading === true ?
          homeCategories.map((category,index)=> 
            <div className="placeholder-section" key={`${category.url}-${index}`}>
            <ProductsGrid  title={category.title} prefix='Best in' products={category.products} url={category.id} loading={categoriesLoading} />
          </div>
          )
        :
          categories.map((category,index) => 
            <div className="cat-products" key={`${category.url}-${index}`}>
              <ProductsGrid  title={category.title} prefix='Best in' products={category.products} url={category.id} loading={categoriesLoading} />
            </div>
          )
        }
        </div>
        <BlogCard />
      </div>
    </div>
  );
}
