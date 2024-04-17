"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv = __importStar(require("dotenv"));
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const dataBase_1 = require("../dataBase");
const user_1 = require("../entities/user");
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const activeSession_1 = require("../entities/activeSession");
const router = (0, express_1.Router)();
dotenv.config();
router.post("/user/login/", (0, express_validator_1.checkSchema)({
    email: {
        in: ["body"],
        isEmail: true,
        notEmpty: true,
        errorMessage: "email invalido, evita los espacios vacios o emails incorrectos."
    },
    password: {
        in: ["body"],
        isLength: {
            options: { max: 30, min: 8 },
            errorMessage: "max: 30 | min: 8 caracteres validos, contraseña incorrecta!"
        },
        isAlphanumeric: { errorMessage: "la constraseña solo debe contener letras y numeros" }
    },
    device: {
        in: ["body"],
        notEmpty: { errorMessage: "el dispositivo no puede tener campos vacios!" }
    }
}), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userToAuth = yield dataBase_1.appDataSource.getRepository(user_1.User).findOne({ where: { email: req.body["email"] } });
    if (!userToAuth)
        return res.status(401).send("el correo no existe!");
    if (!(yield bcrypt.compare(req.body["password"], userToAuth["password"])))
        return res.status(401).send("contraseña erronea!");
    const accessToken = yield jwt.sign({
        email: userToAuth["email"],
        id: userToAuth["id"]
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr"
    });
    const verifySession = yield dataBase_1.appDataSource.getRepository(activeSession_1.ActiveSession).findOne({ where: { userId: userToAuth } });
    if (verifySession)
        return res.status(403).json({ message: "el usuario ya esta logueado!" });
    const decodedToken = jwt.decode(accessToken, { json: true });
    const creationDate = new Date(decodedToken.iat * 1000);
    const expirationDate = new Date(decodedToken.exp * 1000);
    const activeSession = {
        userId: userToAuth,
        device: req.body["device"],
        creationDate: creationDate,
        expirationDate: expirationDate,
        jwt: accessToken
    };
    yield dataBase_1.appDataSource.getRepository(activeSession_1.ActiveSession).save(activeSession);
    return res.send({
        message: "logeo existoso!",
        jwt: accessToken,
        id: userToAuth.id,
    });
}));
router.post("/user/register/", (0, express_validator_1.checkSchema)({
    email: {
        in: ["body"],
        isEmail: true,
        notEmpty: true,
        errorMessage: "email invalido!!",
    },
    password: {
        in: ["body"],
        isLength: {
            options: { max: 30, min: 8 },
            errorMessage: "max: 30 | min: 8 caracteres! contraseña invalida"
        },
        isAlphanumeric: { errorMessage: "la contraseña debe contener solo letras y numeros!" }
    }
}), validateRequest_1.validateReq, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userAlreadyExists = yield dataBase_1.appDataSource.getRepository("user").findOne({ where: { email: req.body["email"] } });
        if (userAlreadyExists)
            return res.status(500).json({ message: "el usuario ya existe!" });
        const user = __rest(req.body, []);
        const newUser = Object.assign({}, user);
        newUser["password"] = yield bcrypt.hash(newUser["password"], 8);
        const data = yield dataBase_1.appDataSource.getRepository("user").save(newUser);
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
}));
exports.default = router;
