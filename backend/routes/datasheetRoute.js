const express = require("express");
const router = express.Router();

const DatasheetController = require("../controllers/datasheetController");

router.get("/allDatasheets", async function (req, res, next) {
    try {
        const Datasheet = await DatasheetController.getAllDatasheets();
        res.status(200).json({ message: Datasheet})
    } catch (e) {
        res.status(500).json({ message: "can't load data" });
    }
});

router.get("/", async function (req, res, next) {
    try {
        const idDatasheet = req.query.id;
        const Datasheet = await DatasheetController.getDatasheetByID(idDatasheet)
        if (!Datasheet) {
            return res.status(400).json({error: "Aucune fiche technique"});
        }
        res.status(200).json({ message: Datasheet})
    } catch (e) {
        return res.status(500).json({error: "Impossible d'accéder à la liste des fiches technique"});
    }
});

router.post("/add", async function (req, res, next) {
    try {
        await DatasheetController.createDatasheet(req.body)
        res.status(200).json({ message:  "Ajout effectué"})
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "can't load data" });
    }
});

router.delete("/delete", async function (req, res, next) {
    try {
        const idDatasheet = req.query.id;
        const Datasheet = await DatasheetController.deleteDatasheet(idDatasheet)
        if (!Datasheet) {
            return res.status(400).json({error: "Aucune fiche technique avec cet id"});
        }
        res.status(200).json({ message: "Suppresion effectuée"})
    } catch (e) {
        res.status(500).json({ message: "can't load data" });
    }
});

router.put("/", async function (req, res, next) {
    try {
        const idDatasheet = req.query.id;
        console.log(idDatasheet)
        console.log(req.body)
        const Datasheet = await DatasheetController.updateDatasheet(idDatasheet, req.body)
        if (!Datasheet) {
            return res.status(400).json({error: "Aucune fiche technique avec cet id"});
        }
        res.status(200).json({ message: "Modification effectuée"})
    } catch (e) {
        res.status(500).json({ message: "can't load data" });
    }
});
module.exports = router;