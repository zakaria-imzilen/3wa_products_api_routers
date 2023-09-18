const express = require("express");

const productsRouter = express.Router({});
let products = [
	{ id: 1, name: "iPhone 12 Pro", price: 1099.99 },
	{ id: 2, name: "Samsung Galaxy S21", price: 999.99 },
	{ id: 3, name: "Sony PlayStation 5", price: 499.99 },
	{ id: 4, name: "MacBook Pro 16", price: 2399.99 },
	{ id: 5, name: "DJI Mavic Air 2", price: 799.99 },
];

// GET /products/search?q=play&minPrice=400&maxPrice=7000
productsRouter.get("/search", (req, res) => {
	// 1- Check if the q query param exists
	const { minPrice, maxPrice } = req.query;
	// {minPrice: 400, maxPrice: 7000}

	if (req.query.q) {
		const filterPrdcsByName = products.filter((prd) =>
			prd.name.toLowerCase().includes(req.query.q.toLowerCase())
		); // Returns a filter array with the mentionned search q

		if (filterPrdcsByName.length == 0) {
			res.status(404).send({ message: "No such product with that name" });
			return;
		}

		// 2- Otherwise: Filter by q AND by Price interval
		const filterProdsByPrcs = filterPrdcsByName.filter(
			(prd) => prd.price > Number(minPrice) && prd.price < Number(maxPrice)
		);

		if (filterProdsByPrcs.length === 0) {
			res.status(404).send({ message: "No such product in that interval" });
			return;
		}

		res.status(200).send(filterProdsByPrcs);
	} else {
		const filterProdsByPrcs = products.filter(
			(prd) => prd.price > Number(minPrice) && prd.price < Number(maxPrice)
		);

		if (filterProdsByPrcs.length === 0) {
			res.status(404).send({ message: "No such product in that interval" });
			return;
		}

		res.status(200).send(filterProdsByPrcs);
	}
});

productsRouter.get("/:id", (req, res) => {
	const findPrd = products.find((prd) => prd.id == req.params.id);

	if (!findPrd) {
		res.status(404).send({ message: "Product not found" });
		return;
	}

	res.status(201).send(findPrd);
});

productsRouter.get("/", (req, res) => {
	res.send(products);
});

productsRouter.post("/", (req, res) => {
	// 1- Push it directly to the array
	products.push({ id: products.length + 1, ...req.body });

	res.status(200).send(products);
});

// PUT
// 1- /products/:id
productsRouter.put("/:id", (req, res) => {
	// 1-1- Check if the product with the provided id exists
	const findingPrd = products.find((prd) => prd.id == req.params.id);

	if (!findingPrd) {
		res.status(404).send({ message: "Product not found" });
		return;
	}

	products = products.map((prd) => {
		return prd.id == req.params.id
			? {
					// 2- BODY: {name: 'anaJdid', price: 'anaJdid'}
					...prd,
					...req.body,
			  }
			: prd;
	});

	res.status(200).send({ message: "Product updated successfuly", products });
});

module.exports = productsRouter;
