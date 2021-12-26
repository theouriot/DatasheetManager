const db = require("../dataBase/index");

/* CRUD */

async function createIngredientStepJoin(idetape, idingredient, quantite) {
    try {
        const res = await db.query(
            "INSERT INTO ingredientetapejointure (idetape, idingredient, quantite) VALUES($1, $2, $3) RETURNING (idetape, idingredient);",
            [idetape, idingredient, quantite]
        );
        return res;
    } catch (e) {
        throw e;
    }
}

async function updateIngredientStepJoin(idetape, idingredient, quantite) {
    try {
        const res = await db.query("UPDATE ingredientetapejointure SET quantite = $3  WHERE idetape = $1 AND idingredient = $2;",
            [idetape, idingredient, quantite]);
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deleteIngredientStepJoin(idFicheTechniqueParent,idFicheTechniqueFille) {
    try {
        const res = await db.query("DELETE FROM FicheTechniqueJointure WHERE idfichetechniqueparent = $1 AND idfichetechniquefille = $2;",
            [idFicheTechniqueParent, idFicheTechniqueFille]);
        return res;
    } catch (e) {
        throw e;
    }
}

async function getAllIngredientStepJoin() {
    try {
        const res  = await db.query('SELECT * FROM ingredientetapejointure;')
        return res;
    } catch (e) {
        throw e;
    }
}

async function getIngredientStepJoinByStepId(idEtape) {
    try {
        const res = await db.query("SELECT idetape,numetape,titreetape,descriptionetape,tempsetape,idingredient,nomingredient,quantite,nomunite FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient Natural Join unite where idEtape = $1;",
            [idEtape]);
        return res;
    } catch (e) {
        throw e;
    }
}

async function getIngredientStepJoinByDataSheetID(idDataSheet,idIngredientCat) {
    try {
        const resA = await db.query(
            "SELECT idfichetechniquefille as nbfichetechnique FROM fichetechniquejointure WHERE idfichetechniqueparent=$1;",
            [idDataSheet]
        );
        const nbdefichetechniquefille = resA.rowCount;
        console.log(nbdefichetechniquefille)
        let resB =null;
        if(nbdefichetechniquefille > 0){ // on récupère les éléments des fiches techniques filles
            resB = await db.query(
                "SELECT idingredient,nomingredient,prixunitaireingredient,ROUND(sum((quantite/$2))) as sumquantite FROM fichetechnique f INNER JOIN fichetechniquejointure fj ON f.idfichetechnique=fj.idfichetechniqueparent NATURAL JOIN ingredientetapejointure NATURAL JOIN ingredient WHERE idfichetechnique = $1 AND idcategorieingredient = $3 GROUP by idingredient,nomingredient,prixunitaireingredient;",
                [idDataSheet,nbdefichetechniquefille,idIngredientCat]
            );
            return resB;
        }
        else{// aucune fiche technique fille
            resB = await db.query("SELECT idingredient,nomingredient,Sum(quantite) as sumquantite,prixunitaireingredient FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient Natural Join unite where idfichetechnique = $1 AND idcategorieingredient= $2 GROUP BY idingredient, nomingredient,prixunitaireingredient;",
                [idDataSheet,idIngredientCat]);
            return resB;
        }

    } catch (e) {
        throw e;
    }
}

async function getAllergenCatListStepId(idFicheTechnique) {
    try {
        const res = await db.query("SELECT DISTINCT idcategorieallergene,categorieallergene FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient NATURAL Join categorieallergene where idfichetechnique = $1 ORDER BY categorieallergene;",
            [idFicheTechnique]);
        return res;
    } catch (e) {
        throw e;
    }
}

async function getIngredientCatListStepId(idFicheTechnique) {
    try {
        const res = await db.query("SELECT DISTINCT idcategorieingredient,nomcategorieingredient FROM ingredientetapejointure NATURAL Join etape NATURAL Join ingredient NATURAL Join categorieingredient where idfichetechnique = $1 ORDER BY nomcategorieingredient;",
            [idFicheTechnique]);
        return res;
    } catch (e) {
        throw e;
    }
}

async function getAllergenListByCatAndStepId(idFicheTechnique,idCatAllergene) {
    try {
        const res = await db.query("SELECT DISTINCT nomingredient,idingredient FROM ingredientetapejointure NATURAL JOIN etape NATURAL JOIN ingredient NATURAL JOIN categorieallergene where idfichetechnique = $1 AND idcategorieallergene=$2 ORDER BY nomingredient;",
            [idFicheTechnique,idCatAllergene]);
        return res;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createIngredientStepJoin,
    updateIngredientStepJoin,
    deleteIngredientStepJoin,
    getAllIngredientStepJoin,
    getIngredientStepJoinByStepId,
    getAllergenCatListStepId,
    getAllergenListByCatAndStepId,
    getIngredientStepJoinByDataSheetID,
    getIngredientCatListStepId,
};
