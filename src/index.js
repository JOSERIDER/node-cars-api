require("dotenv").config();

const express = require("express");
const cors = require("cors");
let mockCars = require("./mock-data/cars.json");
const exp = express();
const notFound = require("./middleware/notFound");
const handleError = require("./middleware/handleError");
exp.use(cors());


const port = process.env.PORT;

exp.use(express.json());

exp.get("/", ((req, res) => {
  res.status(200);
  res.end();
}));


//Return a response with all cars in json format;
exp.get("/api/cars", ((req, res) => {
  res.status(202).json(mockCars);
}));

//Return a car with corresponding ID
exp.get("/api/cars/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = mockCars.find(car => car.id === id)
  if (!car) {
    return res.status(404).json({
      error: `Car with id: ${id} not found.`
    });
  }

  res.status(202).json(car);
});

//Delete a certain car by id.
exp.delete("/api/cars/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = mockCars.find(car => car.id === id);
  if (!car) {
    return res.status(404).json({
      error: `Car with id: ${id} not found.`
    });
  }
  mockCars = mockCars.filter(car => car.id !== id);

  res.status(201).end();
});

//Create a new car.
exp.post("/api/cars", (req, res, next) => {
  const body = req.body;
  const id = require("./utils/genId");

  const carIndex = mockCars.findIndex(car => car.id === id);
  if (carIndex === -1) {
      res.status(400).json({
        error: "Car with this id already exits"
      });
  }

  if (!body || body.brand === undefined) {
    const error = {
      name: "CastError",
      code: 430
    };
    next(error);

    return;
  }

  const newCar = {
    id: id,
    ...body
  };

  mockCars = [...mockCars, newCar];
  res.status(202).json(newCar);
});

exp.use(notFound);
exp.use(handleError);

exp.listen(port, () => {
  console.log(`Server is ready on ${port}`);
});

