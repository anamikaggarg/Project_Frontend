import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <Search className="text-gray-500 h-4 w-4 lg:w-5 lg:h-5" />
      <input type="text" placeholder="Search for student ,programs , assignments" className="p-2 w-full lg:text-sm text-xs outline-0 border-0" />
    </div>
  );
};

export default SearchBar;
