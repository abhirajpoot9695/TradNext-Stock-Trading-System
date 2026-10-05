require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://frontend-one-rho-56.vercel.app",
    "https://dashboard-tawny-nu-49.vercel.app",
];

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.set("trust proxy", 1);
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL }),

    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    },
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            // passport-local-mongoose v9's authenticate() returns a Promise
            // resolving to { user, error } when no callback is passed —
            // the old callback-style API this used to rely on no longer
            // reliably invokes its callback, which is why the request hangs.
            const result = await UserModel.authenticate()(email, password);

            if (result.user) {
                return done(null, result.user);
            }
            return done(null, false, { message: result.error?.message || "Invalid email or password" });
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("connection success to db");
    })
    .catch((err) => {
        console.log(err);
    });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send("Not logged in");
}

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send("Name, email, and password are required");
    }

    try {
        const user = await UserModel.register(new UserModel({ name, email }), password);

        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error logging in after signup");
            }
            res.status(201).json({ name: user.name, email: user.email });
        });
    } catch (err) {
        console.log(err);
        if (err.name === "UserExistsError") {
            return res.status(409).send("An account with this email already exists");
        }
        return res.status(500).send("Error creating account");
    }
});

app.post("/login", (req, res, next) => {
    console.log("===== LOGIN HIT =====");
    console.log(req.body);

    passport.authenticate("local", (err, user, info) => {
        console.log("passport callback");
        console.log("err:", err);
        console.log("user:", user);
        console.log("info:", info);

        if (err) {
            return res.status(500).send(err);
        }

        if (!user) {
            return res.status(401).send(info?.message || "No user");
        }

        req.login(user, (err) => {
            console.log("inside req.login");

            if (err) {
                return res.status(500).send(err);
            }

            console.log("Session after login:", req.session);

            req.session.save((err) => {
                if (err) {
                    return res.status(500).send(err);
                }

                console.log("Session saved");

                res.json({
                    success: true,
                    user,
                });
            });
        });
    })(req, res, next);
});
app.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send(err);

        req.session.destroy(() => {
            res.clearCookie("connect.sid", {
                sameSite: "none",
                secure: true,
            });

            res.send("Logged out");
        });
    });
});

app.get("/user", (req, res) => {
    console.log("========== USER ==========");
    console.log("Session ID:", req.sessionID);
    console.log("Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
    console.log("Session:", req.session);

    if (req.isAuthenticated()) {
        return res.json(req.user);
    }

    res.status(401).send("Not Logged in");
});

app.get("/allHoldings", ensureAuthenticated, async (req, res) => {
    try {
        let allholdings = await HoldingsModel.find({ user: req.user._id });
        res.json(allholdings);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching holdings");
    }
});

app.get("/allpositions", ensureAuthenticated, async (req, res) => {
    try {
        let allpositions = await PositionsModel.find({ user: req.user._id });
        res.json(allpositions);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching positions");
    }
});

app.get("/allorders", ensureAuthenticated, async (req, res) => {
    try {
        let allorders = await OrdersModel.find({ user: req.user._id });
        res.json(allorders);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching orders");
    }
});

app.post("/newOrder", ensureAuthenticated, async (req, res) => {
    try {
        const { name, qty, price, mode, product } = req.body;

        if (!name || !qty || !price || !mode) {
            return res.status(400).send("name, qty, price, and mode are required");
        }

        const quantity = Number(qty);
        const orderPrice = Number(price);
        const orderMode = String(mode).toUpperCase();
        const orderProduct = product === "MIS" ? "MIS" : "CNC";

        if (orderMode !== "BUY" && orderMode !== "SELL") {
            return res.status(400).send("mode must be BUY or SELL");
        }

        if (orderProduct === "MIS") {
            const existingPosition = await PositionsModel.findOne({ name, user: req.user._id });

            if (orderMode === "SELL") {
                if (!existingPosition || existingPosition.qty < quantity) {
                    return res.status(400).send("Not enough quantity to sell in this position");
                }

                const remainingQty = existingPosition.qty - quantity;

                if (remainingQty === 0) {
                    await PositionsModel.deleteOne({ _id: existingPosition._id });
                } else {
                    existingPosition.qty = remainingQty;
                    existingPosition.price = orderPrice;
                    await existingPosition.save();
                }
            } else {
                if (existingPosition) {
                    const totalCost = existingPosition.avg * existingPosition.qty + orderPrice * quantity;
                    const totalQty = existingPosition.qty + quantity;

                    existingPosition.avg = totalCost / totalQty;
                    existingPosition.qty = totalQty;
                    existingPosition.price = orderPrice;
                    await existingPosition.save();
                } else {
                    const newPosition = new PositionsModel({
                        user: req.user._id,
                        product: "MIS",
                        name,
                        qty: quantity,
                        avg: orderPrice,
                        price: orderPrice,
                        net: "0.00%",
                        day: "0.00%",
                    });
                    await newPosition.save();
                }
            }
        } else {
            const existingHolding = await HoldingsModel.findOne({ name, user: req.user._id });

            if (orderMode === "SELL") {
                if (!existingHolding || existingHolding.qty < quantity) {
                    return res.status(400).send("Not enough quantity to sell");
                }

                const remainingQty = existingHolding.qty - quantity;

                if (remainingQty === 0) {
                    await HoldingsModel.deleteOne({ _id: existingHolding._id });
                } else {
                    existingHolding.qty = remainingQty;
                    existingHolding.price = orderPrice;
                    await existingHolding.save();
                }
            } else {
                if (existingHolding) {
                    const totalCost = existingHolding.avg * existingHolding.qty + orderPrice * quantity;
                    const totalQty = existingHolding.qty + quantity;

                    existingHolding.avg = totalCost / totalQty;
                    existingHolding.qty = totalQty;
                    existingHolding.price = orderPrice;
                    await existingHolding.save();
                } else {
                    const newHolding = new HoldingsModel({
                        user: req.user._id,
                        name,
                        qty: quantity,
                        avg: orderPrice,
                        price: orderPrice,
                        net: "0.00%",
                        day: "0.00%",
                    });
                    await newHolding.save();
                }
            }
        }

        const newOrder = new OrdersModel({
            user: req.user._id,
            name,
            qty: quantity,
            price: orderPrice,
            mode: orderMode,
            product: orderProduct,
        });
        await newOrder.save();

        res.send(`${orderMode} order placed successfully (${orderProduct})`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error placing order");
    }
});

app.listen(PORT, () => {
    console.log(`listening to the port ${PORT}`);
});
