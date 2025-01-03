import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useFetchData } from "../hooks/useFetchData";
import ProductCard from "../components/product/ProductCard";
import CategoryFilter from "../components/product/CategoryFilter";
import ProductSorter from "../components/product/ProductSorter";
import SearchBar from "../components/product/SearchBar";

const Inventory = () => {
  const { user } = useUser();
  const products = useFetchData(`products/user/${user.id}`)[0];
  const categories = useFetchData("categories")[0];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProductsByCategory = selectedCategory
    ? products.filter(
        (product) => product.categoryId === Number(selectedCategory)
      )
    : products;

  const filteredProductsBySearch = filteredProductsByCategory.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProductsBySearch].sort((a, b) => {
    switch (sortOption) {
      case "high-to-low":
        return b.price - a.price;
      case "low-to-high":
        return a.price - b.price;
      case "alphabetical-a-z":
        return a.name.localeCompare(b.name);
      case "alphabetical-z-a":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <h2 className="text-4xl font-semibold text-center text-cyan-400 mb-8">
        Manage Your Inventory
      </h2>

      {/* Main filter and search bar container */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8">
        {/* Category Filter */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Search Bar - Centered and Large */}
        <div className="w-full max-w-lg">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Product Sorter */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <ProductSorter
            filterValue={sortOption}
            onFilterChange={handleSortChange}
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} user={user} />
          ))
        ) : (
          <p className="text-center text-white col-span-full">
            No products found. Please adjust your filters or try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default Inventory;
