import { useState } from "react";

export const PageSearch = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement search functionality
		console.log("Searching for:", searchTerm);
	};

	return (
		<div className="max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Search</h1>
			<form onSubmit={handleSearch} className="mb-6">
				<div className="flex gap-2">
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Enter your search term..."
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						Search
					</button>
				</div>
			</form>
			<div className="search-results">
				{/* Search results will be displayed here */}
			</div>
		</div>
	);
};
